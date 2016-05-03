# -*- coding: utf-8 -*-
from celery import Celery
from flask_debugtoolbar import DebugToolbarExtension
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


class LogTee(object):
    def __init__(self, app=None):
        self.app = app
        self.plugins = []

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        from importlib import import_module
        from doorman.plugins import AbstractLogsPlugin

        plugins = app.config.setdefault('DOORMAN_LOG_PLUGINS', [])

        for plugin in plugins:
            package, classname = plugin.rsplit('.', 1)
            module = import_module(package)
            klass = getattr(module, classname, None)

            if klass is None:
                raise ValueError('Could not find a class named "{0}" in package "{1}"'.format(classname, package))

            if not issubclass(klass, AbstractLogsPlugin):
                raise ValueError('{0} is not a subclass of AbstractLogsPlugin'.format(name))

            self.plugins.append(klass(app.config))

    def handle_status(self, data, **kwargs):
        for plugin in self.plugins:
            plugin.handle_status(data, **kwargs)

    def handle_result(self, data, **kwargs):
        for plugin in self.plugins:
            plugin.handle_result(data, **kwargs)


def make_celery(app, celery):
    """ From http://flask.pocoo.org/docs/0.10/patterns/celery/ """
    celery.config_from_object(app.config)

    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


class Metrics(object):
    def __init__(self, app=None):
        self.app = app
        self.config = {}
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.config = app.config

        enabled = self.config.setdefault("GRAPHITE_ENABLED", False)
        self.app = app

        if not enabled:
            return

        from greplin import scales
        from greplin.scales.graphite import GraphitePeriodicPusher
        from greplin.scales.meter import MeterStat

        host = self.config.setdefault("GRAPHITE_HOST", "localhost")
        port = self.config.setdefault("GRAPHITE_PORT", 2003)
        prefix = self.config.setdefault("GRAPHITE_PREFIX", "doorman")
        period = self.config.setdefault("GRAPHITE_REPORTING_INTERVAL", 60)

        app.metrics = {}
        for rule in app.url_map.iter_rules():
            app.metrics[rule.endpoint] = scales.collection(
                rule.endpoint,
                MeterStat('count'),
                scales.PmfStat('latency'),
            )

        app.graphite = GraphitePeriodicPusher(
            host, port, period=period, prefix=prefix,
        )

        for rule in self.config.setdefault("GRAPHITE_ALLOW", ['*']):
            app.graphite.allow(rule)

        app.graphite.start()
        return


db = SQLAlchemy()
migrate = Migrate()
debug_toolbar = DebugToolbarExtension()
log_tee = LogTee()
metrics = Metrics()
