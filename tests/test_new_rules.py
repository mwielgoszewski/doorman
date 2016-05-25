# -*- coding: utf-8 -*-
import json
import datetime as dt

from doorman.new_rules import (
    BaseRule,
    EqualRule,
    Network,
    RuleInput,
)


DUMMY_INPUT = RuleInput(result_log={}, node={})


class TestNetwork:

    def test_will_cache_rule_instances(self):
        class TestRule(BaseRule):
            pass

        network = Network()
        one = network.make_rule(TestRule)
        two = network.make_rule(TestRule)

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

        # AND rule, single column rule
        assert len(network.rules) == 2

    def test_will_reuse_identical_rules(self):
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

        # Top-level AND, AND group, reused column rule
        assert len(network.rules) == 3



class TestBaseRule:

    def test_will_delegate(self):
        class SubRule(BaseRule):
            def __init__(self):
                BaseRule.__init__(self)
                self.called_run = False

            def local_run(self, input):
                self.called_run = True

        rule = SubRule()
        rule.run(DUMMY_INPUT)
        assert rule.called_run
        
    def test_will_cache_result(self):
        class SubRule(BaseRule):
            def __init__(self):
                BaseRule.__init__(self)
                self.runs = 0

            def local_run(self, input):
                self.runs += 1

        rule = SubRule()
        rule.run(DUMMY_INPUT)
        rule.run(DUMMY_INPUT)

        assert rule.runs == 1
