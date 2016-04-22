# -*- coding: utf-8 -*-

from doorman.forms import (
    CreateQueryForm,
    UpdateQueryForm,
    UploadPackForm,
    CreateTagForm,
)


class TestCreateTagForm:

    def test_tag_validate_failure(self, testapp):
        form = CreateTagForm()
        assert form.validate() is False

    def test_tag_validate_success(self, testapp):
        form = CreateTagForm(value='foo')
        assert form.validate() is True


class TestCreateQueryForm:
    pass


class TestUpdateQueryForm:
    pass