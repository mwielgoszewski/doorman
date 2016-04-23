# -*- coding: utf-8 -*-
import pytest

from doorman.utils import validate_osquery_query


class TestValidate:

    def test_simple_validate(self):
        query = 'SELECT * FROM osquery_info;'
        assert validate_osquery_query(query) is True

    def test_complex_validate(self):
        # From Facebook's blog post: https://code.facebook.com/posts/844436395567983/introducing-osquery/
        query = 'SELECT DISTINCT process.name, listening.port, listening.address, process.pid FROM processes AS process JOIN listening_ports AS listening ON process.pid = listening.pid;'
        assert validate_osquery_query(query) is True

    def test_syntax_error(self):
        query = 'SELECT * FROM'
        assert validate_osquery_query(query) is False

    def test_bad_table(self):
        query = 'SELECT * FROM a_table_that_does_not_exist;'
        assert validate_osquery_query(query) is False
