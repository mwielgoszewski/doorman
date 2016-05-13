# -*- coding: utf-8 -*-
import logging

import requests

from .base import AbstractAlerterPlugin


DEFAULT_KEY_FORMAT = 'doorman-incident-{count}'


class PagerDutyAlerter(AbstractAlerterPlugin):
    def __init__(self, config):
        # Required configuration
        self.service_key = config['service_key']

        # Optional
        self.client_url = config.get('client_url', '')
        self.key_format = config.get('key_format', DEFAULT_KEY_FORMAT)

        # Other
        self.incident_count = 0
        self.logger = logging.getLogger(__name__ + '.PagerDutyAlerter')

    def handle_alert(self, node, match):
        self.incident_count += 1
        key = self.key_format.format(
            count=self.incident_count
        )

        details = {
            'node': node,
            'match': match,
        }
        headers = {
            'Content-type': 'application/json',
        }
        payload = json.dumps({
            'event_type': 'trigger',
            'service_key': self.service_key,

            'incident_key': key,
            'description': 'A doorman alert was triggered',
            'client': 'Doorman',
            "client_url": self.client_url,
            'details': details,
        })
        r = requests.post(
            'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
            headers=headers,
            data=paylooad
        )
        if not r.ok:
            self.logger.warn('Could not trigger PagerDuty alert!')
