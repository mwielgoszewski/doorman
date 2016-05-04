# -*- coding: utf-8 -*-
from abc import ABCMeta, abstractmethod

from doorman.compat import with_metaclass


class AbstractAlerterPlugin(with_metaclass(ABCMeta)):
    """
    AbstractAlerterPlugin is the base class for all alerters in Doorman. It
    defines the interface that an alerter should implement in order to support
    sending an alert.
    """
    @abstractmethod
    def handle_alert(self, node, match):
        raise NotImplementedError()
