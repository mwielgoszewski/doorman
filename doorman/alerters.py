# -*- coding: utf-8 -*-
import logging

from flask import current_app


class BaseAlerter(object):
    """
    BaseAlerter is the base class for all alerters in Doorman. It defines the
    interface that an alerter should implement in order to support sending an
    alert.
    """
    def __init__(self, config):
        self.config = config

    def handle_alert(self, node, match):
        raise NotImplementedError()

    @staticmethod
    def from_model(model):
        """
        Create an Alerter from a model.
        """
        return BaseAlerter.from_config(model.type, model.config)

    @staticmethod
    def from_config(type, config):
        """
        Create an Alerter from a type and optional configuration.
        """
        klass = ALERTER_MAPPINGS.get(type)
        if klass is None:
            # Warn instead of raising?  We shouldn't get here, since it
            # shouldn't be possible to have saved a rule with an invalid type.
            raise ValueError('Invalid alerter type: {0}'.format(type))

        # TODO: should validate required fields of config
        return klass(config)


class DebugAlerter(BaseAlerter):
    LEVEL_MAPPINGS = {
        'debug': logging.DEBUG,
        'info': logging.INFO,
        'warn': logging.WARNING,
        'error': logging.ERROR,
        'critical': logging.CRITICAL,
    }

    def __init__(self, config):
        super(DebugAlerter, self).__init__(config)
        levelname = config.get('level', 'debug')
        self.level = self.LEVEL_MAPPINGS.get(levelname, logging.DEBUG)

    def handle_alert(self, node, match):
        # TODO(andrew-d): better message?
        current_app.logger.log(self.level, 'Triggered alert: {0!r}'.format(match))


# Note: should be at the end of the file
# TODO(andrew-d): Should we make this a package-import style configuration?  We
# want users to be able to write their own alerters, if necessary (similar to
# the log plugins).
ALERTER_MAPPINGS = {
    'debug': DebugAlerter,
}
ALERTER_TYPES = list(ALERTER_MAPPINGS.keys())
