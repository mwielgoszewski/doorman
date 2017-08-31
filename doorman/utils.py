# -*- coding: utf-8 -*-
from collections import namedtuple
from operator import itemgetter
from os.path import basename, join, splitext
import datetime as dt
import json
import pkg_resources
import sqlite3
import string
import threading

import six
from flask import current_app, flash

from doorman.database import db
from doorman.models import (
    DistributedQuery, DistributedQueryTask,
    Node, Pack, Query, ResultLog, querypacks,
)


Field = namedtuple('Field', ['name', 'action', 'columns', 'timestamp'])


# Read DDL statements from our package
schema = pkg_resources.resource_string('doorman', join('resources', 'osquery_schema.sql'))
schema = schema.decode('utf-8')
schema = [x for x in schema.strip().split('\n') if not x.startswith('--')]

# SQLite in Python will complain if you try to use it from multiple threads.
# We create a threadlocal variable that contains the DB, lazily initialized.
osquery_mock_db = threading.local()


def assemble_configuration(node):
    configuration = {}
    configuration['options'] = assemble_options(node)
    configuration['file_paths'] = assemble_file_paths(node)
    configuration['schedule'] = assemble_schedule(node)
    configuration['packs'] = assemble_packs(node)
    return configuration


def assemble_options(node):
    options = {}

    # https://github.com/facebook/osquery/issues/2048#issuecomment-219200524
    if current_app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID']:
        options['host_identifier'] = 'uuid'
    else:
        options['host_identifier'] = 'hostname'

    options['schedule_splay_percent'] = 10
    return options


def assemble_file_paths(node):
    file_paths = {}
    for file_path in node.file_paths.options(db.lazyload('*')):
        file_paths.update(file_path.to_dict())
    return file_paths


def assemble_schedule(node):
    schedule = {}
    for query in node.queries.options(db.lazyload('*')):
        schedule[query.name] = query.to_dict()
    return schedule


def assemble_packs(node):
    packs = {}
    for pack in node.packs.join(querypacks).join(Query) \
        .options(db.contains_eager(Pack.queries)).all():
        packs[pack.name] = pack.to_dict()
    return packs


def assemble_distributed_queries(node):
    '''
    Retrieve all distributed queries assigned to a particular node
    in the NEW state. This function will change the state of the
    distributed query to PENDING, however will not commit the change.
    It is the responsibility of the caller to commit or rollback on the
    current database session.
    '''
    now = dt.datetime.utcnow()
    query = db.session.query(DistributedQueryTask) \
        .join(DistributedQuery) \
        .filter(
            DistributedQueryTask.node == node,
            DistributedQueryTask.status == DistributedQueryTask.NEW,
            DistributedQuery.not_before < now,
        ).options(
            db.lazyload('*'),
            db.contains_eager(DistributedQueryTask.distributed_query)
        )

    queries = {}
    for task in query:
        queries[task.guid] = task.distributed_query.sql
        task.update(status=DistributedQueryTask.PENDING,
                    timestamp=now,
                    commit=False)

        # add this query to the session, but don't commit until we're
        # as sure as we possibly can be that it's been received by the
        # osqueryd client. unfortunately, there are no guarantees though.
        db.session.add(task)
    return queries


