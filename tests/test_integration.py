# -*- coding: utf-8 -*-
import pytest

from flask import url_for
from werkzeug.routing import BuildError


class TestStandaloneApi:

    def test_no_manager(self, testapi):
        with pytest.raises(BuildError):
            url_for('manage.index')

        resp = testapi.get(url_for('api.index'))
        assert resp.status_code == 204

        resp = testapi.get('/path/does/not/exist', expect_errors=True)
        assert resp.status_code == 400
