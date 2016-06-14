# -*- coding: utf-8 -*-
from functools import wraps
from io import BytesIO
import datetime as dt
import gzip
import json

from flask import Blueprint, current_app, jsonify, request, g

from doorman.database import db
from doorman.extensions import log_tee
from doorman.models import (
    Node, Pack, Query, Tag,
    DistributedQuery, DistributedQueryTask, DistributedQueryResult,
    StatusLog,
)
from doorman.tasks import analyze_result
from doorman.utils import process_result


blueprint = Blueprint('api', __name__)


@blueprint.before_request
def before_request():
    if not current_app.config['GRAPHITE_ENABLED']:
        return

    metrics = current_app.metrics.get(request.endpoint)
    if not metrics:
        return

    metrics.count.mark()

    # scales.PmfStat's timer is a context manager, allowing
    # you to wrap a block of code to be timed within a with
    # statement. In Flask, we need to call __enter__ and
    # __exit__ manually and attach the TimeManager returned
    # to the Flask thread local g to achieve the same effect
    # when using Flask's before_request and teardown_request
    # decorators.

    g.timer = metrics.latency.time().__enter__()


@blueprint.teardown_request
def teardown_request(*args, **kwargs):
    if not current_app.config['GRAPHITE_ENABLED']:
        return

    try:
        g.timer.__exit__()
    except Exception:
        current_app.logger.exception("Timing not available for %r",
                                     request.endpoint)


def node_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # in v1.7.4, the Content-Encoding header is set when
        # --logger_tls_compress=true
        if 'Content-Encoding' in request.headers and \
            request.headers['Content-Encoding'] == 'gzip':
            request._cached_data = gzip.GzipFile(fileobj=BytesIO(request.get_data())).read()

        request_json = request.get_json()

        if not request_json:
            current_app.logger.error(
                "Request did not contain valid JSON data. This could be an "
                "attempt to gather information about this endpoint or an "
                "automated scanner."
            )
            # Return nothing
            return ""

        node_key = request.get_json().get('node_key')
        node = Node.query.filter(Node.node_key == node_key).first()
        if not node:
            current_app.logger.error("Could not find node with node_key %s",
                                     node_key)
            return jsonify(node_invalid=True)
        return f(node=node, *args, **kwargs)
    return decorated_function


@blueprint.route('/')
def index():
    return '', 204


@blueprint.route('/enroll', methods=['POST', 'PUT'])
@blueprint.route('/v1/enroll', methods=['POST', 'PUT'])
def enroll():
    '''
    Enroll an endpoint with osquery.

    :returns: a `node_key` unique id. Additionally `node_invalid` will
        be true if the node failed to enroll.
    '''
    request_json = request.get_json()
    if not request_json:
        current_app.logger.error(
            "Request did not contain valid JSON data. This could be an "
            "attempt to gather information about this endpoint or an "
            "automated scanner."
        )
        # Return nothing
        return ""

    enroll_secret = request_json.get(
        current_app.config.get('DOORMAN_ENROLL_OVERRIDE', 'enroll_secret'))

    if not enroll_secret:
        current_app.logger.error("No enroll_secret provided by remote host %s",
                                 request.remote_addr)
        return jsonify(node_invalid=True)

    # If we pre-populate node table with a per-node enroll_secret,
    # let's query it now.

    node = Node.query.filter(Node.enroll_secret == enroll_secret).first()

    if not node and enroll_secret not in current_app.config['DOORMAN_ENROLL_SECRET']:
        current_app.logger.error("Invalid enroll_secret %s", enroll_secret)
        return jsonify(node_invalid=True)

    host_identifier = request_json.get('host_identifier')

    if node and node.enrolled_on:
        current_app.logger.warn("%s already enrolled on %s, returning "
                                "existing node_key", node, node.enrolled_on)

        if node.host_identifier != host_identifier:
            current_app.logger.info("%s changed their host_identifier to %s",
                                    node, host_identifier)
            node.update(host_identifier=host_identifier)

        return jsonify(node_key=node.node_key, node_invalid=False)

    existing_node = None
    if host_identifier:
        existing_node = Node.query.filter(
            Node.host_identifier == host_identifier
        ).first()

    if existing_node and not existing_node.enroll_secret:
        current_app.logger.warning(
            "Duplicate host_identifier %s, already enrolled %s",
            host_identifier, existing_node.enrolled_on)

        if current_app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] is True:
            current_app.logger.info(
                "Unique host identification is true, %s already enrolled "
                "returning existing node key %s",
                host_identifier, existing_node.node_key)
            return jsonify(node_key=existing_node.node_key, node_invalid=False)

    now = dt.datetime.utcnow()

    if node:
        node.update(host_identifier=host_identifier,
                    last_checkin=now,
                    enrolled_on=now)
    else:
        node = Node(host_identifier=host_identifier,
                    last_checkin=now,
                    enrolled_on=now)

        for value in current_app.config.get('DOORMAN_ENROLL_DEFAULT_TAGS', []):
            tag = Tag.query.filter_by(value=value).first()
            if tag and tag not in node.tags:
                node.tags.append(tag)
            elif not tag:
                node.tags.append(Tag(value=value))

        node.save()

    current_app.logger.info("Enrolled new node %s", node)

    # if we have configured doorman to capture system information
    # upon new node enrollment, then create a distributed query task
    # to collect this information from the system_info table asap.

    if current_app.config['DOORMAN_CAPTURE_SYSTEM_INFO']:
        description = 'doorman builtin - capture system info'
        sql = 'select * from system_info;'

        query = DistributedQuery.query.filter_by(description=description).first()
        if not query:
            query = DistributedQuery.create(sql=sql, description=description)

        task = DistributedQueryTask.create(node_id=node.id, distributed_query=query)

    return jsonify(node_key=node.node_key, node_invalid=False)