def create_query_pack_from_upload(upload):
    '''
    Create a pack and queries from a query pack file. **Note**, if a
    pack already exists under the filename being uploaded, then any
    queries defined here will be added to the existing pack! However,
    if a query with a particular name already exists, and its sql is
    NOT the same, then a new query with the same name but different id
    will be created (as to avoid clobbering the existing query). If its
    sql is identical, then the query will be reused.

    '''
    # The json package on Python 3 expects a `str` input, so we're going to
    # read the body and possibly convert to the right type
    body = upload.data.read()
    if not isinstance(body, six.string_types):
        body = body.decode('utf-8')

    try:
        data = json.loads(body)
    except ValueError:
        flash(u"Could not load pack as JSON - ensure it is JSON encoded",
              'danger')
        return None
    else:
        if 'queries' not in data:
            flash(u"No queries in pack", 'danger')
            return None

        name = splitext(basename(upload.data.filename))[0]
        pack = Pack.query.filter(Pack.name == name).first()

    if not pack:
        current_app.logger.debug("Creating pack %s", name)
        pack = Pack.create(name=name, **data)

    for query_name, query in data['queries'].items():
        if not validate_osquery_query(query['query']):
            flash('Invalid osquery query: "{0}"'.format(query['query']), 'danger')
            return None

        q = Query.query.filter(Query.name == query_name).first()

        if not q:
            q = Query.create(name=query_name, **query)
            pack.queries.append(q)
            current_app.logger.debug("Adding new query %s to pack %s",
                                     q.name, pack.name)
            continue

        if q in pack.queries:
            continue

        if q.sql == query['query']:
            current_app.logger.debug("Adding existing query %s to pack %s",
                                     q.name, pack.name)
            pack.queries.append(q)
        else:
            q2 = Query.create(name=query_name, **query)
            current_app.logger.debug(
                "Created another query named %s, but different sql: %r vs %r",
                query_name, q2.sql.encode('utf-8'), q.sql.encode('utf-8'))
            pack.queries.append(q2)

    else:
        pack.save()
        flash(u"Imported query pack {0}".format(pack.name), 'success')

    return pack


def get_node_health(node):
    checkin_interval = current_app.config['DOORMAN_CHECKIN_INTERVAL']
    if isinstance(checkin_interval, (int, float)):
        checkin_interval = dt.timedelta(seconds=checkin_interval)
    if (dt.datetime.utcnow() - node.last_checkin) > checkin_interval:
        return u'danger'
    else:
        return ''


# Not super-happy that we're duplicating this both here and in the JS, but I
# couldn't think of a nice way to pass from JS --> Python (or the other
# direction).
PRETTY_OPERATORS = {
    'equal': 'equals',
    'not_equal': "doesn't equal",
    'begins_with': 'begins with',
    'not_begins_with': "doesn't begins with",
    'contains': 'contains',
    'not_contains': "doesn't contain",
    'ends_with': 'ends with',
    'not_ends_with': "doesn't end with",
    'is_empty': 'is empty',
    'is_not_empty': 'is not empty',
    'less': 'less than',
    'less_or_equal': 'less than or equal',
    'greater': 'greater than',
    'greater_or_equal': 'greater than or equal',
    'matches_regex': 'matches regex',
    'not_matches_regex': "doesn't match regex",
}

def pretty_operator(cond):
    return PRETTY_OPERATORS.get(cond, cond)


PRETTY_FIELDS = {
    'query_name': 'Query name',
    'action': 'Action',
    'host_identifier': 'Host identifier',
    'timestamp': 'Timestamp',
}

def pretty_field(field):
    return PRETTY_FIELDS.get(field, field)


# Since 'string.printable' includes control characters
PRINTABLE = string.ascii_letters + string.digits + string.punctuation + ' '


def quote(s, quote='"'):
    buf = [quote]
    for ch in s:
        if ch == quote or ch == '\\':
            buf.append('\\')
            buf.append(ch)
        elif ch == '\n':
            buf.append('\\n')
        elif ch == '\r':
            buf.append('\\r')
        elif ch == '\t':
            buf.append('\\t')
        elif ch in PRINTABLE:
            buf.append(ch)
        else:
            # Hex escape
            buf.append('\\x')
            buf.append(hex(ord(ch))[2:])

    buf.append(quote)
    return ''.join(buf)


def create_mock_db():
    mock_db = sqlite3.connect(':memory:')
    for ddl in schema:
        mock_db.execute(ddl)

    extra_schema = current_app.config.get('DOORMAN_EXTRA_SCHEMA', [])
    for ddl in extra_schema:
        mock_db.execute(ddl)

    return mock_db


