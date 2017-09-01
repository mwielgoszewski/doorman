# -*- coding: utf-8 -*-
from functools import wraps
from io import BytesIO
import datetime as dt
import gzip
import json

from flask import Blueprint, current_app, jsonify, request

from doorman.database import db
from doorman.extensions import log_tee
from doorman.models import (
    Node, Tag,
    DistributedQueryTask, DistributedQueryResult,
    StatusLog,
)
from doorman.tasks import analyze_result, notify_of_node_enrollment
from doorman.utils import process_result


blueprint = Blueprint('api', __name__)


def node_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # in v1.7.4, the Content-Encoding header is set when
        # --logger_tls_compress=true
        if 'Content-Encoding' in request.headers and \
            request.headers['Content-Encoding'] == 'gzip':
            request._cached_data = gzip.GzipFile(
                fileobj=BytesIO(request.get_data())).read()

        request_json = request.get_json()

        if not request_json or 'node_key' not in request_json:
            current_app.logger.error(
                "%s - Request did not contain valid JSON data. This could "
                "be an attempt to gather information about this endpoint "
                "or an automated scanner.",
                request.remote_addr
            )
            # Return nothing
            return ""

        node_key = request_json.get('node_key')
        node = Node.query.filter_by(node_key=node_key) \
            .options(db.lazyload('*')).first()

        if not node:
            current_app.logger.error(
                "%s - Could not find node with node_key %s",
                request.remote_addr, node_key
            )
            return jsonify(node_invalid=True)

        if not node.is_active:
            current_app.logger.error(
                "%s - Node %s came back from the dead!",
                request.remote_addr, node_key
            )
            return jsonify(node_invalid=True)

        node.update(
            last_checkin=dt.datetime.utcnow(),
            last_ip=request.remote_addr,
            commit=False
        )

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
            "%s - Request did not contain valid JSON data. This could "
            "be an attempt to gather information about this endpoint "
            "or an automated scanner.",
            request.remote_addr
        )
        # Return nothing
        return ""

    enroll_secret = request_json.get(
        current_app.config.get('DOORMAN_ENROLL_OVERRIDE', 'enroll_secret'))

    if not enroll_secret:
        current_app.logger.error(
            "%s - No enroll_secret provided by remote host",
            request.remote_addr
        )
        return jsonify(node_invalid=True)

    # If we pre-populate node table with a per-node enroll_secret,
    # let's query it now.

    if current_app.config.get('DOORMAN_ENROLL_SECRET_TAG_DELIMITER'):
        delimiter = current_app.config.get('DOORMAN_ENROLL_SECRET_TAG_DELIMITER')
        enroll_secret, _, enroll_tags = enroll_secret.partition(delimiter)
        enroll_tags = set([tag.strip() for tag in enroll_tags.split(delimiter)[:10]])
    else:
        enroll_secret, enroll_tags = enroll_secret, set()

    node = Node.query.filter(Node.enroll_secret == enroll_secret).first()

    if not node and enroll_secret not in current_app.config['DOORMAN_ENROLL_SECRET']:
        current_app.logger.error("%s - Invalid enroll_secret %s",
            request.remote_addr, enroll_secret
        )
        return jsonify(node_invalid=True)

    host_identifier = request_json.get('host_identifier')

    if node and node.enrolled_on:
        current_app.logger.warn(
            "%s - %s already enrolled on %s, returning existing node_key",
            request.remote_addr, node, node.enrolled_on
        )

        if node.host_identifier != host_identifier:
            current_app.logger.info(
                "%s - %s changed their host_identifier to %s",
                request.remote_addr, node, host_identifier
            )
            node.host_identifier = host_identifier

        node.update(
            last_checkin=dt.datetime.utcnow(),
            last_ip=request.remote_addr
        )

        return jsonify(node_key=node.node_key, node_invalid=False)

    existing_node = None
    if host_identifier:
        existing_node = Node.query.filter(
            Node.host_identifier == host_identifier
        ).first()

    if existing_node and not existing_node.enroll_secret:
        current_app.logger.warning(
            "%s - Duplicate host_identifier %s, already enrolled %s",
            request.remote_addr, host_identifier, existing_node.enrolled_on
        )

        if current_app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] is True:
            current_app.logger.info(
                "%s - Unique host identification is true, %s already enrolled "
                "returning existing node key %s",
                request.remote_addr, host_identifier, existing_node.node_key
            )
            existing_node.update(
                last_checkin=dt.datetime.utcnow(),
                last_ip=request.remote_addr
            )
            return jsonify(node_key=existing_node.node_key, node_invalid=False)

    now = dt.datetime.utcnow()

    if node:
        node.update(host_identifier=host_identifier,
                    last_checkin=now,
                    enrolled_on=now,
                    last_ip=request.remote_addr)
    else:
        node = Node(host_identifier=host_identifier,
                    last_checkin=now,
                    enrolled_on=now,
                    last_ip=request.remote_addr)

        enroll_tags.update(current_app.config.get('DOORMAN_ENROLL_DEFAULT_TAGS', []))

        for value in sorted((t.strip() for t in enroll_tags if t)):
            tag = Tag.query.filter_by(value=value).first()
            if tag and tag not in node.tags:
                node.tags.append(tag)
            elif not tag:
                node.tags.append(Tag(value=value))

        node.save()

    current_app.logger.info("%s - Enrolled new node %s",
        request.remote_addr, node
    )

    notify_of_node_enrollment.delay(node.to_dict())

    return jsonify(node_key=node.node_key, node_invalid=False)


