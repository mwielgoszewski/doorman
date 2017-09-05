# -*- coding: utf-8 -*-
from copy import deepcopy
from flask import url_for
from sqlalchemy import and_
import datetime as dt
import gzip
import io
import json
import mock
import time

try:
    from urlparse import urlparse
except ImportError:
    from urllib.parse import urlparse

from doorman.models import (
    Node, Pack, Query, Tag, FilePath,
    DistributedQuery, DistributedQueryTask, DistributedQueryResult, Rule,
)
from doorman.settings import TestConfig
from doorman.utils import learn_from_result

from .factories import NodeFactory, PackFactory, QueryFactory, TagFactory


SAMPLE_PACK = {
  "queries": {
    "schedule": {
      "query": "select name, interval, executions, output_size, wall_time, (user_time/executions) as avg_user_time, (system_time/executions) as avg_system_time, average_memory, last_executed from osquery_schedule;",
      "interval": 7200,
      "removed": False,
      "version": "1.6.0",
      "description": "Report performance for every query within packs and the general schedule."
    },
    "events": {
      "query": "select name, publisher, type, subscriptions, events, active from osquery_events;",
      "interval": 86400,
      "removed": False,
      "description": "Report event publisher health and track event counters."
    },
    "osquery_info": {
      "query": "select i.*, p.resident_size, p.user_time, p.system_time, time.minutes as counter from osquery_info i, processes p, time where p.pid = i.pid;",
      "interval": 600,
      "removed": False,
      "description": "A heartbeat counter that reports general performance (CPU, memory) and version."
    }
  }
}


class TestEnrolling:
    def test_bad_post_request(self, node, testapp):
        resp = testapp.post(url_for('api.enroll'), {
            'host_identifier': node.host_identifier})
        assert not resp.normal_body

    def test_missing_enroll_secret(self, node, testapp):
        resp = testapp.post_json(url_for('api.enroll'), {
            'host_identifier': node.host_identifier})
        assert resp.json == {'node_invalid': True}

    def test_invalid_enroll_secret(self, node, testapp):
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': 'badsecret',
            'host_identifier': node.host_identifier})
        assert resp.json == {'node_invalid': True}

    def test_valid_enroll_secret(self, node, testapp):
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': 'foobaz'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'

    def test_valid_reenrollment(self, node, testapp):
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': node.enroll_secret,
            'host_identifier': node.host_identifier},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == node.node_key
        assert node.is_active
        assert node.last_ip == '127.0.0.2'

    def test_valid_reenrollment_change_host_identifier(self, node, testapp):
        host_identifier = 'foo'

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': node.enroll_secret,
            'host_identifier': host_identifier},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == node.node_key
        assert node.host_identifier == host_identifier
        assert node.is_active
        assert node.last_ip == '127.0.0.2'

    def test_duplicate_host_identifier_when_expecting_unique_ids(self, node, testapp):
        # When the application is configured DOORMAN_EXPECTS_UNIQUE_HOST_ID = True
        # then we're responsible for ensuring host_identifiers are unique.
        # In osquery, this requires running osquery with the
        # `--host_identifier=uuid` command-line flag. Otherwise, there is
        # a possibility that more than one node will have the same hostname.

        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = True

        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        existing = NodeFactory(host_identifier='foo')

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': existing.host_identifier},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == existing.node_key
        assert existing.is_active
        assert existing.last_ip == '127.0.0.2'
        assert node.last_ip != '127.0.0.2'

    def test_duplicate_host_identifier_when_not_expecting_unique_ids(self, node, testapp):

        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = False

        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        existing = NodeFactory(host_identifier='foo')

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': existing.host_identifier},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != existing.node_key
        assert node.is_active
        assert existing.last_ip != '127.0.0.2'

    def test_default_tags_that_dont_exist_yet_are_created(self, db, testapp):
        testapp.app.config['DOORMAN_ENROLL_DEFAULT_TAGS'] = ['foo', 'bar']
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        node = Node.query.filter_by(host_identifier='kungfoo').first()

        assert not node
        assert not Tag.query.all()

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': 'kungfoo',
        })

        node = Node.query.filter_by(host_identifier='kungfoo').first()
        assert node
        assert node.tags

        t1 = Tag.query.filter_by(value='foo').first()
        t2 = Tag.query.filter_by(value='bar').first()

        assert t1 in node.tags
        assert t2 in node.tags

    def test_default_tags_that_exit_are_added(self, db, testapp):
        testapp.app.config['DOORMAN_ENROLL_DEFAULT_TAGS'] = ['foobar']
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        tag = TagFactory(value='foobar')

        node = Node.query.filter_by(host_identifier='kungfoo').first()
        assert not node

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': 'kungfoo'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        node = Node.query.filter_by(host_identifier='kungfoo').first()
        assert node
        assert node.tags
        assert tag in node.tags
        assert node.is_active
        assert node.last_ip == '127.0.0.2'

    def test_reenrolling_node_does_not_get_new_tags(self, db, node, testapp):
        testapp.app.config['DOORMAN_ENROLL_DEFAULT_TAGS'] = ['foo', 'bar']
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        tag = TagFactory(value='foobar')
        node.tags.append(tag)
        node.last_ip = '127.0.0.1'
        node.save()

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': node.host_identifier},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert Tag.query.count() == 3
        assert node.tags == [tag]
        assert node.is_active
        assert node.last_ip == '127.0.0.1'

    def test_enroll_secret_tags(self, db, node, testapp):
        testapp.app.config['DOORMAN_ENROLL_SECRET_TAG_DELIMITER'] = ':'
        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = True
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': 'foobaz'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'
        assert not n.tags

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': ':'.join([enroll_secret, 'foo', 'bar']),
            'host_identifier': 'barbaz'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'
        assert len(n.tags) == 2
        assert 'foo' in (t.value for t in n.tags)
        assert 'bar' in (t.value for t in n.tags)

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': ':'.join([enroll_secret, 'foo', 'bar', 'baz']),
            'host_identifier': 'barbaz'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )
        assert resp.json['node_key'] != node.node_key
        assert resp.json['node_key'] == n.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'
        assert len(n.tags) == 2
        assert 'foo' in (t.value for t in n.tags)
        assert 'bar' in (t.value for t in n.tags)

        testapp.app.config['DOORMAN_ENROLL_SECRET'].append(':'.join(enroll_secret))
        testapp.app.config['DOORMAN_ENROLL_SECRET_TAG_DELIMITER'] = ','
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': ':'.join(enroll_secret),
            'host_identifier': 'bartab'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'
        assert not n.tags

    def test_enroll_max_secret_tags(self, db, node, testapp):
        testapp.app.config['DOORMAN_ENROLL_SECRET_TAG_DELIMITER'] = ':'
        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = True
        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]
        enroll_secret = ':'.join([enroll_secret] + list('abcdef1234567890'))
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': ':'.join([enroll_secret, 'foo', ]),
            'host_identifier': 'barbaz'},
            extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

        n = Node.query.filter_by(node_key=resp.json['node_key']).one()
        assert n.is_active
        assert n.last_ip == '127.0.0.2'
        assert len(n.tags) == 10  # max 10 tags when passing tags w/enroll secret


