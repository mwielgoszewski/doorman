# -*- coding: utf-8 -*-
import re
import logging
from collections import namedtuple

import six


logger = logging.getLogger(__name__)


RuleInput = namedtuple('RuleInput', ['result_log', 'node'])
RuleMatch = namedtuple('RuleMatch', ['rule', 'result', 'node'])


class Network(object):
    """
    A grouping of condition nodes.  Contains the base logic for running the
    conditions on some input.
    """
    def __init__(self):
        self.conditions = {}
        self.alert_conditions = []

    def make_condition(self, klass, *args, **kwargs):
        """
        Memoizing constructor for conditions.  Uses the input config as the cache key.
        """
        # Calculate the memoization key.  We do this by creating a 3-tuple of
        # (condition class name, args, kwargs).  There is some nuance to this,
        # though: we need to put args/kwargs in the right format.  We
        # recursively iterate through lists/dicts and convert them to tuples,
        # and extract the memoization key from instances of BaseCondition.
        def tupleify(obj):
            if isinstance(obj, BaseCondition):
                return obj.__network_memo_key
            elif isinstance(obj, tuple):
                return tuple(tupleify(x) for x in obj)
            elif isinstance(obj, list):
                return tuple(tupleify(x) for x in obj)
            elif isinstance(obj, dict):
                items = ((tupleify(k), tupleify(v)) for k, v in obj.items())
                return tuple(sorted(items))
            else:
                return obj

        args_tuple = tupleify(args)
        kwargs_tuple = tupleify(kwargs)

        key = (klass.__name__, args_tuple, kwargs_tuple)
        if key in self.conditions:
            return self.conditions[key]

        # Instantiate the condition class.  Also, save the memoization key on
        # the class, so it can be retrieved (above).
        inst = klass(*args, **kwargs)
        inst.__network_memo_key = key

        # Save the condition
        self.conditions[key] = inst
        return inst

    def make_alert_condition(self, alert, dependent, rule_id=None):
        self.alert_conditions.append((alert, dependent, rule_id))

    def process(self, entry, node):
        input = RuleInput(result_log=entry, node=node)

        # Step 1: Mark all conditions as 'not evaluated'.
        for condition in self.conditions.values():
            condition.evaluated = False

        # Step 2: For each alerter condition, we tell it to 'process' a new
        # input.  This will propagate "upstream" to each condition node and
        # evaluate the dependent chain of conditions.  We then check if the
        # condition has triggered.
        alerts = set()
        for (alert, upstream, rule_id) in self.alert_conditions:
            if upstream.run(input):
                alerts.add((alert, rule_id))

        # Step 3: Return all alerts to the caller.
        return alerts

    def parse_query(self, query, alerters=None, rule_id=None):
        """
        Parse a query output from jQuery.QueryBuilder.
        """
        def parse_condition(d):
            op = d['operator']
            value = d['value']
            
            # If this is a "column operator" - i.e. operating on a particular
            # value in a column - then we need to give a custom extraction
            # function that knows how to get this value from a query.
            column_name = None
            if d['field'] == 'column':
                # Strip 'column_' prefix to get the 'real' operator.
                op = op[7:]

                if isinstance(value, six.string_types):
                    column_name = value
                else:
                    # The 'value' array will look like ['column_name', 'actual value']
                    column_name, value = value

            klass = OPERATOR_MAP.get(op)
            if not klass:
                raise ValueError("Unsupported operator: {0}".format(op))
            
            inst = self.make_condition(klass, d['field'], value, column_name=column_name)
            return inst
        
        def parse_group(d):
            if len(d['rules']) == 0:
                raise ValueError("A group contains no rules")

            upstreams = [parse(r) for r in d['rules']]

            condition = d['condition']
            if condition == 'AND':
                return self.make_condition(AndCondition, upstreams)
            elif condition == 'OR':
                return self.make_condition(OrCondition, upstreams)

            raise ValueError("Unknown condition: {0}".format(condition))

        def parse(d):
            if 'condition' in d:
                return parse_group(d)
            
            return parse_condition(d)

        # The root is always a group
        root = parse_group(query)

        # Add alert condition(s) that trigger when this group does
        if alerters is not None:
            for alert in alerters:
                self.make_alert_condition(alert, root, rule_id)


class BaseCondition(object):
    """
    Base class for conditions.  Contains the logic for adding a dependency to a
    condition and pretty-printing one.
    """
    def __init__(self):
        self.evaluated = False
        self.cached_value = None
        self.network = None

    def init_network(self, network):
        self.network = network

    def run(self, input):
        """
        Runs this condition if it hasn't been evaluated.
        """
        assert isinstance(input, RuleInput)

        logger.debug("Evaluating condition %r on input: %r", self, input)
        if self.evaluated:
            logger.debug("Returning cached value: %r", self.cached_value)
            return self.cached_value

        ret = self.local_run(input)
        logger.debug("Condition %r returned value: %r", self, ret)
        self.cached_value = ret
        self.evaluated = True
        return ret

    def local_run(self, input):
        """
        Subclasses should implement this in order to run the condition's logic.
        """
        raise NotImplementedError()

    def __repr__(self):
        return '<{0} (evaluated={1})>'.format(
            self.__class__.__name__,
            self.evaluated
        )


