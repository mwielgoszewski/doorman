# -*- coding: utf-8 -*-
from collections import namedtuple
import json
import mock

from doorman.rules import RuleMatch
from doorman.plugins.alerters.emailer import EmailAlerter
from doorman.plugins.alerters.pagerduty import PagerDutyAlerter


MockResponse = namedtuple('MockResponse', ['ok', 'content'])


class TestPagerDutyAlerter:

    def setup_method(self, _method):
        self.service_key = 'foobar'
        self.config = {
            'service_key': self.service_key,
        }

    def test_will_make_request(self):
        """ Simple test to ensure that there's no serialization or syntax errors. """
        resp = MockResponse(ok=True, content='blah')

        with mock.patch('requests.post', return_value=resp) as pmock:
            alerter = PagerDutyAlerter(self.config)
            alerter.handle_alert({'node': True}, {'match': True})

        assert pmock.called

        args, _ = pmock.call_args
        assert args[0] == 'https://events.pagerduty.com/generic/2010-04-15/create_event.json'

    def test_will_pass_service_key(self):
        resp = MockResponse(ok=True, content='blah')

        with mock.patch('requests.post', return_value=resp) as pmock:
            alerter = PagerDutyAlerter(self.config)
            alerter.handle_alert({'node': True}, {'match': True})

        assert pmock.called

        _, kwargs = pmock.call_args
        data = json.loads(kwargs['data'])
        assert data['service_key'] == self.service_key


class TestEmailerAlerter:
    def setup_method(self, _method):
        self.recipients = ['test@example.com']
        self.config = {
            'recipients': self.recipients,
            'subject_prefix': '[Doorman Test] '
        }

    def test_will_email(self, node, rule, testapp):
        from flask_mail import email_dispatched

        match = RuleMatch(
            rule_id=rule.id,
            node=node.to_dict(),
            action='added',
            match={'boo': 'baz', 'kung': 'bloo'}
        )

        expected_subject = '[Doorman Test] {host_identifier} {name} ({action})'.format(
            host_identifier=node.host_identifier,
            name=rule.name,
            action=match.action)

        @email_dispatched.connect
        def verify(message, app):
            assert message.subject == expected_subject
            assert self.recipients == message.recipients
            assert rule.name in message.body
            assert 'boo' in message.body
            assert 'baz' in message.body

        alerter = EmailAlerter(self.config)
        alerter.handle_alert(node.to_dict(), match)