class TestConfiguration:

    def test_bad_post_request(self, node, testapp):
        resp = testapp.post(url_for('api.configuration'), {
            'foo': 'bar'})
        assert not resp.normal_body

    def test_missing_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'foo': 'bar'})
        assert not resp.normal_body
        # assert resp.json == {'node_invalid': True}

    def test_invalid_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': 'invalid'})
        assert resp.json == {'node_invalid': True}

    def test_valid_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})
        assert resp.json['node_invalid'] is False

    def test_inactive_node_key(self, node, testapp):
        node.is_active = False
        node.save()
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})
        assert resp.json['node_invalid'] is True

    def test_configuration_has_all_required_values(self, node, testapp):
        tag = TagFactory(value='foobar')
        tag2 = TagFactory(value='barbaz')
        pack = PackFactory(name='foobar')
        pack.tags.append(tag)

        sql = 'select * from foobar;'
        query = QueryFactory(name='foobar', sql=sql)
        query2 = QueryFactory(name='barbaz', sql=sql)
        query3 = QueryFactory(name='barfoo', sql=sql)
        query.tags.append(tag)
        query.save()

        pack.queries.append(query)
        pack.save()

        node.tags.append(tag)
        node.save()

        pack2 = PackFactory(name='barbaz')
        pack2.tags.append(tag2)
        pack2.queries.append(query)
        pack2.queries.append(query2)
        pack2.save()

        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        assert resp.json['node_invalid'] is False

        assert pack.name in resp.json['packs']
        assert list(resp.json['packs'].keys()) == [pack.name]  # should be the only key

        assert query.name in resp.json['packs'][pack.name]['queries']
        assert list(resp.json['packs'][pack.name]['queries'].keys()) == [query.name]

        # should default to 'removed': true
        assert resp.json['packs'][pack.name]['queries'][query.name]['query'] == sql
        assert resp.json['packs'][pack.name]['queries'][query.name]['removed'] == True

        assert 'schedule' in resp.json
        assert 'file_paths' in resp.json

    def test_configuration_will_respect_removed_false(self, node, testapp):
        tag = TagFactory(value='foobar')
        pack = PackFactory(name='foobar')
        pack.tags.append(tag)

        sql = 'select * from foobar;'
        query = QueryFactory(name='foobar', sql=sql, removed=False)
        pack.queries.append(query)
        pack.save()
        node.tags.append(tag)
        node.save()

        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        # as above, but 'removed': false
        assert resp.json['packs'][pack.name]['queries'][query.name]['query'] == sql
        assert resp.json['packs'][pack.name]['queries'][query.name]['removed'] is False

    def test_valid_configuration(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        assert resp.json['node_invalid'] is False

        first_config = resp.json
        first_config.pop('node_invalid')

        assert first_config == node.get_config()

        tag = Tag.create(value='foo')
        node.tags.append(tag)
        node.save()

        # test adding a tag to a query results in the query being included
        # for this configuration

        query1 = Query.create(name='bar', sql='select * from osquery_info;')
        query2 = Query.create(name='foobar', sql='select * from system_info;')
        query2.tags.append(tag)
        query2.save()

        # test adding a tag to a pack results in the pack being included
        # for this configuration

        pack = Pack.create(name='baz')
        pack.queries.append(query1)
        pack.tags.append(tag)
        pack.save()

        file_path = FilePath.create(category='foobar', target_paths=[
            '/home/foobar/%%',
        ])
        file_path.tags.append(tag)
        file_path.save()

        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        assert resp.json['node_invalid'] is False

        second_config = resp.json
        second_config.pop('node_invalid')

        assert second_config != first_config
        assert second_config == node.get_config()

    def test_adding_and_then_removing_results_in_valid_configuration(self, node, testapp):

        tag = Tag.create(value='foo')
        node.tags.append(tag)

        assert not node.get_config()['packs']  # should be an empty {}
        assert not node.get_config()['schedule']  # should be an empty {}

        query = Query.create(name='foobar', sql='select * from osquery_info;')
        query.tags.append(tag)
        query.save()

        assert node.get_config()['schedule']
        assert query.name in node.get_config()['schedule']
        assert not node.get_config()['packs']  # should be an empty {}


class TestLogging:

    def test_bad_post_request(self, node, testapp):
        resp = testapp.post(url_for('api.logger'), {
            'foo': 'bar'})
        assert not resp.normal_body

    def test_missing_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.logger'), {
            'foo': 'bar'})
        assert not resp.normal_body
        # assert resp.json == {'node_invalid': True}

    def test_status_log_created_for_node(self, node, testapp):
        data = {
            'line': 1,
            'message': 'This is a test of the emergency broadcast system.',
            'severity': 1,
            'filename': 'foobar.cpp'
        }

        assert not node.status_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [data],
            'log_type': 'status',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.status_logs.count()
        assert node.status_logs[0].line == data['line']
        assert node.status_logs[0].message == data['message']
        assert node.status_logs[0].severity == data['severity']
        assert node.status_logs[0].filename == data['filename']
        assert node.last_ip == '127.0.0.2'

    def test_status_log_created_for_node_put(self, node, testapp):
        data = {
            'line': 1,
            'message': 'This is a test of the emergency broadcast system.',
            'severity': 1,
            'filename': 'foobar.cpp'
        }

        assert not node.status_logs.count()

        resp = testapp.put_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [data],
            'log_type': 'status',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.status_logs.count()
        assert node.status_logs[0].line == data['line']
        assert node.status_logs[0].message == data['message']
        assert node.status_logs[0].severity == data['severity']
        assert node.status_logs[0].filename == data['filename']
        assert node.last_ip == '127.0.0.2'

    def test_status_log_created_for_node_when_gzipped(self, node, testapp):
        data = {
            'line': 1,
            'message': 'This is a test of the emergency broadcast system.',
            'severity': 1,
            'filename': 'foobar.cpp'
        }

        assert not node.status_logs.count()
        fileobj = io.BytesIO()
        gzf = gzip.GzipFile(fileobj=fileobj, mode='wb')

        gzf.write(json.dumps({
            'node_key': node.node_key,
            'data': [data],
            'log_type': 'status',
        }).encode('utf-8'))
        gzf.close()

        resp = testapp.post(url_for('api.logger'), fileobj.getvalue(), headers={
            'Content-Encoding': 'gzip',
            'Content-Type': 'application/json'
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.status_logs.count()
        assert node.status_logs[0].line == data['line']
        assert node.status_logs[0].message == data['message']
        assert node.status_logs[0].severity == data['severity']
        assert node.status_logs[0].filename == data['filename']
        assert node.last_ip == '127.0.0.2'

    def test_no_status_log_created_when_data_is_empty(self, node, testapp):
        assert not node.status_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [],
            'log_type': 'status',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not node.status_logs.count()
        assert node.last_ip == '127.0.0.2'

    def test_result_log_created_for_node(self, node, testapp):
        now = dt.datetime.utcnow()

        data = [
            {
              "diffResults": {
                "added": [
                  {
                    "name": "osqueryd",
                    "path": "/usr/local/bin/osqueryd",
                    "pid": "97830"
                  }
                ],
                "removed": [
                  {
                    "name": "osqueryd",
                    "path": "/usr/local/bin/osqueryd",
                    "pid": "97650"
                  }
                ]
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s')
            }
        ]

        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.result_logs.count() == 2
        assert node.last_ip == '127.0.0.2'

        added, removed = node.result_logs.all()

        assert added.timestamp == now.replace(microsecond=0)
        assert added.name == data[0]['name']
        assert added.action == 'added'
        assert added.columns == data[0]['diffResults']['added'][0]

        assert removed.timestamp == now.replace(microsecond=0)
        assert removed.name == data[0]['name']
        assert removed.action == 'removed'
        assert removed.columns == data[0]['diffResults']['removed'][0]

    def test_no_result_log_created_when_data_is_empty(self, node, testapp):
        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [],
            'log_type': 'result',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not node.result_logs.count()
        assert node.last_ip == '127.0.0.2'

    def test_result_event_format(self, node, testapp):
        now = dt.datetime.utcnow()
        calendarTime = "%s %s" % (now.ctime(), "UTC")
        unixTime = now.strftime('%s')

        data = [
            {
              "action": "added",
              "columns": {
                "name": "osqueryd",
                "path": "/usr/local/bin/osqueryd",
                "pid": "97830"
              },
              "name": "osquery",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },
            {
              "action": "removed",
              "columns": {
                "name": "osqueryd",
                "path": "/usr/local/bin/osqueryd",
                "pid": "97830"
              },
              "name": "osquery",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },
            {
              "action": "added",
              "columns": {
                "name": "osqueryd",
                "path": "/usr/local/bin/osqueryd",
                "pid": "97830"
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },
            {
              "action": "removed",
              "columns": {
                "name": "osqueryd",
                "path": "/usr/local/bin/osqueryd",
                "pid": "97830"
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },
        ]

        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.result_logs.count() == 4
        assert node.last_ip == '127.0.0.2'

        for i, result in enumerate(node.result_logs.all()):
            assert result.timestamp == now.replace(microsecond=0)
            assert result.name == data[i]['name']
            assert result.action == data[i]['action']
            assert result.columns == data[i]['columns']

    def test_heterogeneous_result_format(self, node, testapp):

        now = dt.datetime.utcnow()
        calendarTime = "%s %s" % (now.ctime(), "UTC")
        unixTime = now.strftime('%s')

        data = [
            {
              "action": "removed",
              "columns": {
                "name": "osqueryd",
                "path": "/usr/local/bin/osqueryd",
                "pid": "97830"
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },
            {
              "diffResults": {
                "added": [
                  {
                    "name": "osqueryd",
                    "path": "/usr/local/bin/osqueryd",
                    "pid": "97830"
                  }
                ],
                "removed": [
                  {
                    "name": "osqueryd",
                    "path": "/usr/local/bin/osqueryd",
                    "pid": "97650"
                  }
                ]
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": calendarTime,
              "unixTime": unixTime,
            },

            {
              "calendarTime": calendarTime,
              "unixTime": unixTime,
              "action": "snapshot",
              "snapshot": [
                {
                  "parent": "0",
                  "path": "/sbin/launchd",
                  "pid": "1"
                },
                {
                  "parent": "1",
                  "path": "/usr/sbin/syslogd",
                  "pid": "51"
                },
                {
                  "parent": "1",
                  "path": "/usr/libexec/UserEventAgent",
                  "pid": "52"
                },
                {
                  "parent": "1",
                  "path": "/usr/libexec/kextd",
                  "pid": "54"
                },
              ],
              "name": "process_snapshot",
              "name": "file_events",
              "hostIdentifier": "hostname.local",
            }
        ]

        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert node.result_logs.count() == 7
        assert node.last_ip == '127.0.0.2'

        r0, r1, r2 = node.result_logs.all()[:3]
        r3 = node.result_logs.all()[-1]

        assert r0.name == data[0]['name']
        assert r0.action == data[0]['action']
        assert r0.columns == data[0]['columns']
        assert r0.timestamp == now.replace(microsecond=0)

        assert r1.name == data[1]['name']
        assert r1.action == 'added'
        assert r1.columns == data[1]['diffResults']['added'][0]
        assert r1.timestamp == now.replace(microsecond=0)

        assert r2.name == data[1]['name']
        assert r2.action == 'removed'
        assert r2.columns == data[1]['diffResults']['removed'][0]
        assert r2.timestamp == now.replace(microsecond=0)

        assert r3.name == data[-1]['name']
        assert r3.action == 'snapshot'
        assert r3.columns == data[-1]['snapshot'][-1]


class TestDistributedRead:

    def test_no_distributed_queries(self, db, node, testapp):
        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not resp.json['queries']
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_read_new(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;')
        t = DistributedQueryTask.create(node=node, distributed_query=q)

        assert t.status == DistributedQueryTask.NEW

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert t.status == DistributedQueryTask.PENDING
        assert t.guid in resp.json['queries']
        assert resp.json['queries'][t.guid] == q.sql
        assert t.timestamp > q.timestamp
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_read_pending(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;')
        t = DistributedQueryTask.create(node=node, distributed_query=q)
        t.update(status=DistributedQueryTask.PENDING)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not resp.json['queries']
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_read_complete(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;')
        t = DistributedQueryTask.create(node=node, distributed_query=q)
        t.update(status=DistributedQueryTask.COMPLETE)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not resp.json['queries']
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_read_not_before(self, db, node, testapp):
        import doorman.utils

        now = dt.datetime.utcnow()
        not_before = now + dt.timedelta(days=1)

        q = DistributedQuery.create(sql='select * from osquery_info;',
                                    not_before=not_before)
        t = DistributedQueryTask.create(node=node, distributed_query=q)

        assert q.not_before == not_before

        datetime_patcher = mock.patch.object(doorman.utils.dt, 'datetime',
                                             mock.Mock(wraps=dt.datetime))
        mocked_datetime = datetime_patcher.start()
        mocked_datetime.utcnow.return_value = not_before - dt.timedelta(seconds=1)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not resp.json['queries']
        assert node.last_ip == '127.0.0.2'

        mocked_datetime.utcnow.return_value = not_before + dt.timedelta(seconds=1)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.3')
        )

        assert t.status == DistributedQueryTask.PENDING
        assert t.timestamp == not_before + dt.timedelta(seconds=1)
        assert t.guid in resp.json['queries']
        assert resp.json['queries'][t.guid] == q.sql
        assert node.last_ip == '127.0.0.3'

        datetime_patcher.stop()

        assert doorman.utils.dt.datetime.utcnow() != not_before


class TestDistributedWrite:

    def test_invalid_distributed_query_id(self, db, node, testapp):
        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                'foo': 'bar',
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )
        result = DistributedQueryResult.query.filter(
            DistributedQueryResult.columns['foo'].astext == 'baz').all()
        assert not result
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_write_state_new(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t = DistributedQueryTask.create(node=node, distributed_query=q)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                t.guid: '',
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert t.status == DistributedQueryTask.NEW
        assert not q.results
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_write_state_pending(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t = DistributedQueryTask.create(node=node, distributed_query=q)
        t.update(status=DistributedQueryTask.PENDING)

        data = [{
            "name": "osqueryd",
            "path": "/usr/local/bin/osqueryd",
            "pid": "97830"
        },
        {
            "name": "osqueryd",
            "path": "/usr/local/bin/osqueryd",
            "pid": "97831"
        }]

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                t.guid: data,
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert t.status == DistributedQueryTask.COMPLETE
        assert q.results
        assert q.results[0].columns == data[0]
        assert q.results[1].columns == data[1]
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_write_state_complete(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t = DistributedQueryTask.create(node=node, distributed_query=q)
        t.update(status=DistributedQueryTask.PENDING)

        data = [{
            "name": "osqueryd",
            "path": "/usr/local/bin/osqueryd",
            "pid": "97830"
        },
        {
            "name": "osqueryd",
            "path": "/usr/local/bin/osqueryd",
            "pid": "97831"
        }]

        r = DistributedQueryResult.create(columns=data[0],
                                          distributed_query=q,
                                          distributed_query_task=t)
        t.update(status=DistributedQueryTask.COMPLETE)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                t.guid: '',
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert q.results
        assert len(q.results) == 1
        assert q.results[0] == r
        assert q.results[0].columns == data[0]
        assert node.last_ip == '127.0.0.2'

    def test_distributed_query_write_state_failed(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t = DistributedQueryTask.create(node=node, distributed_query=q)
        t.update(status=DistributedQueryTask.PENDING)

        data = []

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                t.guid: data,
            },
            'statuses': {
                t.guid: 2,
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert t.status == DistributedQueryTask.FAILED
        assert not q.results
        assert node.last_ip == '127.0.0.2'

    def test_malicious_node_distributed_query_write(self, db, node, testapp):
        foo = NodeFactory(host_identifier='foo')
        q1 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t1 = DistributedQueryTask.create(node=node, distributed_query=q1)
        q2 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t2 = DistributedQueryTask.create(node=foo, distributed_query=q2)

        t1.update(status=DistributedQueryTask.PENDING)
        t2.update(status=DistributedQueryTask.PENDING)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': foo.node_key,
            'queries': {
                t1.guid: 'bar'
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.2')
        )

        assert not q1.results
        assert not q2.results
        assert node.last_ip != '127.0.0.2'
        assert not node.last_ip
        assert foo.last_ip == '127.0.0.2'

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': foo.node_key,
            'queries': {
                t2.guid: 'bar'
            }
        },
        extra_environ=dict(REMOTE_ADDR='127.0.0.3')
        )

        assert t2.results
        assert node.last_ip != '127.0.0.2'
        assert not node.last_ip
        assert foo.last_ip == '127.0.0.3'


class TestDistributedTable:

    def html_escape(self, v):
        return (v
            .replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace("'", "&#39;").replace('"', "&quot;")
            )

    def test_distributed_query_table_basic(self, db, node, testapp):
        # Create two fake queries, tasks, and fake results.
        q1 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t1 = DistributedQueryTask.create(node=node, distributed_query=q1)
        q2 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'otherproc';")
        t2 = DistributedQueryTask.create(node=node, distributed_query=q2)

        t1.update(status=DistributedQueryTask.PENDING)
        t2.update(status=DistributedQueryTask.PENDING)

        r1 = DistributedQueryResult.create(distributed_query_task=t1, distributed_query=q1, columns={
            'query': 'number 1',
        })
        r2 = DistributedQueryResult.create(distributed_query_task=t2, distributed_query=q2, columns={
            'query': 'number 2',
        })

        # Verify that the first query is there, and the second is not
        resp = testapp.get(url_for('manage.distributed_results', distributed_id=q1.id))
        assert self.html_escape(q1.sql) in resp.text
        assert self.html_escape(q2.sql) not in resp.text

    def test_distributed_query_table_filter_status(self, db, testapp):
        node1 = NodeFactory(host_identifier='node1')
        node2 = NodeFactory(host_identifier='node2')

        # Create a fake query and tasks for each node
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';")
        t1 = DistributedQueryTask.create(node=node1, distributed_query=q)
        t2 = DistributedQueryTask.create(node=node2, distributed_query=q)

        t1.update(status=DistributedQueryTask.PENDING)
        t2.update(status=DistributedQueryTask.COMPLETE)

        r1 = DistributedQueryResult.create(distributed_query_task=t1, distributed_query=q, columns={
            'query': 'number 1',
        })
        r2 = DistributedQueryResult.create(distributed_query_task=t2, distributed_query=q, columns={
            'query': 'number 2',
        })

        # Verify that only the complete one exists in the table
        resp = testapp.get(url_for('manage.distributed_results', distributed_id=q.id, status='complete'))
        assert 'number 1' not in resp.text
        assert 'number 2' in resp.text

        # Should only have one result
        assert 'displaying <b>1 - 1</b> of <b>1</b> complete distributed query results' in resp.text


class TestCreateQueryPackFromUpload:

    def test_pack_upload(self, testapp, db):
        # resp = testapp.get(url_for('manage.add_pack'))
        # form = resp.forms[]
        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(SAMPLE_PACK).encode('utf-8')),
        ])

        location = urlparse(resp.headers['Location'])
        locationhash = '#'.join((location.path, location.fragment))
        assert locationhash == url_for('manage.packs', _anchor='foo')

        resp = resp.follow()

        assert resp.status_int == 200

    def test_pack_upload_invalid(self, testapp, db):
        bad_query = 'SELECT * FROM invalid_table;'

        packdata = deepcopy(SAMPLE_PACK)
        packdata['queries']['schedule']['query'] = bad_query

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(packdata).encode('utf-8')),
        ])

        # This won't be a redirect, since it's an error.
        assert resp.status_int == 200

        body = resp.html
        flashes = body.select('.alert.alert-danger')

        assert len(flashes) == 1

        msg = 'Invalid osquery query: "{0}"'.format(bad_query)
        innerText = ''.join(flashes[0].findAll(text=True, recursive=False))
        assert innerText.strip() == msg

    def test_pack_upload_invalid_empty_object(self, testapp, db):
        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps({}).encode('utf-8')),
        ])

        # This won't be a redirect, since it's an error.
        assert resp.status_int == 200

        body = resp.html
        flashes = body.select('.alert.alert-danger')

        assert len(flashes) == 1

        msg = 'No queries in pack'
        innerText = ''.join(flashes[0].findAll(text=True, recursive=False))
        assert innerText.strip() == msg

    def test_pack_upload_invalid_json(self, testapp, db):
        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', 'bad data'.encode('utf-8')),
        ])

        # This won't be a redirect, since it's an error.
        assert resp.status_int == 200

        body = resp.html
        flashes = body.select('.alert.alert-danger')

        assert len(flashes) == 1

        msg = 'Could not load pack as JSON - ensure it is JSON encoded'
        innerText = ''.join(flashes[0].findAll(text=True, recursive=False))
        assert innerText.strip() == msg

    def test_pack_does_not_exist_but_query_does(self, testapp, db):
        query = QueryFactory(name='foobar', sql='select * from osquery_info;')

        packdata = deepcopy(SAMPLE_PACK)
        packdata['queries']['foobar'] = query.to_dict()

        pack = Pack.query.filter(Pack.name == 'foo').all()
        assert not pack

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(packdata).encode('utf-8')),
        ])

        resp = resp.follow()
        assert resp.status_int == 200

        pack = Pack.query.filter(Pack.name == 'foo').one()
        assert query in pack.queries

    def test_pack_exists_queries_added(self, testapp, db):
        pack = PackFactory(name='foo')
        assert not pack.queries

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(SAMPLE_PACK).encode('utf-8')),
        ])

        resp = resp.follow()
        assert resp.status_int == 200
        assert pack.queries

    def test_pack_exists_duplicate_query_name_same_sql(self, testapp, db):
        pack = PackFactory(name='foo')
        assert not pack.queries

        query = QueryFactory(name='foobar', sql='select * from osquery_info;')
        assert query not in pack.queries

        packdata = deepcopy(SAMPLE_PACK)
        packdata['queries']['foobar'] = query.to_dict()

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(packdata).encode('utf-8')),
        ])

        resp = resp.follow()
        assert resp.status_int == 200

        pack = Pack.query.filter(Pack.name == 'foo').one()
        assert query in pack.queries

    def test_pack_exists_duplicate_query_name_different_sql(self, testapp, db):
        pack = PackFactory(name='foo')
        assert not pack.queries

        query = QueryFactory(name='foobar', sql='select * from osquery_info;')
        assert query not in pack.queries

        packdata = deepcopy(SAMPLE_PACK)
        packdata['queries']['foobar'] = query.to_dict()

        # change the sql
        query.update(sql='select * from foo;')

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(packdata).encode('utf-8')),
        ])

        resp = resp.follow()
        assert resp.status_int == 200

        # the query should not be in this pack, however a query with the
        # same name, and different sql should be.

        pack = Pack.query.filter(Pack.name == 'foo').one()
        assert query not in pack.queries

        assert Query.query.filter(Query.name == 'foobar').count() == 2

        new_query = Query.query.filter(
            and_(
                Query.name == query.name,
                Query.sql == packdata['queries']['foobar']['query'])
        ).one()

        assert new_query in pack.queries


