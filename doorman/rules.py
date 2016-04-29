# -*- coding: utf-8 -*-
from collections import namedtuple

from doorman.utils import extract_results


RuleMatch = namedtuple('RuleMatch', ['rule_id', 'query_id', 'node', 'match'])


class BaseRule(object):
    """
    BaseRule is the base class for all rules in Doorman. It defines the
    interface that should be implemented by classes that know how to take
    incoming log data and determine if a rule has been triggered.
    """
    def __init__(self, rule_id=None, query_id=None):
        self.rule_id = rule_id
        self.query_id = query_id

    def handle_result(self, result, node):
        """
        This function should accept incoming log requests to perform any
        alerting.
        """
        raise NotImplementedError()

    def make_match(self, node, match):
        """ Helper function to create a RuleMatch """
        return RuleMatch(
            rule_id=self.rule_id,
            query_id=self.query_id,
            node=node,
            match=match
        )

    @staticmethod
    def from_model(model):
        """
        Create a Rule from a model.
        """
        return BaseRule.from_config(model.type, model.config)

    @staticmethod
    def from_config(type, config):
        """
        Create a Rule from a type and optional configuration.
        """
        klass = RULE_MAPPINGS.get(type)
        if klass is None:
            # Warn instead of raising?  We shouldn't get here, since it
            # shouldn't be possible to have saved a rule with an invalid type.
            raise ValueError('Invalid rule type: {0}'.format(type))

        # TODO: should validate required fields of config
        return klass(config)


class CompareRule(BaseRule):
    """
    CompareRule is the base class for rules that perform a comparison against a
    query's output.
    """
    def compare(self, event, node):
        raise NotImplementedError()

    def handle_result(self, result, node):
        matches = []
        for event in extract_results(result):
            for added in event.added:
                if self.compare(added, node):
                    matches.append(self.make_match(node, added))

        return matches


class BlacklistRule(CompareRule):
    """
    BlacklistRule is a rule that will alert if the value of a field in a query
    matches any item in a blacklist.
    """
    def __init__(self, config, **kwargs):
        super(BlacklistRule, self).__init__(**kwargs)
        self.field = config['field']
        self.blacklist = config['blacklist']

    def compare(self, added, node):
        val = added.get(self.field)
        if val is None:
            # TODO: warning?
            return False

        return val in self.blacklist


class WhitelistRule(CompareRule):
    """
    WhitelistRule is a rule that will alert if the value of a field in a query
    does not matche any entry in a whitelist.
    """
    def __init__(self, config, **kwargs):
        super(WhitelistRule, self).__init__(**kwargs)
        self.field = config['field']
        self.whitelist = config['whitelist']
        self.ignore_null = config.get('ignore_null', False)

    def compare(self, added, node):
        val = added.get(self.field)
        if val is None:
            # If we're ignoring null, we return "False" to indicate that this
            # is not a 'match' of the rule.
            if self.ignore_null:
                return False

            return True

        return val not in self.whitelist


class CountRule(BaseRule):
    """
    CountRule will match if a given query returns a number of results that's
    greater than, equal to, or less than, some threshold count.
    """
    def __init__(self, config, **kwargs):
        super(CountRule, self).__init__(**kwargs)
        self.count = int(config['count'])
        self.direction = config['direction']

        if self.direction not in ['greater', 'equal', 'less']:
            raise ValueError('Unknown direction in CountRule: {0}'.format(self.direction))

    def handle_result(self, result, node):
        matches = []
        for event in extract_results(result):
            count = len(event.added)

            # TODO: more information in match?
            if self.direction == 'greater' and count > self.count:
                matches.append(self.make_match(node, event.added))
            elif self.direction == 'equal' and count == self.count:
                matches.append(self.make_match(node, event.added))
            elif self.direction == 'less' and count < self.count:
                matches.append(self.make_match(node, event.added))

        return matches


# Note: should be at the end of the file
RULE_MAPPINGS = {
    'blacklist': BlacklistRule,
    'whitelist': WhitelistRule,
}
RULE_TYPES = list(RULE_MAPPINGS.keys())
