from importlib import import_module

from flask import current_app
from flask import _app_ctx_stack as stack

from doorman.plugins.logs.base import AbstractLogsPlugin


class LogPluginsExtension(object):
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        plugin_names = app.config.setdefault('DOORMAN_LOG_PLUGINS', [])

        self.plugins = []
        for name in plugin_names:
            package, classname = name.rsplit('.', 1)
            mod = import_module(package)

            klass = getattr(mod, classname, None)
            if klass is None:
                raise ValueError('Could not find a class named "{0}" in package "{1}"'.format(classname, package))
            if not issubclass(klass, AbstractLogsPlugin):
                raise ValueError('{0} is not a subclass of AbstractLogsPlugin'.format(name))
            self.plugins.append(klass(app.config))

    def handle_status(self, log):
        for plugin in self.plugins:
            plugin.handle_status(log)

    def handle_result(self, log):
        for plugin in self.plugins:
            plugin.handle_result(log)