class TestCreateQuery:
    pass


class TestCreateTag:
    pass


class TestAddRule:

    def test_supports_custom_operators(self, node, app, testapp):
        # Add a rule to the application
        rule = """
        {
          "condition": "AND",
          "rules": [
            {
              "id": "query_name",
              "field": "query_name",
              "type": "string",
              "input": "text",
              "operator": "matches_regex",
              "value": ".*"
            },
            {
              "id": "query_name",
              "field": "query_name",
              "type": "string",
              "input": "text",
              "operator": "not_matches_regex",
              "value": ".*"
            },
            {
              "id": "column",
              "field": "column",
              "type": "string",
              "input": "text",
              "operator": "column_matches_regex",
              "value": ".*"
            },
            {
              "id": "column",
              "field": "column",
              "type": "string",
              "input": "text",
              "operator": "column_not_matches_regex",
              "value": ".*"
            },
          ]
        }
        """

        resp = testapp.post(url_for('manage.add_rule'), {
            'name': 'Example-Rule',
            'alerters': 'debug',
            'conditions': json.dumps(rule),
        })

        assert resp.status_int == 302       # Redirect on success
        assert Rule.query.count() == 1


class TestUpdateRule:
    pass


class TestRuleManager:
    def test_will_load_rules_on_each_call(self, app, db):
        """
        Verifies that each call to handle_log_entry will result in a call to load_rules.
        """
        from doorman.rules import Network

        mgr = app.rule_manager
        now = dt.datetime.utcnow()

        with mock.patch.object(mgr, 'load_rules', wraps=lambda: []) as mock_load_rules:
            with mock.patch.object(mgr, 'network', wraps=Network()) as mock_network:
                for i in range(0, 2):
                    mgr.handle_log_entry({
                        'data': [
                            {
                                "diffResults": {
                                    "added": [{'op': 'added'}],
                                    "removed": "",
                                },
                                "name": "fake",
                                "hostIdentifier": "hostname.local",
                                "calendarTime": "%s %s" % (now.ctime(), "UTC"),
                                "unixTime": now.strftime('%s')
                            }
                        ]
                    }, {'host_identifier': 'yes'})

                assert mock_load_rules.call_count == 2

    def test_will_reload_when_changed(self, app, db):
        from doorman.models import Rule

        mgr = app.rule_manager
        dummy_rule = {
            "id": "query_name",
            "field": "query_name",
            "type": "string",
            "input": "text",
            "operator": "equal",
            "value": "dummy-query",
        }

        now = dt.datetime.utcnow()
        next = now + dt.timedelta(minutes=5)

        # Insert a first rule.
        rule = Rule(
            name='foo',
            alerters=[],
            conditions={'condition': 'AND', 'rules': [dummy_rule]},
            updated_at=now
        )
        db.session.add(rule)
        db.session.commit()

        # Verify that we will reload these rules
        assert mgr.should_reload_rules() is True

        # Actually load them
        mgr.load_rules()

        # Verify that (with no changes made), we should NOT reload.
        assert mgr.should_reload_rules() is False

        # Make a change to a rule.
        rule.update(
            conditions={'condition': 'OR', 'rules': [dummy_rule]},
            updated_at=next)
        db.session.add(rule)
        db.session.commit()

        # Verify that we will now reload
        assert mgr.should_reload_rules() is True


