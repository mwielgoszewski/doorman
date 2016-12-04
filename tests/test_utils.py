# -*- coding: utf-8 -*-
import json
import datetime as dt

import pytest
from flask import current_app

from doorman.utils import (
    DateTimeEncoder,
    osquery_mock_db,
    quote,
    validate_osquery_query,
)


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

    def test_custom_schema(self):
        query = 'SELECT * FROM custom_table;'
        assert validate_osquery_query(query) is False

        try:
            # This is a bit hacky, but it clears the mock DB so the next call
            # will re-create it.
            osquery_mock_db.db = None

            current_app.config['DOORMAN_EXTRA_SCHEMA'].append(
                'CREATE TABLE custom_table (id INTEGER);'
            )
            assert validate_osquery_query(query) is True
        finally:
            # Remove final entry from the config.
            current_app.config['DOORMAN_EXTRA_SCHEMA'] = \
                current_app.config['DOORMAN_EXTRA_SCHEMA'][:-1]


class TestQuote:

    def test_will_quote_string(self):
        assert quote('foobar') == '"foobar"'
        assert quote('foo bar baz') == '"foo bar baz"'
        assert quote('foobar', quote='`') == '`foobar`'

    def test_will_escape(self):
        assert quote(r'foo"bar') == r'"foo\"bar"'
        assert quote(r'foo\bar') == r'"foo\\bar"'

    def test_quote_control_characters(self):
        assert quote("\r\n\t") == r'"\r\n\t"'

    def test_quote_unprintable_chars(self):
        assert quote('\x8Ffoo\xA3bar').lower() == r'"\x8Ffoo\xA3bar"'.lower()


class TestDateTimeEncoder:

    def test_will_serialize_datetime(self):
        time = dt.datetime(year=2016, month=5, day=16, hour=11, minute=11, second=11)
        data = {'foo': time}

        s = json.dumps(data, cls=DateTimeEncoder)
        assert s == '{"foo": "2016-05-16T11:11:11"}'
