# -*- coding: utf-8 -*-
import pytest

from flask import url_for
from flask_login import current_user
from werkzeug.routing import BuildError

from doorman.users.mixins import NoAuthUserMixin


class TestStandaloneApi:

    def test_no_manager(self, testapi):
        with pytest.raises(BuildError):
            url_for('manage.index')

        resp = testapi.get(url_for('api.index'))
        assert resp.status_code == 204

        resp = testapi.get('/path/does/not/exist', expect_errors=True)
        assert resp.status_code == 400


class TestNoAuth:

    def test_noauth_user_mixin_is_authenticated(self, testapp):

        assert current_user is not None
        assert current_user.is_authenticated
        assert current_user.is_active
        assert not current_user.username  # no username for this faux user


class TestDoormanAuth:
    pass


class TestGoogleAuth:
    pass