class TestRuleEndToEnd:

    def test_rule_end_to_end(self, db, node, app, testapp):
        """
        This test is rather complicated, but is aimed at testing the end-to-end
        behavior of a rule.  Essentially, we create a dummy alerter that saves
        when it's called, and then perform the following steps:
            - Add a rule to the application through the API
            - Send a result log that should trigger this rule
            - Verify that the alerter was called with the appropriate arguments
        """
        from doorman.models import Rule
        from doorman.plugins import AbstractAlerterPlugin
        from doorman.rules import RuleMatch
        from doorman.tasks import analyze_result

        # Add a dummy alerter
        class DummyAlerter(AbstractAlerterPlugin):
            def __init__(self, *args, **kwargs):
                super(DummyAlerter, self).__init__(*args, **kwargs)
                self.calls = []

            def handle_alert(self, node, match):
                self.calls.append((node, match))

        dummy_alerter = DummyAlerter()

        # This patches the appropriate config to create the 'dummy' alerter.  This is a bit ugly :-(
        # NOTE: we must use the patch methods here, or it will scribble over
        # the app configuration for future tests (which we don't want).
        with mock.patch.dict(app.config, {'DOORMAN_ALERTER_PLUGINS': {'dummy': ('fake', {})}}):
            with mock.patch.dict(app.rule_manager.alerters, {'dummy': dummy_alerter}, clear=True):

                # Add a rule to the application
                rule = """
                {
                  "condition": "AND",
                  "rules": [
                    {
                      "id": "query_name",
                      "field": "query_name",
                      "type": "string",
                      "input": "text",
                      "operator": "equal",
                      "value": "dummy-query"
                    }
                  ]
                }
                """

                resp = testapp.post(url_for('manage.add_rule'), {
                    'name': 'Test-Rule',
                    'alerters': 'dummy',
                    'conditions': rule,
                })

                assert resp.status_int == 302       # Redirect on success
                assert Rule.query.count() == 1

                # Send a log that should trigger this rule.
                now = dt.datetime.utcnow()
                data = [
                    {
                      "diffResults": {
                        "added": [
                          {
                            "column_name": "column_value",
                          }
                        ],
                        "removed": ""
                      },
                      "name": "dummy-query",
                      "hostIdentifier": "hostname.local",
                      "calendarTime": "%s %s" % (now.ctime(), "UTC"),
                      "unixTime": now.strftime('%s')
                    }
                ]

                # Patch the task function to just call directly - i.e. not delay
                def immediately_analyze(*args, **kwargs):
                    return analyze_result(*args, **kwargs)

                with mock.patch.object(analyze_result, 'delay', new=immediately_analyze):
                    resp = testapp.post_json(url_for('api.logger'), {
                        'node_key': node.node_key,
                        'data': data,
                        'log_type': 'result',
                    })

                # Assert that the alerter has triggered, and that it gave the right arguments.
                assert len(dummy_alerter.calls) == 1
                assert dummy_alerter.calls[0][0] == node.to_dict()

                rule = Rule.query.first()
                assert dummy_alerter.calls[0][1].rule.id == rule.id
                assert dummy_alerter.calls[0][1].node == node.to_dict()
                assert dummy_alerter.calls[0][1].result == {
                    'name': 'dummy-query',
                    'action': 'added',
                    'timestamp': now.replace(microsecond=0),
                    'columns': {
                      'column_name': 'column_value',
                    },
                }


