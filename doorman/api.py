# -*- coding: utf-8 -*-
from functools import wraps
import datetime as dt
import json

from flask import Blueprint, current_app, jsonify, request

from doorman.database import db
from doorman.extensions import log_tee
from doorman.models import (Node, Pack, Query, Tag,
    DistributedQuery, DistributedQueryResult,
    StatusLog,
)
from doorman.utils import process_result


blueprint = Blueprint('api', __name__)


def node_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
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


@blueprint.route('/enroll', methods=['POST'])
@blueprint.route('/v1/enroll', methods=['POST'])
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
        node = Node.create(host_identifier=host_identifier,
                           last_checkin=now,
                           enrolled_on=now)

    current_app.logger.info("Enrolled new node %s", node)

    return jsonify(node_key=node.node_key, node_invalid=False)


@blueprint.route('/config', methods=['POST'])
@blueprint.route('/v1/config', methods=['POST'])
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


@blueprint.route('/log', methods=['POST'])
@blueprint.route('/v1/log', methods=['POST'])
@node_required
def logger(node=None):
    '''
    '''
    data = request.get_json()
    log_type = data['log_type']
    log_level = current_app.config['DOORMAN_OSQUERY_STATUS_LOG_LEVEL']
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
        process_result(data, node)

    else:
        current_app.logger.error("Unknown log_type %r", log_type)
        current_app.logger.info(json.dumps(data))

    return jsonify(node_invalid=False)


@blueprint.route('/distributed/read', methods=['POST'])
@blueprint.route('/v1/distributed/read', methods=['POST'])
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


@blueprint.route('/distributed/write', methods=['POST'])
@blueprint.route('/v1/distributed/write', methods=['POST'])
@node_required
def distributed_write(node=None):
    '''
    '''
    data = request.get_json()
    current_app.logger.info("Got data: %s", data)

    for guid, data in data.get('queries', {}).items():
        query = DistributedQuery.query.filter(
            DistributedQuery.guid == guid,
            DistributedQuery.status == DistributedQuery.PENDING,
            DistributedQuery.node == node,
        ).first()

        if not query:
            current_app.logger.error("Got result for distributed query not "
                                     "in PENDING state: %s: %s",
                                     guid, json.dumps(data))
            continue

        result = DistributedQueryResult(data, distributed_query=query)
        query.status = DistributedQuery.COMPLETE
        db.session.add(result, query)

    else:
        db.session.commit()

    return jsonify(node_invalid=False)
