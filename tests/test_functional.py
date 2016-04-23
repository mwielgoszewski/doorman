# -*- coding: utf-8 -*-
from copy import deepcopy
from flask import url_for
from sqlalchemy import and_
import datetime as dt

import json
import urlparse

from doorman.models import Node, Pack, Query, Tag, FilePath
from doorman.settings import TestConfig

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
        query = QueryFactory(name='foobar', sql='select * from foobar;')
        pack.queries.append(query)
        pack.save()
        node.tags.append(tag)
        node.save()

        resp = testapp.post_json(url_for('api.configuration'), {
            'node_key': node.node_key})

        assert resp.json['node_invalid'] is False

        assert pack.name in resp.json['packs']
        assert resp.json['packs'].keys() == [pack.name] # should be the only key

        assert query.name in resp.json['packs'][pack.name]['queries']
        assert resp.json['packs'][pack.name]['queries'].keys() == [query.name]

        assert 'schedule' in resp.json
        assert 'file_paths' in resp.json

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
        log = {
            'line': 1, 
            'message': 'This is a test of the emergency broadcast system.', 
            'severity': 1,
            'filename': 'foobar.cpp'
        }

        assert not node.status_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [log],
            'log_type': 'status',
        })

        assert node.status_logs.count()
        assert node.status_logs[0].line == log['line']
        assert node.status_logs[0].message == log['message']
        assert node.status_logs[0].severity == log['severity']
        assert node.status_logs[0].filename == log['filename']

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

        log = [
            {
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
              "name": "pack/osquery-monitoring/osquery_info",
              "diffResults": {
                "removed": [
                  {
                    "build_platform": "darwin",
                    "system_time": "5235",
                    "start_time": "1461286939",
                    "build_distro": "10.11",
                    "counter": "9",
                    "pid": "29325",
                    "resident_size": "15523840",
                    "version": "1.7.3",
                    "extensions": "active",
                    "config_valid": "1",
                    "config_hash": "fe8f76397e127c841e4c94173205dc41",
                    "user_time": "18336"
                  }
                ],
                "added": [
                  {
                    "build_platform": "darwin",
                    "system_time": "5250",
                    "start_time": "1461286939",
                    "build_distro": "10.11",
                    "counter": "10",
                    "pid": "29325",
                    "resident_size": "15544320",
                    "version": "1.7.3",
                    "extensions": "active",
                    "config_valid": "1",
                    "config_hash": "fe8f76397e127c841e4c94173205dc41",
                    "user_time": "18416"
                  }
                ]
              },
              "hostIdentifier": node.host_identifier,
            }
        ]

        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': log,
            'log_type': 'result',
        })

        assert node.result_logs.count()

        result = node.result_logs.first()

        assert result.timestamp == now.replace(microsecond=0)
        assert result.name == log[0]['name']
        assert result.added == log[0]['diffResults']['added']
        assert result.removed == log[0]['diffResults']['removed']

    def test_no_result_log_created_when_data_is_empty(self, node, testapp):
        assert not node.result_logs.count()

        resp = testapp.post_json(url_for('api.logger'), {
            'node_key': node.node_key,
            'data': [],
            'log_type': 'result',
        })

        assert not node.result_logs.count()


class TestDistributedRead:
    pass


class TestDistributedWrite:
    pass


class TestCreateQueryPackFromUpload:

    def test_pack_upload(self, testapp, db):
        # resp = testapp.get(url_for('manage.add_pack'))
        # form = resp.forms[]
        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(SAMPLE_PACK)),
        ])

        location = urlparse.urlparse(resp.headers['Location'])
        locationhash = '#'.join((location.path, location.fragment))
        assert locationhash == url_for('manage.packs', _anchor='foo')

        resp = resp.follow()

        assert resp.status_int == 200

    def test_pack_does_not_exist_but_query_does(self, testapp, db):
        query = QueryFactory(name='foobar', sql='select * from osquery_info;')

        packdata = deepcopy(SAMPLE_PACK)
        packdata['queries']['foobar'] = query.to_dict()

        pack = Pack.query.filter(Pack.name == 'foo').all()
        assert not pack

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(packdata)),
        ])

        resp = resp.follow()
        assert resp.status_int == 200

        pack = Pack.query.filter(Pack.name == 'foo').one()
        assert query in pack.queries

    def test_pack_exists_queries_added(self, testapp, db):
        pack = PackFactory(name='foo')
        assert not pack.queries

        resp = testapp.post(url_for('manage.add_pack'), upload_files=[
            ('pack', 'foo.conf', json.dumps(SAMPLE_PACK)),
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
            ('pack', 'foo.conf', json.dumps(packdata)),
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
            ('pack', 'foo.conf', json.dumps(packdata)),
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