class TestLearning:
    # default columns we capture node info on are:
    COLUMNS = [
        'computer_name',
        'hardware_vendor',
        'hardware_model',
        'hardware_serial',
        'cpu_brand',
        'cpu_physical_cores',
        'physical_memory',
    ]

    def test_node_info_updated_on_added_data(self, node, testapp):
        assert not node.node_info

        now = dt.datetime.utcnow()
        data = [
            {
              "name": "system_info",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
              "action": "added",
              "columns": {
                "cpu_subtype": "Intel x86-64h Haswell",
                "cpu_physical_cores": "4",
                "physical_memory": "17179869184",
                "cpu_logical_cores": "8",
                "hostname": "foobar",
                "hardware_version": "1.0",
                "hardware_vendor": "Apple Inc.",
                "hardware_model": "MacBookPro11,3",
                "cpu_brand": "Intel(R) Core(TM) i7-4980HQ CPU @ 2.80GHz",
                "cpu_type": "x86_64h",
                "computer_name": "hostname.local",
                "hardware_serial": "123456890",
                "uuid": ""
              },
              "hostIdentifier": node.host_identifier
            }
        ]

        result = {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        }

        learn_from_result(result, node.to_dict())

        for column in self.COLUMNS:
            assert column in node.node_info
            assert node.node_info[column] == data[0]['columns'][column]

        assert 'foobar' not in node.node_info

    def test_node_info_updated_on_removed_data(self, node, testapp):
        assert not node.node_info
        node.node_info = {
                "computer_name": "barbaz",
                "hardware_version": "1.0",
                "hardware_vendor": "Apple Inc.",
                "hardware_model": "MacBookPro11,3",
                "hardware_serial": "123456890",
                "cpu_brand": "Intel(R) Core(TM) i7-4980HQ CPU @ 2.80GHz",
                "cpu_physical_cores": "4",
                "physical_memory": "17179869184",
        }
        node.save()

        now = dt.datetime.utcnow()
        data = [
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 09:59:06 2016 UTC","unixTime":"1468850346","columns":{"computer_name":"foobar"},"action":"added"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 09:59:06 2016 UTC","unixTime":"1468850346","columns":{"computer_name":"barbaz"},"action":"removed"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:00:24 2016 UTC","unixTime":"1468850424","columns":{"computer_name":"barbaz"},"action":"added"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:00:24 2016 UTC","unixTime":"1468850424","columns":{"computer_name":"foobar"},"action":"removed"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:17:38 2016 UTC","unixTime":"1468851458","columns":{"computer_name":"kungpow"},"action":"added"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:12:38 2016 UTC","unixTime":"1468851458","columns":{"computer_name":"foobar"},"action":"removed"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:12:38 2016 UTC","unixTime":"1468851458","columns":{"computer_name":"foobar"},"action":"removed"},
            {"name":"computer_name","hostIdentifier":"foobar.localdomain","calendarTime":"Mon Jul 18 10:17:38 2016 UTC","unixTime":"1468851458","columns":{"computer_name":"kungpow"},"action":"added"},
        ]

        result = {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        }

        learn_from_result(result, node.to_dict())

        for column in self.COLUMNS:
            assert column in node.node_info

        assert node.node_info['computer_name'] == 'kungpow'

        assert 'foobar' not in node.node_info

    def test_node_info_not_updated_on_erroneous_data(self, node, testapp):
        assert not node.node_info

        now = dt.datetime.utcnow()
        data = [
            {
              "name": "system_info",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
              "action": "added",
              "columns": {
                "uuid": "foobar"
              },
              "hostIdentifier": node.host_identifier
            }
        ]

        result = {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        }

        learn_from_result(result, node.to_dict())
        assert 'foobar' not in node.node_info


class TestCSVExport:
    def test_node_csv_download(self, node, testapp):
        import unicodecsv as csv

        node.enrolled_on = dt.datetime.utcnow()
        node.last_checkin = dt.datetime.utcnow()
        node.last_ip = '1.1.1.1'
        node.node_info = {'hardware_vendor': "Honest Achmed's Computer Supply"}
        node.save()

        resp = testapp.get(url_for('manage.nodes_csv'))

        assert resp.headers['Content-Type'] == 'text/csv; charset=utf-8'
        assert resp.headers['Content-Disposition'] == 'attachment; filename=nodes.csv'

        reader = csv.DictReader(io.BytesIO(resp.body))
        row = next(reader)

        assert row['Display Name'] == node.display_name
        assert row['Host Identifier'] == node.host_identifier
        assert row['Enrolled On'] == str(node.enrolled_on)
        assert row['Last Check-In'] == str(node.last_checkin)
        assert row['Last Ip Address'] == node.last_ip
        assert row['Is Active'] == 'True'
        assert row['Make'] == node.node_info['hardware_vendor']
