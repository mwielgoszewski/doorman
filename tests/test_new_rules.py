# -*- coding: utf-8 -*-
import datetime as dt

from doorman.new_rules import (
    BaseRule,
    EqualRule,
    RuleInput,
)


DUMMY_INPUT = RuleInput(result_log={}, node={})


class TestBaseRule:

    def test_will_delegate(self):
        class SubRule(BaseRule):
            def __init__(self):
                BaseRule.__init__(self)
                self.called_run = False
                self.called_hash = False

            def local_run(self, input):
                self.called_run = True

            def local_hash(self, hasher):
                self.called_hash = True

        rule = SubRule()
        rule.run(DUMMY_INPUT)
        assert rule.called_run
        
        rule.hash()
        assert rule.called_hash

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

    def test_hash_based_on_class(self):
        """ Test that the hash depends on the current class """
        class OneRule(BaseRule):
            def local_hash(self, hasher):
                hasher.update('foo')

        class TwoRule(BaseRule):
            def local_hash(self, hasher):
                hasher.update('foo')

        r1 = OneRule()
        r2 = TwoRule()

        assert r1.hash() == r1.hash()
        assert r2.hash() == r2.hash()
        assert r1.hash() != r2.hash()


class TestEqualRule:

    def test_compares_equal(self):
        rule = EqualRule('key', 'expected')
        # TODO
