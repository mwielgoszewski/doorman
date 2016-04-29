# -*- coding: utf-8 -*-
import datetime as dt

from doorman.rules import (
    BlacklistRule,
    RuleMatch,
    WhitelistRule,
)


class TestBlacklistRule:

    def test_will_blacklist(self):
        now = dt.datetime.utcnow()

        data = [
            {
              "diffResults": {
                "added": [
                  {
                    "name": "malware",
                    "path": "/usr/local/bin/malware",
                    "pid": "12345"
                  },
                  {
                    "name": "legit",
                    "path": "/usr/local/bin/legit",
                    "pid": "6789"
                  },
                  {
                    "name": "malware",
                    "path": "/usr/local/bin/malware",
                    "pid": "10000"
                  },
                ],
                "removed": "",
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
            },
        ]
        node = {'host_identifier': 'hostname.local'}

        rule = BlacklistRule(config={
            'field': 'name',
            'blacklist': ['malware'],
        })

        expected1 = RuleMatch(
            rule_id=None,
            query_id=None,
            node=node,
            match=data[0]['diffResults']['added'][0],
        )
        expected2 = RuleMatch(
            rule_id=None,
            query_id=None,
            node=node,
            match=data[0]['diffResults']['added'][2],
        )

        # Blacklists the two matching things, but not the middle one.
        matches = rule.handle_result({'data': data}, node)
        assert matches == [expected1, expected2]


class TestWhitelistRule:

    def test_will_whitelist(self):
        now = dt.datetime.utcnow()

        data = [
            {
              "diffResults": {
                "added": [
                  {
                    "name": "good",
                    "path": "/usr/local/bin/good",
                    "pid": "12345"
                  },
                  {
                    "name": "unknown",
                    "path": "/usr/local/bin/unknown",
                    "pid": "6789"
                  },
                  {
                    "name": "othergood",
                    "path": "/usr/local/bin/othergood",
                    "pid": "10000"
                  },
                ],
                "removed": "",
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
            },
        ]
        node = {'host_identifier': 'hostname.local'}

        rule = WhitelistRule(config={
            'field': 'name',
            'whitelist': ['good', 'othergood'],
        })

        expected = RuleMatch(
            rule_id=None,
            query_id=None,
            node=node,
            match=data[0]['diffResults']['added'][1],
        )

        # Whitelists the two matching things, but not the middle one.
        matches = rule.handle_result({'data': data}, node)
        assert matches == [expected]

    def test_ignore_nulls(self):
        now = dt.datetime.utcnow()

        data = [
            {
              "diffResults": {
                "added": [
                  {
                    "name": None,
                    "path": "/usr/local/bin/good",
                    "pid": "12345"
                  },
                ],
                "removed": "",
              },
              "name": "processes",
              "hostIdentifier": "hostname.local",
              "calendarTime": "%s %s" % (now.ctime(), "UTC"),
              "unixTime": now.strftime('%s'),
            },
        ]
        node = {'host_identifier': 'hostname.local'}

        rule1 = WhitelistRule(config={
            'field': 'name',
            'whitelist': ['good'],
            'ignore_null': False,
        })
        rule2 = WhitelistRule(config={
            'field': 'name',
            'whitelist': ['good'],
            'ignore_null': True,
        })

        expected = RuleMatch(
            rule_id=None,
            query_id=None,
            node=node,
            match=data[0]['diffResults']['added'][0],
        )

        assert rule1.handle_result({'data': data}, node) == [expected]
        assert rule2.handle_result({'data': data}, node) == []
