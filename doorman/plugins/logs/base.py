from abc import ABCMeta, abstractmethod, abstractproperty

from doorman.compat import with_metaclass


class AbstractLogsPlugin(with_metaclass(ABCMeta)):
    @abstractproperty
    def name(self):
        pass

    @abstractmethod
    def handle_status(self, log):
        pass

    @abstractmethod
    def handle_result(self, log):
        pass
