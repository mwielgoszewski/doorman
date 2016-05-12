# -*- coding: utf-8 -*-
"""Defines fixtures available to all tests."""

import pytest
from webtest import TestApp

from doorman.application import create_app
from doorman.database import db as _db
from doorman.models import Rule
from doorman.rules import BaseRule, EachResultRule
from doorman.settings import TestConfig

from .factories import NodeFactory


@pytest.yield_fixture(scope='function')
def app():
    """An application for the tests."""
    _app = create_app(config=TestConfig)
    ctx = _app.test_request_context()
    ctx.push()

    try:
        yield _app
    finally:
        ctx.pop()


@pytest.yield_fixture(scope='function')
def api():
    """An api instance for the tests, no manager"""
    import os
    # the mere presence of the env var should prevent the manage
    # blueprint from being registered
    os.environ['DOORMAN_NO_MANAGER'] = '1'
    
    _app = create_app(config=TestConfig)
    ctx = _app.test_request_context()
    ctx.push()

    try:
        yield _app
    finally:
        ctx.pop()


@pytest.fixture(scope='function')
def testapp(app):
    """A Webtest app."""
    return TestApp(app)


@pytest.fixture(scope='function')
def testapi(api):
    return TestApp(api)


@pytest.yield_fixture(scope='function')
def db(app):
    """A database for the tests."""
    _db.app = app
    with app.app_context():
        _db.create_all()

    yield _db

    # Explicitly close DB connection
    _db.session.close()
    _db.drop_all()


@pytest.fixture
def node(db):
    """A node for the tests."""
    node = NodeFactory(host_identifier='foobar', enroll_secret='foobar')
    db.session.commit()
    return node


class _FakeBaseRule(BaseRule):
    def __init__(self, *args, **kwargs):
        super(_FakeBaseRule, self).__init__(*args, **kwargs)
        self.calls = []

    def handle_result(self, result, node):
        self.calls.append((result, node))


@pytest.fixture(scope='function')
def FakeBaseRule():
    def create_rule(rule_id=0, action=Rule.BOTH, config=None):
        return _FakeBaseRule(rule_id, action, config or {})
    return create_rule


class _FakeEachResultRule(EachResultRule):
    def __init__(self, *args, **kwargs):
        super(_FakeEachResultRule, self).__init__(*args, **kwargs)
        self.calls = []

    def handle_columns(self, action, item, node):
        self.calls.append((action, item, node))


@pytest.fixture(scope='function')
def FakeEachResultRule():
    def create_rule(rule_id=0, action=Rule.BOTH, config=None):
        return _FakeEachResultRule(rule_id, action, config or {})
    return create_rule