class AndCondition(BaseCondition):
    def __init__(self, upstream):
        super(AndCondition, self).__init__()
        self.upstream = upstream

    def local_run(self, input):
        for u in self.upstream:
            if not u.run(input):
                return False

        return True


class OrCondition(BaseCondition):
    def __init__(self, upstream):
        super(OrCondition, self).__init__()
        self.upstream = upstream

    def local_run(self, input):
        for u in self.upstream:
            if u.run(input):
                return True

        return False


class LogicCondition(BaseCondition):
    def __init__(self, key, expected, column_name=None):
        super(LogicCondition, self).__init__()
        self.key = key
        self.expected = self.maybe_make_number(expected)
        self.column_name = column_name

    def maybe_make_number(self, value):
        if not isinstance(value, six.string_types):
            return value

        if value.isdigit():
            return int(value)
        elif '.' in value and value.replace('.', '', 1).isdigit():
            return float(value)

        return value

    def local_run(self, input):
        # If we have a 'column_name', we should use that to extract the value
        # from the input's columns.  Otherwise, we have a whitelist of what we
        # can get from the input.
        if self.column_name is not None:
            value = input.result_log['columns'].get(self.column_name)
        elif self.key == 'query_name':
            value = input.result_log['name']
        elif self.key == 'timestamp':
            value = input.result_log['timestamp']
        elif self.key == 'action':
            value = input.result_log['action']
        elif self.key == 'host_identifier':
            value = input.node['host_identifier']
        else:
            raise KeyError('Unknown key: {0}'.format(self.key))

        # Try and convert the value to a number, if it looks like one
        value = self.maybe_make_number(value)

        # Pass to the actual logic function
        logger.debug("Running logic condition %r: %r | %r", self, self.expected, value)
        return self.compare(value)

    def compare(self, value):
        """
        Subclasses should implement this to run the actual comparison.
        """
        raise NotImplementedError()


class EqualCondition(LogicCondition):
    def compare(self, value):
        return value == self.expected


class NotEqualCondition(LogicCondition):
    def compare(self, value):
        return value != self.expected


class BeginsWithCondition(LogicCondition):
    def compare(self, value):
        return value.startswith(self.expected)


class NotBeginsWithCondition(LogicCondition):
    def compare(self, value):
        return not value.startswith(self.expected)


class ContainsCondition(LogicCondition):
    def compare(self, value):
        return self.expected in value


class NotContainsCondition(LogicCondition):
    def compare(self, value):
        return self.expected not in value


class EndsWithCondition(LogicCondition):
    def compare(self, value):
        return value.endswith(self.expected)


class NotEndsWithCondition(LogicCondition):
    def compare(self, value):
        return not value.endswith(self.expected)


class IsEmptyCondition(LogicCondition):
    def compare(self, value):
        return value == ''


class IsNotEmptyCondition(LogicCondition):
    def compare(self, value):
        return value != ''


class LessCondition(LogicCondition):
    def compare(self, value):
        return value < self.expected


class LessEqualCondition(LogicCondition):
    def compare(self, value):
        return value <= self.expected


class GreaterCondition(LogicCondition):
    def compare(self, value):
        return value > self.expected


class GreaterEqualCondition(LogicCondition):
    def compare(self, value):
        return value >= self.expected


class MatchesRegexCondition(LogicCondition):
    def __init__(self, key, expected, **kwargs):
        # Pre-compile the 'expected' value - the regex.
        expected = re.compile(expected)
        super(MatchesRegexCondition, self).__init__(key, expected, **kwargs)

    def compare(self, value):
        return self.expected.match(value) is not None


class NotMatchesRegexCondition(LogicCondition):
    def __init__(self, key, expected, **kwargs):
        # Pre-compile the 'expected' value - the regex.
        expected = re.compile(expected)
        super(NotMatchesRegexCondition, self).__init__(key, expected, **kwargs)

    def compare(self, value):
        return self.expected.match(value) is None


# Needs to go at the end
OPERATOR_MAP = {
    'equal': EqualCondition,
    'not_equal': NotEqualCondition,
    'begins_with': BeginsWithCondition,
    'not_begins_with': NotBeginsWithCondition,
    'contains': ContainsCondition,
    'not_contains': NotContainsCondition,
    'ends_with': EndsWithCondition,
    'not_ends_with': NotEndsWithCondition,
    'is_empty': IsEmptyCondition,
    'is_not_empty': IsNotEmptyCondition,
    'less': LessCondition,
    'less_or_equal': LessEqualCondition,
    'greater': GreaterCondition,
    'greater_or_equal': GreaterEqualCondition,
    'matches_regex': MatchesRegexCondition,
    'not_matches_regex': NotMatchesRegexCondition,
}