def validate_osquery_query(query):
    # Check if this thread has an instance of the SQLite database
    db = getattr(osquery_mock_db, 'db', None)
    if db is None:
        db = create_mock_db()
        osquery_mock_db.db = db

    try:
        db.execute(query)
    except sqlite3.Error:
        current_app.logger.exception("Invalid query: %s", query)
        return False

    return True


def learn_from_result(result, node):
    if not result['data']:
        return

    capture_columns = set(
        map(itemgetter(0),
            current_app.config['DOORMAN_CAPTURE_NODE_INFO']
        )
    )

    if not capture_columns:
        return

    node_info = node.get('node_info', {})
    orig_node_info = node_info.copy()

    for _, action, columns, _, in extract_results(result):
        # only update columns common to both sets
        for column in capture_columns & set(columns):

            cvalue = node_info.get(column)  # current value
            value = columns.get(column)

            if action == 'removed' and (cvalue is None or cvalue != value):
                pass
            elif action == 'removed' and cvalue == value:
                node_info.pop(column)
            elif action == 'added' and (cvalue is None or cvalue != value):
                node_info[column] = value

    # only update node_info if there's actually a change

    if orig_node_info == node_info:
        return

    node = Node.get_by_id(node['id'])
    node.update(node_info=node_info)
    return


def process_result(result, node):
    if not result['data']:
        current_app.logger.error("No results to process from %s", node)
        return

    for name, action, columns, timestamp, in extract_results(result):
        yield ResultLog(name=name,
                        action=action,
                        columns=columns,
                        timestamp=timestamp,
                        node_id=node.id)


def extract_results(result):
    """
    extract_results will convert the incoming log data into a series of Fields,
    normalizing and/or aggregating both batch and event format into batch
    format, which is used throughout the rest of doorman.
    """
    if not result['data']:
        return

    timefmt = '%a %b %d %H:%M:%S %Y UTC'
    strptime = dt.datetime.strptime

    for entry in result['data']:
        name = entry['name']
        timestamp = strptime(entry['calendarTime'], timefmt)

        if 'columns' in entry:
            yield Field(name=name,
                        action=entry['action'],
                        columns=entry['columns'],
                        timestamp=timestamp)

        elif 'diffResults' in entry:
            added = entry['diffResults']['added']
            removed = entry['diffResults']['removed']
            for (action, items) in (('added', added), ('removed', removed)):
                # items could be "", so we're still safe to iter over
                # and ensure we don't return an empty value for columns
                for columns in items:
                    yield Field(name=name,
                                action=action,
                                columns=columns,
                                timestamp=timestamp)

        elif 'snapshot' in entry:
            for columns in entry['snapshot']:
                yield Field(name=name,
                            action='snapshot',
                            columns=columns,
                            timestamp=timestamp)

        else:
            current_app.logger.error("Encountered a result entry that "
                                     "could not be processed! %s",
                                     json.dumps(entry))


def flash_errors(form):
    '''http://flask.pocoo.org/snippets/12/'''
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the {0} field - {1}".format(
                getattr(form, field).label.text, error
            )
            flash(message, 'danger')


def get_paginate_options(request, model, choices, existing_query=None,
                         default='id', page=1, max_pp=20, default_sort='asc'):

    try:
        per_page = int(request.args.get('pp', max_pp))
    except Exception:
        per_page = 20

    per_page = max(0, min(max_pp, per_page))

    order_by = request.args.get('order_by', 'id')
    if order_by not in choices:
        order_by = default
    order_by = getattr(model, order_by, 'id')

    sort = request.args.get('sort', default_sort)
    if sort not in ('asc', 'desc'):
        sort = default_sort

    order_by = getattr(order_by, sort)()

    if existing_query:
        query = existing_query.order_by(order_by)
    else:
        query = model.query.order_by(order_by)

    query = query.paginate(page=page, per_page=per_page)
    return query


class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, dt.datetime):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)
