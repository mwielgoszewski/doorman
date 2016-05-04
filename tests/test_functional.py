# -*- coding: utf-8 -*-
from copy import deepcopy
from flask import url_for
from sqlalchemy import and_
import datetime as dt
import json
import mock
import time

try:
    from urlparse import urlparse
except ImportError:
    from urllib.parse import urlparse

from doorman.models import (Node, Pack, Query, Tag, FilePath,
    DistributedQuery, DistributedQueryResult, Rule,
)
from doorman.settings import TestConfig

from .factories import (NodeFactory, PackFactory, QueryFactory, TagFactory,
    DistributedQueryFactory, DistributedQueryResultFactory,
)


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
            'host_identifier': 'foobaz'})

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != node.node_key

    def test_valid_reenrollment(self, node, testapp):
        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': node.enroll_secret,
            'host_identifier': node.host_identifier})

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == node.node_key

    def test_valid_reenrollment_change_host_identifier(self, node, testapp):
        host_identifier = 'foo'

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': node.enroll_secret,
            'host_identifier': host_identifier})

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == node.node_key
        assert node.host_identifier == host_identifier

    def test_duplicate_host_identifier_when_expecting_unique_ids(self, node, testapp):
        # When the application is configured DOORMAN_EXPECTS_UNIQUE_HOST_ID = True
        # then we're responsible for ensuring host_identifiers are unique.
        # 
        # In osquery, this requires running osquery with the
        # `--host_identifier=uuid` command-line flag. Otherwise, there is
        # a possibility that more than one node will have the same hostname.

        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = True

        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        existing = NodeFactory(host_identifier='foo')

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': existing.host_identifier})

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] == existing.node_key

    def test_duplicate_host_identifier_when_not_expecting_unique_ids(self, node, testapp):

        testapp.app.config['DOORMAN_EXPECTS_UNIQUE_HOST_ID'] = False

        enroll_secret = testapp.app.config['DOORMAN_ENROLL_SECRET'][0]

        existing = NodeFactory(host_identifier='foo')

        resp = testapp.post_json(url_for('api.enroll'), {
            'enroll_secret': enroll_secret,
            'host_identifier': existing.host_identifier})

        assert resp.json['node_invalid'] is False
        assert resp.json['node_key'] != existing.node_key


class TestConfiguration:

    def test_bad_post_request(self, node, testapp):
        resp = testapp.post(url_for('api.configuration'), {
            'foo': 'bar'})
        assert not resp.normal_body

    def test_missing_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'foo': 'bar'})
        assert resp.json == {'node_invalid': True}

    def test_invalid_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': 'invalid'})
        assert resp.json == {'node_invalid': True}

    def test_valid_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})
        assert resp.json['node_invalid'] is False

    def test_configuration_has_all_required_values(self, node, testapp):
        tag = TagFactory(value='foobar')
        pack = PackFactory(name='foobar')
        pack.tags.append(tag)

        sql = 'select * from foobar;'
        query = QueryFactory(name='foobar', sql=sql)
        pack.queries.append(query)
        pack.save()
        node.tags.append(tag)
        node.save()

        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        assert resp.json['node_invalid'] is False

        assert pack.name in resp.json['packs']
        assert list(resp.json['packs'].keys()) == [pack.name] # should be the only key

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

        assert not node.get_config()['packs'] # should be an empty {}
        assert not node.get_config()['schedule'] # should be an empty {}

        query = Query.create(name='foobar', sql='select * from osquery_info;')
        query.tags.append(tag)
        query.save()

        assert node.get_config()['schedule']
        assert query.name in node.get_config()['schedule']
        assert not node.get_config()['packs'] # should be an empty {}


class TestLogging:

    def test_bad_post_request(self, node, testapp):
        resp = testapp.post(url_for('api.logger'), {
            'foo': 'bar'})
        assert not resp.normal_body

    def test_missing_node_key(self, node, testapp):
        resp = testapp.post_json(url_for('api.logger'), {
            'foo': 'bar'})
        assert resp.json == {'node_invalid': True}

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
        })

        assert node.status_logs.count()
        assert node.status_logs[0].line == data['line']
        assert node.status_logs[0].message == data['message']
        assert node.status_logs[0].severity == data['severity']
        assert node.status_logs[0].filename == data['filename']

    def test_no_status_log_created_when_data_is_empty(self, node, testapp):
        assert not node.status_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [],
            'log_type': 'status',
        })

        assert not node.status_logs.count()

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
        })

        assert node.result_logs.count() == 2

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
        })

        assert not node.result_logs.count()

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
        })

        assert node.result_logs.count() == 4

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
              "snapshot": "",
              "name": "file_events",
              "hostIdentifier": "hostname.local",
            }
        ]

        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': data,
            'log_type': 'result',
        })

        assert node.result_logs.count() == 3

        r0, r1, r2 = node.result_logs.all()

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

        # TODO add assertions for snapshot logs