@blueprint.route('/config', methods=['POST', 'PUT'])
@blueprint.route('/v1/config', methods=['POST', 'PUT'])
@node_required
def configuration(node=None):
    '''
    Retrieve an osquery configuration for a given node.

    :returns: an osquery configuration file
    '''
    current_app.logger.info("%s checking in to retrieve a new configuration",
                            node)
    config = node.get_config()
    node.update(last_checkin=dt.datetime.utcnow())
    return jsonify(config, node_invalid=False)


@blueprint.route('/log', methods=['POST', 'PUT'])
@blueprint.route('/v1/log', methods=['POST', 'PUT'])
@node_required
def logger(node=None):
    '''
    '''
    data = request.get_json()
    log_type = data['log_type']
    debug = current_app.config['DEBUG']

    if debug:
        current_app.logger.debug(json.dumps(data, indent=2))

    if log_type == 'status':
        log_tee.handle_status(data, host_identifier=node.host_identifier)
        for item in data.get('data', []):
            status_log = StatusLog(node=node, **item)
            db.session.add(status_log)
        else:
            db.session.commit()

    elif log_type == 'result':
        log_tee.handle_result(data, host_identifier=node.host_identifier)
        analyze_result.delay(data, node.to_dict())
        db.session.bulk_save_objects(process_result(data, node))
        db.session.commit()

    else:
        current_app.logger.error("Unknown log_type %r", log_type)
        current_app.logger.info(json.dumps(data))

    return jsonify(node_invalid=False)


@blueprint.route('/distributed/read', methods=['POST', 'PUT'])
@blueprint.route('/v1/distributed/read', methods=['POST', 'PUT'])
@node_required
def distributed_read(node=None):
    '''
    '''
    data = request.get_json()
    current_app.logger.info("%s checking in to retrieve distributed queries",
                            node)
    queries = node.get_new_queries()
    node.update(last_checkin=dt.datetime.utcnow(), commit=False)
    db.session.add(node)
    db.session.commit()

    return jsonify(queries=queries, node_invalid=False)


@blueprint.route('/distributed/write', methods=['POST', 'PUT'])
@blueprint.route('/v1/distributed/write', methods=['POST', 'PUT'])
@node_required
def distributed_write(node=None):
    '''
    '''
    data = request.get_json()
    current_app.logger.info("Got data: %s", data)

    for guid, results in data.get('queries', {}).items():
        task = DistributedQueryTask.query.filter(
            DistributedQueryTask.guid == guid,
            DistributedQueryTask.status == DistributedQueryTask.PENDING,
            DistributedQueryTask.node == node,
        ).first()

        if not task:
            current_app.logger.error("Got result for distributed query not "
                                     "in PENDING state: %s: %s",
                                     guid, json.dumps(data))
            continue

        for columns in results:
            result = DistributedQueryResult(columns,
                                            distributed_query=task.distributed_query,
                                            distributed_query_task=task)
            db.session.add(result)
        else:
            task.status = DistributedQueryTask.COMPLETE
            db.session.add(task)

    else:
        db.session.commit()

    return jsonify(node_invalid=False)
