# -*- coding: utf-8 -*-
from collections import namedtuple


RuleInput = namedtuple('RuleInput', ['result_log', 'node'])


def column_extract_value(column, input):
    columns = input.result_log.columns
    return columns.get(column)


class Network(object):
    """
    A grouping of rule nodes.  Contains the base logic for running the rules on
    some input.
    """
    def __init__(self):
        self.rules = {}
        self.alert_rules = []

    def make_rule(self, klass, *args, **kwargs):
        """
        Memoizing constructor for rules.
        """
        # dicts are not hashable, so we need to turn the kwargs into a tuple.
        # Must ensure they're sorted, because dict iteration order is not
        # guaranteed by Python.
        kwargs_tuple = tuple(sorted(kwargs.items()))

        # Calculate the memoization key
        key = (klass.__name__, args, kwargs_tuple)
        if key in self.rules:
            return self.rules[key]

        inst = klass(*args, **kwargs)
        self.rules[key] = inst

        if isinstance(inst, AlertRule):
            self.alert_rules.append(inst)

        return inst

    def process(self, input):
        # Step 1: Mark all rules as 'not evaluated'.
        for rule in self.rules.values():
            rule.evaluated = False

        # Step 2: For each alerter rule, we tell it to 'process' a new input.
        # This will propagate "upstream" to each rule node and evaluate the
        # dependent chain of rules.  We then check if the rule has triggered.
        alerts = set()
        for rule in self.alert_rules:
            if rule.run():
                alerts.add(rule.alert)

        # TODO: trigger alerts

    def parse_query(self, query):
        """
        Parse a query output from jQuery.QueryBuilder.
        """
        def parse_rule(d):
            op = d['operator']
            expected = d['value']
            
            # If this is a "column operator" - i.e. operating on a particular
            # value in a column - then we need to give a custom extraction
            # function that knows how to get this value from a query.
            extract_value = None
            if d['field'] == 'column':
                # Strip 'column_' prefix
                op = op[7:]

                # The 'value' array will look like ['column_name', 'actual value']
                extract_value = lambda i: column_extract_value(value[0])
                value = value[1]

            klass = OPERATOR_MAP.get(op)
            if not klass:
                raise ValueError("Unsupported operator: {0}".format(op))
            
            inst = self.make_rule(klass, d['field'], value, extract_value=extract_value)
            return inst
        
        def parse_group(d):
            upstreams = [parse(r) for r in d['rules']]

            condition = d['condition']
            if condition == 'AND':
                return self.make_rule(AndRule, upstreams)
            elif condition == 'OR':
                return self.make_rule(OrRule, upstreams)

            raise ValueError("Unknown condition: {0}".format(condition))

        def parse(d):
            if 'condition' in d:
                return parse_group(d)
            
            return parse_rule(d)

        # The root is always a group
        parse_group(query)


class BaseRule(object):
    """
    Base class for rules.  Contains the logic for adding a dependency to a
    rule and pretty-printing one.
    """
    def __init__(self):
        self.evaluated = False
        self.cached_value = None
        self.network = None

    def init_network(self, network):
        self.network = network

    def run(self, input):
        """
        Runs this rule if it hasn't been evaluated.
        """
        assert isinstance(input, RuleInput)
        if self.evaluated:
            return self.cached_value

        ret = self.local_run(input)
        self.cached_value = ret
        self.evaluated = True
        return ret

    def local_run(self, input):
        """
        Subclasses should implement this in order to run the rule's logic.
        """
        raise NotImplementedError()

    def __repr__(self):
        return '<{0} (evaluated={1})>'.format(
            self.__class__.__name__,
            self.evaluated
        )


class AlertRule(BaseRule):
    """
    Alerting rule - any input that reaches this rule will trigger the
    given alert.
    """
    def __init__(self, alert, upstream):
        super(AlertRule, self).__init__()
        self.alert = alert
        self.upstream = upstream

    def local_run(self, input):
        return self.upstream.run(input)


class AndRule(BaseRule):
    def __init__(self, upstream):
        super(AndRule, self).__init__()
        self.upstream = []

    def local_run(self, input):
        for u in self.upstream:
            if not u.run(input):
                return False

        return True


class OrRule(BaseRule):
    def __init__(self, upstream):
        super(OrRule, self).__init__()
        self.upstream = []

    def local_run(self, input):
        for u in self.upstream:
            if u.run(input):
                return True

        return False


class LogicRule(BaseRule):
    def __init__(self, key, expected, extract_value=None):
        super(LogicRule, self).__init__()
        self.key = key
        self.expected = expected
        self.extract_value = extract_value

    def local_run(self, input):
        # If we have the 'extract_value' function, we should use that to
        # extract the input (e.g. for column rules).  Otherwise, we have a
        # whitelist of what we can get from the input.
        if self.extract_value:
            value = self.extract_value(input)
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

        # Pass to the actual logic function
        return self.compare(value)

    def compare(self, value):
        """
        Subclasses should implement this to run the actual comparison.
        """
        raise NotImplementedError()


class EqualRule(LogicRule):
    def compare(self, value):
        return self.expected == value


class NotEqualRule(LogicRule):
    def compare(self, value):
        return self.expected != value


class BeginsWithRule(LogicRule):
    def compare(self, value):
        return value.startswith(self.expected)


class NotBeginsWithRule(LogicRule):
    def compare(self, value):
        return not value.startswith(self.expected)


class ContainsRule(LogicRule):
    def compare(self, value):
        return self.expected in value


class NotContainsRule(LogicRule):
    def compare(self, value):
        return self.expected not in value


class EndsWithRule(LogicRule):
    def compare(self, value):
        return value.endswith(self.expected)


class NotEndsWithRule(LogicRule):
    def compare(self, value):
        return not value.endswith(self.expected)


class IsEmptyRule(LogicRule):
    def compare(self, value):
        return value == ''


class IsNotEmptyRule(LogicRule):
    def compare(self, value):
        return value != ''


class LessRule(LogicRule):
    def compare(self, value):
        return self.expected < value


class LessEqualRule(LogicRule):
    def compare(self, value):
        return self.expected <= value


class GreaterRule(LogicRule):
    def compare(self, value):
        return self.expected > value


class GreaterEqualRule(LogicRule):
    def compare(self, value):
        return self.expected >= value


# Needs to go at the end
OPERATOR_MAP = {
    'equal': EqualRule,
    'not_equal': NotEqualRule,
    'begins_with': BeginsWithRule,
    'not_begins_with': NotBeginsWithRule,
    'contains': ContainsRule,
    'not_contains': NotContainsRule,
    'ends_with': EndsWithRule,
    'not_ends_with': NotEndsWithRule,
    'is_empty': IsEmptyRule,
    'is_not_empty': IsNotEmptyRule,
    'less': LessRule,
    'less_or_equal': LessEqualRule,
    'greater': GreaterRule,
    'greater_or_equal': GreaterEqualRule,
}
