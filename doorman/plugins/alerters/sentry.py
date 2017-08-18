# -*- coding: utf-8 -*-
import string

from flask import current_app
from raven import Client

from .base import AbstractAlerterPlugin


class SentryAlerter(AbstractAlerterPlugin):
    def __init__(self, config):
        self.client = Client(
            config['dsn'],
            auto_log_stacks=False,
            enable_breadcrumbs=False,
        )
        self.config = config

    def handle_alert(self, node, match):
        name = match.result['name']

        if name.startswith('pack'):
            try:
                _, pack, query = name.split(current_app.config['DOORMAN_PACK_DELIMITER'])
            except ValueError:
                pack, query = None, name
        else:
            pack, query = None, name

        message = match.rule.template.safe_substitute(
            match.result['columns'],
            **node
        )

        self.client.captureMessage(
            message=message.rstrip(),
            data={
                'logger': current_app.name
            },
            extra={
                'action': match.result['action'],
                'columns': match.result['columns'],
                'timestamp': match.result['timestamp'].strftime('%Y-%m-%d %H:%M:%S'),
                'node': node,
            },
            tags={
                'host_identifier': node.get('host_identifier'),
                'pack': pack,
                'query': query,
            },
        )
