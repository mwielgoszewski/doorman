# -*- coding: utf-8 -*-
import json
import logging

import requests

from doorman.utils import DateTimeEncoder
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

        description = match.rule.template.safe_substitute(
            match.result['columns'],
            **node
        ).rstrip()

        description = ":".join(description.split('\r\n\r\n', 1))

        details = {
            'node': node,
            'rule_name': match.rule.name,
            'rule_description': match.rule.description,
            'action': match.result['action'],
            'match': match.result['columns'],
        }

        headers = {
            'Content-type': 'application/json',
        }

        payload = json.dumps({
            'event_type': 'trigger',
            'service_key': self.service_key,
            'incident_key': key,
            'description': description,
            'client': 'Doorman',
            "client_url": self.client_url,
            'details': details,
        }, cls=DateTimeEncoder)

        resp = requests.post(
            'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
            headers=headers,
            data=payload
        )

        if not resp.ok:
            self.logger.warn('Could not trigger PagerDuty alert!')

        self.logger.debug('Response from PagerDuty: %r', resp.content)
