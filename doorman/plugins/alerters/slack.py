# -*- coding: utf-8 -*-
import json
import logging
import requests

from .base import AbstractAlerterPlugin

DEFAULT_COLOR = '#36a64f'

class SlackAlerter(AbstractAlerterPlugin):
    def __init__(self, config):
        # Required configuration
        self.slack_webhook = config['slack_webhook']

        # Optional
        self.printColumns = config.get('printColumns', False)
        self.color = config.get('color', DEFAULT_COLOR)

        # Other
        self.logger = logging.getLogger(__name__ + '.SlackAlerter')

    def handle_alert(self, node, match):
        fields = [
            {'title' : 'Node', 'value' : node['display_name']},
            {'title' : 'Description', 'value' : match.rule.description},
            {'title' : 'Action', 'value' : match.result['action']},
        ]

        if self.printColumns:
            columns = []
            for key in match.result['columns']:
                columns.append({"title" : key, 'value' : match.result['columns'][key]})
            fields.extend(columns)

        attachments = [{
            'pretext' : 'Doorman Alert: *%s*' % match.rule.name,
            'fallback' : 'Doorman Alert: %s' % match.rule.name,
            'color' : self.color,
            'fields': fields,
            'mrkdwn_in':['text', 'pretext']
        }]

        headers = {
            'Content-type': 'application/json',
        }

        payload = json.dumps({'attachments': attachments})

        resp = requests.post(
            self.slack_webhook,
            headers=headers,
            data=payload
        )

        if not resp.ok:
            self.logger.warn('Could not trigger Slack alert!')

        self.logger.debug('Response from Slack: %r', resp.content)
