# -*- coding: utf-8 -*-
import json
import logging
import datetime as dt
from collections import defaultdict

from doorman.rules import (
    BaseCondition,
    EqualCondition,
    Network,
    RuleInput,
)


DUMMY_INPUT = RuleInput(result_log={}, node={})


class TestNetwork:

    def test_will_cache_condition_instances(self):
        class TestCondition(BaseCondition):
            pass

        network = Network()
        one = network.make_condition(TestCondition)
        two = network.make_condition(TestCondition)

        assert one is two

    def test_will_parse_basic(self):
        query = json.loads("""
        {
          "condition": "AND",
          "rules": [
            {
              "id": "column",
              "field": "column",
              "type": "string",
              "input": "text",
              "operator": "column_equal",
              "value": [
                "model_id",
                "5500"
              ]
            }
          ]
        }
        """)

        network = Network()
        network.parse_query(query)

        # AND condition, single column condition
        assert len(network.conditions) == 2

    def test_will_reuse_identical_conditions(self):
        # Operators are equal in each condition
        query = json.loads("""
        {
          "condition": "AND",
          "rules": [
            {
              "condition": "AND",
              "rules": [
                {
                  "id": "query_name",
                  "field": "query_name",
                  "type": "string",
                  "input": "text",
                  "operator": "equal",
                  "value": "asdf"
                }
              ]
            },
            {
              "id": "query_name",
              "field": "query_name",
              "type": "string",
              "input": "text",
              "operator": "equal",
              "value": "asdf"
            }
          ]
        }""")

        network = Network()
        network.parse_query(query)

        counts = defaultdict(int)
        for condition in network.conditions.values():
            counts[condition.__class__.__name__] += 1

        # Top-level AND, AND group, reused column condition
        assert counts == {'AndCondition': 2, 'EqualCondition': 1}

    def test_will_not_reuse_different_operators(self):
        # Different operators in top-level and group
        query = json.loads("""
        {
          "condition": "AND",
          "rules": [
            {
              "condition": "AND",
              "rules": [
                {
                  "id": "query_name",
                  "field": "query_name",
                  "type": "string",
                  "input": "text",
                  "operator": "not_equal",
                  "value": "asdf"
                }
              ]
            },
            {
              "id": "query_name",
              "field": "query_name",
              "type": "string",
              "input": "text",
              "operator": "equal",
              "value": "asdf"
            }
          ]
        }""")

        network = Network()
        network.parse_query(query)

        counts = defaultdict(int)
        for condition in network.conditions.values():
            counts[condition.__class__.__name__] += 1

        assert counts == {'AndCondition': 2, 'EqualCondition': 1, 'NotEqualCondition': 1}

    def test_will_not_reuse_different_groups(self):
        # Different operators in each sub-group
        query = json.loads("""
        {
          "condition": "AND",
          "rules": [
            {
              "condition": "AND",
              "rules": [
                {
                  "id": "query_name",
                  "field": "query_name",
                  "type": "string",
                  "input": "text",
                  "operator": "not_equal",
                  "value": "asdf"
                }
              ]
            },
            {
              "condition": "AND",
              "rules": [
                {
                  "id": "query_name",
                  "field": "query_name",
                  "type": "string",
                  "input": "text",
                  "operator": "equal",
                  "value": "asdf"
                }
              ]
            }
          ]
        }""")

        network = Network()
        network.parse_query(query)

        counts = defaultdict(int)
        for condition in network.conditions.values():
            counts[condition.__class__.__name__] += 1

        # Top level, each sub-group (not reused), each condition
        assert counts == {'AndCondition': 3, 'EqualCondition': 1, 'NotEqualCondition': 1}


class TestBaseCondition:

    def test_will_delegate(self):
        class SubCondition(BaseCondition):
            def __init__(self):
                BaseCondition.__init__(self)
                self.called_run = False

            def local_run(self, input):
                self.called_run = True

        condition = SubCondition()
        condition.run(DUMMY_INPUT)
        assert condition.called_run
        
    def test_will_cache_result(self):
        class SubCondition(BaseCondition):
            def __init__(self):
                BaseCondition.__init__(self)
                self.runs = 0

            def local_run(self, input):
                self.runs += 1

        condition = SubCondition()
        condition.run(DUMMY_INPUT)
        condition.run(DUMMY_INPUT)

        assert condition.runs == 1


class TestFunctional:

    def setup_method(self, _method):
        logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    def test_will_alert(self):
        query = json.loads("""
        {
          "condition": "AND",
          "rules": [
            {
              "id": "query_name",
              "field": "query_name",
              "type": "string",
              "input": "text",
              "operator": "begins_with",
              "value": "packs/osx-attacks/"
            },
            {
              "id": "action",
              "field": "action",
              "type": "string",
              "input": "text",
              "operator": "equal",
              "value": "added"
            }
          ]
        }""")

        network = Network()
        network.parse_query(query, alerters=['debug'])

        # Should trigger the top-level alert, above
        bad_input = RuleInput(result_log={
            'name': 'packs/osx-attacks/Whitesmoke',
            'timestamp': dt.datetime.now(),
            'action': 'added',
            'columns': {
                'path': '/LaunchAgents/com.whitesmoke.uploader.plist',
                'name': 'com.whitesmoke.uploader.plist',
                # Remainder omitted
            },
        }, node={
            'host_identifier': 'foo',
        })

        # Should *not* trigger the alert, above.
        good_input = RuleInput(result_log={
            'name': 'other-query',
            'timestamp': dt.datetime.now(),
            'action': 'added',
            'columns': {
                'a_column': 'column_value',
            },
        }, node={
            'host_identifier': 'foo',
        })

        alerts = network.process(good_input)
        assert len(alerts) == 0

        alerts = network.process(bad_input)
        assert list(alerts) == ['debug']

        # Re-process the good input to assert that we don't continue to alert
        # on good input after a bad one...
        alerts = network.process(good_input)
        assert len(alerts) == 0

        # ... and that we *do* continue to alert on bad input.
        alerts = network.process(bad_input)
        assert list(alerts) == ['debug']
