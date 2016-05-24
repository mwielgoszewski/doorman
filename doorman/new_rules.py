# -*- coding: utf-8 -*-
from hashlib import sha256
from collections import namedtuple


RuleInput = namedtuple('RuleInput', ['result_log', 'node'])


OPERATOR_MAP = {
    'equal': EqualRule,
    'not_equal': NotEqualRule,
}


class Network(object):
    """
    A grouping of rule nodes.  Contains the base logic for running the rules on
    some input.
    """
    def __init__(self):
        self.rules = {}
        self.alert_rules = []

    def add_rule(self, rule):
        hash = rule.hash()
        if hash in self.rules:
            return self.rules[hash]

        self.rules[hash] = rule

        if isinstance(rule, AlertRule):
            self.alert_rules.append(rule)

        return rule

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
            klass = OPERATOR_MAP.get(op)
            if not klass:
                raise ValueError("Unsupported operator: {0}".format(op))
            
            inst = klass(d['field'], d['value'])
            return inst
        
        def parse_group(d):
            upstreams = [parse(r) for r in d['rules']]

            condition = d['condition']
            if condition == 'AND':
                return AndRule(upstreams)
            elif condition == 'OR':
                return OrRule(upstreams)

            raise ValueError("Unknown condition: {0}".format(condition))

        def parse(d):
            if 'condition' in d:
                return parse_group(d)
            
            return parse_rule(d)

        # The root is always a group
        tree = parse_group(query)
        # TODO: what do we do with the parsed tree?  need to de-dupe
        # Other notes:
        #   - Can we add to the network here?
        #   - Should AND/OR depend on directly, or on 'hashes'?
        #   - 
        raise NotImplementedError()


class BaseRule(object):
    """
    Base class for rules.  Contains the logic for adding a dependency to a
    rule, for computing a hash of a rule, and pretty-printing one.
    """
    def __init__(self):
        self.evaluated = False
        self.cached_value = None

    def hash(self):
        """
        Returns a unique hash for this rule.  If a rule has the same has as
        another rule, then they should have identical behavior.
        """
        h = hashlib.sha256()
        h.update(self.__class__.__name__)
        self.local_hash(h)
        return h.hexdigest()[:10]

    def run(self):
        """
        Runs this rule if it hasn't been evaluated.
        """
        if self.evaluated:
            return self.cached_value

        ret = self.local_run()
        self.cached_value = ret
        self.evaluated = True
        return ret

    def local_run(self):
        """
        Subclasses should implement this in order to run the rule's logic.
        """
        raise NotImplementedError()

    def local_hash(self, hasher):
        """
        Subclasses should implement this to hash data local to this rule.
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

    def local_run(self):
        return self.upstream.run()

    def local_hash(self, hasher):
        hasher.update(alert)


class AndRule(BaseRule):
    def __init__(self, upstream):
        super(AndRule, self).__init__()
        self.upstream = []

    def local_hash(self, hasher):
        for u in self.upstream:
            u.local_hash(hasher)

    def local_run(self):
        for u in self.upstream:
            if not u.run():
                return False

        return True


class OrRule(BaseRule):
    def __init__(self, upstream):
        super(OrRule, self).__init__()
        self.upstream = []

    def local_hash(self, hasher):
        for u in self.upstream:
            u.local_hash(hasher)

    def local_run(self):
        for u in self.upstream:
            if u.run():
                return True

        return False


class LogicRule(BaseRule):
    def __init__(self, key, value):
        super(LogicRule, self).__init__()
        self.key = key
        self.value = value

    def local_run(self):
        # TODO get the value from the input here
        value = None

        # Pass to the actual logic function
        return self.compare(value)

    def compare(self, value):
        """
        Subclasses should implement this to run the actual comparison.
        """
        raise NotImplementedError()


class EqualRule(LogicRule):
    def compare(self, value):
        return self.value == value


class NotEqualRule(LogicRule):
    def compare(self, value):
        return self.value != value
