from importlib import import_module

from flask import current_app
from flask import _app_ctx_stack as stack


class LogPluginsExtension(object):
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        plugin_names = app.config.setdefault('DOORMAN_LOG_PLUGINS', [])

        self.plugins = []
        for name in plugin_names:
            mod = import_module('doorman.plugins.logs.{0}'.format(name))
            self.plugins.append(mod.Plugin(app.config))

    def handle_status(self, log):
        for plugin in self.plugins:
            plugin.handle_status(log)

    def handle_result(self, log):
        for plugin in self.plugins:
            plugin.handle_result(log)
