# -*- coding: utf-8 -*-
from os.path import basename, splitext
import datetime as dt
import json
import pkg_resources
import sqlite3

from flask import current_app, flash


# Read DDL statements from our package
schema = pkg_resources.resource_string('doorman', 'osquery_schema.sql')

# Create mock database with these statements
osquery_mock_db = sqlite3.connect(':memory:')
for ddl in schema.strip().split('\n'):
    # Skip comments
    if ddl.startswith('--'):
        continue

    osquery_mock_db.execute(ddl)


def assemble_configuration(node):
    configuration = {}
    configuration['options'] = assemble_options(node)
    configuration['file_paths'] = assemble_file_paths(node)
    configuration['schedule'] = assemble_schedule(node)
    configuration['packs'] = assemble_packs(node)
    return configuration


def assemble_options(node):
    options = {}
    options['host_identifier'] = node.host_identifier
    options['schedule_splay_percent'] = 10
    return options


def assemble_file_paths(node):
    file_paths = {}
    for file_path in node.file_paths:
        file_paths.update(file_path.to_dict())
    return file_paths


def assemble_schedule(node):
    schedule = {}
    for query in node.queries:
        schedule[query.name] = query.to_dict()
    return schedule


def assemble_packs(node):
    from doorman.models import Pack
    packs = {}
    for pack in node.packs:
        packs[pack.name] = pack.to_dict()
    return packs


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
    from doorman.models import Pack, Query

    data = json.load(upload.data)
    name = splitext(basename(upload.data.filename))[0]
    pack = Pack.query.filter(Pack.name == name).first()

    if not pack:
        current_app.logger.debug("Creating pack %s", name)
        pack = Pack.create(name=name, **data)

    for query_name, query in data['queries'].iteritems():
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
    if (dt.datetime.utcnow() - node.last_checkin).seconds > checkin_interval:
        return u'danger'
    else:
        return ''

def validate_osquery_query(query):
    try:
        osquery_mock_db.execute(query)
    except sqlite3.Error:
        return False

    return True
