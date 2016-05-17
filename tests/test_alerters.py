# -*- coding: utf-8 -*-
from collections import namedtuple
import json
import mock

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