class TestDistributedRead:

    def test_no_distributed_queries(self, db, node, testapp):
        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert not resp.json['queries']

    def test_distributed_query_read_new(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;',
                                    node=node)

        assert q.status == DistributedQuery.NEW

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert q.status == DistributedQuery.PENDING
        assert q.guid in resp.json['queries']
        assert resp.json['queries'][q.guid] == q.sql
        assert q.retrieved > q.timestamp

    def test_distributed_query_read_pending(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;',
                                    node=node)
        q.update(status=DistributedQuery.PENDING)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert not resp.json['queries']

    def test_distributed_query_read_complete(self, db, node, testapp):
        q = DistributedQuery.create(sql='select * from osquery_info;',
                                    node=node)
        q.update(status=DistributedQuery.COMPLETE)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert not resp.json['queries']

    def test_distributed_query_read_not_before(self, db, node, testapp):
        import doorman.utils

        now = dt.datetime.utcnow()
        not_before = now + dt.timedelta(days=1)

        q = DistributedQuery.create(sql='select * from osquery_info;',
                                    node=node,
                                    not_before=not_before)

        assert q.not_before == not_before

        datetime_patcher = mock.patch.object(doorman.utils.dt, 'datetime',
                                             mock.Mock(wraps=dt.datetime))
        mocked_datetime = datetime_patcher.start()
        mocked_datetime.utcnow.return_value = not_before - dt.timedelta(seconds=1)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert not resp.json['queries']

        mocked_datetime.utcnow.return_value = not_before + dt.timedelta(seconds=1)

        resp = testapp.post_json(url_for('api.distributed_read'), {
            'node_key': node.node_key,
        })

        assert q.status == DistributedQuery.PENDING
        assert q.retrieved == not_before + dt.timedelta(seconds=1)
        assert q.guid in resp.json['queries']
        assert resp.json['queries'][q.guid] == q.sql

        datetime_patcher.stop()

        assert doorman.utils.dt.datetime.utcnow() != not_before


class TestDistributedWrite:

    def test_invalid_distributed_query_id(self, db, node, testapp):
        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                'foo': 'bar',
            }
        })
        result = DistributedQueryResult.query.filter(
            DistributedQueryResult.columns['foo'].astext == 'baz').all()
        assert not result

    def test_distributed_query_write_state_new(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';",
            node=node)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                q.guid: '',
            }
        })

        assert q.status == DistributedQuery.NEW
        assert not q.results

    def test_distributed_query_write_state_pending(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';",
            node=node)
        q.update(status=DistributedQuery.PENDING)

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
                q.guid: data,
            }
        })

        assert q.status == DistributedQuery.COMPLETE
        assert q.results
        assert q.results[0].columns == data[0]
        assert q.results[1].columns == data[1]

    def test_distributed_query_write_state_complete(self, db, node, testapp):
        q = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';",
            node=node)
        q.update(status=DistributedQuery.PENDING)

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
                                          distributed_query=q)
        q.update(status=DistributedQuery.COMPLETE)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': node.node_key,
            'queries': {
                q.guid: '',
            }
        })

        assert q.results
        assert len(q.results) == 1
        assert q.results[0] == r
        assert q.results[0].columns == data[0]

    def test_malicious_node_distributed_query_write(self, db, node, testapp):
        foo = NodeFactory(host_identifier='foo')
        q1 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';",
            node=node)
        q2 = DistributedQuery.create(
            sql="select name, path, pid from processes where name = 'osqueryd';",
            node=foo)
        q1.update(status=DistributedQuery.PENDING)
        q2.update(status=DistributedQuery.PENDING)

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': foo.node_key,
            'queries': {
                q1.guid: 'bar'
            }
        })

        assert not q1.results
        assert not q2.results

        resp = testapp.post_json(url_for('api.distributed_write'), {
            'node_key': foo.node_key,
            'queries': {
                q2.guid: 'bar'
            }
        })

        assert q2.results

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

    def test_will_reload_rules(self, node, app, testapp):
        from doorman.tasks import reload_rules

        with mock.patch.object(reload_rules, 'delay', return_value=None) as mock_delay:
            resp = testapp.post(url_for('manage.add_rule'), {
                'name': 'Test Rule',
                'type': 'blacklist',
                'action': 'both',
                'alerters': 'debug',
                'config': '{"field_name": "foo", "blacklist": []}',
            })

        assert mock_delay.called


class TestUpdateRule:

    def test_will_reload_rules(self, db, node, app, testapp):
        from doorman.tasks import reload_rules

        r = Rule(
            type='blacklist',
            name='Test Rule',
            action=Rule.BOTH,
            alerters=['debug'],
            config={"field_name": "foo", "blacklist": []}
        )
        db.session.add(r)
        db.session.commit()

        # Manually reload the rules here, and verify that we have the right
        # rule in our list
        app.rule_manager.load_rules()
        assert len(app.rule_manager.rules) == 1
        assert app.rule_manager.rules[0][0].action == Rule.BOTH

        # Fake wrapper that just calls reload
        def real_reload(*args, **kwargs):
            app.rule_manager.load_rules()

        # Update the rule
        with mock.patch.object(reload_rules, 'delay', wraps=real_reload) as mock_delay:
            resp = testapp.post(url_for('manage.rule', rule_id=r.id), {
                'name': 'Test Rule',
                'type': 'blacklist',
                'action': Rule.ADDED,
                'alerters': 'debug',
                'config': '{"field_name": "foo", "blacklist": []}',
            })

        assert mock_delay.called

        # Trigger a manual reload again, and verify that it's been updated
        app.rule_manager.load_rules()
        assert len(app.rule_manager.rules) == 1
        assert app.rule_manager.rules[0][0].action == Rule.ADDED