@blueprint.route('/config', methods=['POST', 'PUT'])
@blueprint.route('/v1/config', methods=['POST', 'PUT'])
@node_required
def configuration(node=None):
    '''
    Retrieve an osquery configuration for a given node.

    :returns: an osquery configuration file
    '''
    current_app.logger.info(
        "%s - %s checking in to retrieve a new configuration",
        request.remote_addr, node
    )
    config = node.get_config()

    # write last_checkin, last_ip
    db.session.add(node)
    db.session.commit()
    return jsonify(config, node_invalid=False)


@blueprint.route('/log', methods=['POST', 'PUT'])
@blueprint.route('/v1/log', methods=['POST', 'PUT'])
@node_required
def logger(node=None):
    '''
    '''
    data = request.get_json()
    log_type = data['log_type']
    log_level = current_app.config['DOORMAN_MINIMUM_OSQUERY_LOG_LEVEL']

    if current_app.debug:
        current_app.logger.debug(json.dumps(data, indent=2))

    if log_type == 'status':
        log_tee.handle_status(data, host_identifier=node.host_identifier)
        status_logs = []
        for item in data.get('data', []):
            if int(item['severity']) < log_level:
                continue
            status_logs.append(StatusLog(node_id=node.id, **item))
        else:
            db.session.add(node)
            db.session.bulk_save_objects(status_logs)
            db.session.commit()

    elif log_type == 'result':
        db.session.add(node)
        db.session.bulk_save_objects(process_result(data, node))
        db.session.commit()
        log_tee.handle_result(data, host_identifier=node.host_identifier)
        analyze_result.delay(data, node.to_dict())

    else:
        current_app.logger.error("%s - Unknown log_type %r",
            request.remote_addr, log_type
        )
        current_app.logger.info(json.dumps(data))
        # still need to write last_checkin, last_ip
        db.session.add(node)
        db.session.commit()

    return jsonify(node_invalid=False)


@blueprint.route('/distributed/read', methods=['POST', 'PUT'])
@blueprint.route('/v1/distributed/read', methods=['POST', 'PUT'])
@node_required
def distributed_read(node=None):
    '''
    '''
    data = request.get_json()

    current_app.logger.info(
        "%s - %s checking in to retrieve distributed queries",
        request.remote_addr, node
    )

    queries = node.get_new_queries()

    # need to write last_checkin, last_ip, and update distributed
    # query state
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

    if current_app.debug:
        current_app.logger.debug(json.dumps(data, indent=2))

    queries = data.get('queries', {})
    statuses = data.get('statuses', {})

    for guid, results in queries.items():
        task = DistributedQueryTask.query.filter(
            DistributedQueryTask.guid == guid,
            DistributedQueryTask.status == DistributedQueryTask.PENDING,
            DistributedQueryTask.node == node,
        ).first()

        if not task:
            current_app.logger.error(
                "%s - Got result for distributed query not in PENDING "
                "state: %s: %s",
                request.remote_addr, guid, json.dumps(data)
            )
            continue

        # non-zero status indicates sqlite errors

        if not statuses.get(guid, 0):
            status = DistributedQueryTask.COMPLETE
        else:
            current_app.logger.error(
                "%s - Got non-zero status code (%d) on distributed query %s",
                request.remote_addr, statuses.get(guid), guid
            )
            status = DistributedQueryTask.FAILED

        for columns in results:
            result = DistributedQueryResult(
                columns,
                distributed_query=task.distributed_query,
                distributed_query_task=task
            )
            db.session.add(result)
        else:
            task.status = status
            db.session.add(task)

    else:
        # need to write last_checkin, last_ip on node
        db.session.add(node)
        db.session.commit()

    return jsonify(node_invalid=False)
