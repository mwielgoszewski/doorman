# -*- coding: utf-8 -*-
from collections import namedtuple

from doorman.models import Rule
from doorman.utils import extract_results


# Note: the fields are:
#   - rule_id               The ID of the Rule that created this match
#   - node                  The node that this Rule match applies to
#   - action                The action that took place ('added', 'removed', or None)
#   - match                 Some additional details about this match (any type)
RuleMatch = namedtuple('RuleMatch', ['rule_id', 'node', 'action', 'match'])


class BaseRule(object):
    """
    BaseRule is the base class for all rules in Doorman. It defines the
    interface that should be implemented by classes that know how to take
    incoming log data and determine if a rule has been triggered.
    """
    def __init__(self, rule_id, action, config):
        self.rule_id = rule_id
        self.node_name = config.get('node_name')

    def handle_log_entry(self, entry, node):
        """
        This function processes an incoming log entry.  It normalizes the data,
        validates the node name (if that filter was given), and then dispatches
        to the underlying rule.

        Note: the entry passed in contains a `hostIdentifier` field sent by the
        client, and `node` contains a `host_identifier` field that was
        originally stored when the node enrolled.  Note that the
        `hostIdentifier` field in the incoming entry may have changed, e.g. if
        the user changes their hostname.  All the rules here use the node's
        (original) `host_identifier` value for comparisons.

        :param entry: The full request received from the client (i.e. including "node_key", etc.)
        :param node: Information about the sending node, retrieved from the database.
        :type entry: dict
        :type node: dict, created from the Node model

        :returns: A list of matches
        """
        if self.node_name is not None and node['host_identifier'] != self.node_name:
            return []

        matches = []
        for result in extract_results(entry):
            res = self.handle_result(result, node)
            if res is not None:
                matches.extend(res)

        return matches

    def handle_result(self, result, node):
        """
        This function should be implemented by anything that wishes to handle a
        single result from a log entry.

        :param result: A single query result, as returned by extract_results
        :param node: Information about the sending node, retrieved from the database.
        :type result: Field
        :type node: dict, created from the Node model
        """
        raise NotImplementedError()

    def make_match(self, action, node, match):
        """ Helper function to create a RuleMatch """
        return RuleMatch(
            rule_id=self.rule_id,
            action=action,
            node=node,
            match=match
        )

    @staticmethod
    def from_model(model):
        """
        Create a Rule from a model.
        """
        klass = RULE_MAPPINGS.get(model.type)
        if klass is None:
            # Warn instead of raising?  We shouldn't get here, since it
            # shouldn't be possible to have saved a rule with an invalid type.
            raise ValueError('Invalid rule type: {0}'.format(model.type))

        # TODO: should validate required fields of config
        return klass(model.id, model.action, model.config)


class EachResultRule(BaseRule):
    """
    Base class for rules that want to compare against every result in a query's
    output.
    """
    def __init__(self, rule_id, action, config):
        super(EachResultRule, self).__init__(rule_id, action, config)
        self.action = action
        self.query_name = config.get('query_name')

    def filter_result(self, result):
        """
        Given an action filter and a result, yields only results that match the filter.
        """
        for action, columns in zip((Rule.ADDED, Rule.REMOVED), (result.added, result.removed)):
            if self.action not in (action, Rule.BOTH):
                continue

            if columns == '' or not columns:
                continue

            for item in columns:
                yield (action, item)

    def handle_result(self, result, node):
        if self.query_name is not None and result.name != self.query_name:
            return

        for action, columns in self.filter_result(result):
            res = self.handle_columns(action, columns, node)
            if res is not None:
                yield res

    def handle_columns(self, action, columns, node):
        """
        This function should be implemented to match against each set of
        columns that has been extracted.
        """
        raise NotImplementedError()


class CompareRule(EachResultRule):
    """
    This is a simple helper class that will extract a value from the given
    column set and pass it to a comparison function.  If it compares, it will
    create and return a match.
    """
    def handle_columns(self, action, columns, node):
        val = columns.get(self.field_name)
        if self.compare(action, val, node):
            return self.make_match(action, node, columns)

    def compare(self, action, value, node):
        raise NotImplementedError()


class BlacklistRule(CompareRule):
    """
    BlacklistRule is a rule that will alert if the value of a field in a query
    matches any item in a blacklist.
    """
    def __init__(self, rule_id, action, config):
        super(BlacklistRule, self).__init__(rule_id, action, config)

        self.field_name = config['field_name']
        self.blacklist = config['blacklist']

    def compare(self, action, value, node):
        if value is None:
            return False

        return value in self.blacklist


class WhitelistRule(CompareRule):
    """
    WhitelistRule is a rule that will alert if the value of a field in a query
    does not matche any entry in a whitelist.
    """
    def __init__(self, rule_id, action, config):
        super(WhitelistRule, self).__init__(rule_id, action, config)

        self.field_name = config['field_name']
        self.whitelist = config['whitelist']
        self.ignore_null = config.get('ignore_null', False)

    def compare(self, action, value, node):
        if value is None:
            # If we're ignoring null, we return "False" to indicate that this
            # is not a 'match' of the rule.
            if self.ignore_null:
                return False

            return True

        return value not in self.whitelist


class CountRule(BaseRule):
    """
    CountRule will match if a given query returns a number of results that's
    greater than, equal to, or less than, some threshold count.

    This is generally only useful when combined with an 'action' filter, so as
    to only count the 'added' or 'removed' values.
    """
    def __init__(self, rule_id, action, config):
        super(CountRule, self).__init__(rule_id, action, config)

        self.action = action
        self.count = int(config['count'])
        self.direction = config['direction']
        if self.direction not in ['greater', 'equal', 'less']:
            raise ValueError('Unknown direction in CountRule: {0}'.format(self.direction))

        self.query_name = config.get('query_name')

    def get_counts(self, result):
        count = 0

        if self.action == Rule.ADDED or self.action == Rule.BOTH:
            count += len(result.added)
        if self.action == Rule.REMOVED or self.action == Rule.BOTH:
            count += len(result.removed)

        return count

    def handle_result(self, result, node):
        if self.query_name is not None and result.name != self.query_name:
            return

        count = self.get_counts(result)

        # TODO: more information in match?
        matches = []
        if self.direction == 'greater' and count > self.count:
            matches.append(self.make_match(None, node, count))
        elif self.direction == 'equal' and count == self.count:
            matches.append(self.make_match(None, node, count))
        elif self.direction == 'less' and count < self.count:
            matches.append(self.make_match(None, node, count))

        return matches


# Note: should be at the end of the file
RULE_MAPPINGS = {
    'blacklist': BlacklistRule,
    'whitelist': WhitelistRule,
    'count':     CountRule,
}
RULE_TYPES = list(RULE_MAPPINGS.keys())
