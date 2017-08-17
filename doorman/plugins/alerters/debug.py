# -*- coding: utf-8 -*-
import logging

from flask import current_app

from .base import AbstractAlerterPlugin


class DebugAlerter(AbstractAlerterPlugin):
    LEVEL_MAPPINGS = {
        'debug': logging.DEBUG,
        'info': logging.INFO,
        'warn': logging.WARNING,
        'error': logging.ERROR,
        'critical': logging.CRITICAL,
    }

    def __init__(self, config):
        levelname = config.get('level', 'debug')
        self.level = self.LEVEL_MAPPINGS.get(levelname, logging.DEBUG)

    def handle_alert(self, node, match):
        # TODO(andrew-d): better message?
        current_app.logger.log(self.level, 'Triggered alert: {0!r}'.format(match))
