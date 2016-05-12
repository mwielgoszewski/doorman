# -*- coding: utf-8 -*-

from doorman.manage.forms import (
    CreateQueryForm,
    UpdateQueryForm,
    UploadPackForm,
    CreateTagForm,
)

from .factories import QueryFactory


class TestCreateTagForm:

    def test_tag_validate_failure(self, testapp):
        form = CreateTagForm()
        assert form.validate() is False

    def test_tag_validate_success(self, testapp):
        form = CreateTagForm(value='foo')
        assert form.validate() is True


class TestCreateQueryForm:

    def test_sql_validate_failure(self, testapp, db):
        form = CreateQueryForm(
            name='foobar',
            sql='select * from foobar;'
        )
        assert form.validate() is False
        assert 'sql' in form.errors
        assert 'name' not in form.errors

    def test_sql_validate_success(self, testapp, db):
        form = CreateQueryForm(
            name='foobar',
            sql='select * from osquery_info;',
        )
        assert form.validate() is True


class TestUpdateQueryForm:

    def test_sql_validate_failure(self, testapp, db):
        query = QueryFactory(
            name='foobar',
            sql='select * from osquery_info;'
        )
        form = UpdateQueryForm(
            name=query.name,
            sql='select * from foobar;'
        )
        assert form.validate() is False
        assert 'sql' in form.errors
        assert 'name' not in form.errors

    def test_sql_validate_success(self, testapp, db):
        query = QueryFactory(
            name='foobar',
            sql='select * from osquery_info;'
        )
        form = UpdateQueryForm(
            name=query.name,
            sql='select * from platform_info;'
        )
        assert form.validate() is True
