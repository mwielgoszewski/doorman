# -*- coding: utf-8 -*-
from collections import defaultdict

from celery import Celery
from flask_bcrypt import Bcrypt
from flask_debugtoolbar import DebugToolbarExtension
from flask_login import LoginManager
from flask_mail import Mail
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


class RuleManager(object):
    def __init__(self, app=None):
        self.loaded_rules = False
        self.network = None

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.app = app
        self.load_alerters()

        # Save this instance on the app, so we have a way to get at it.
        app.rule_manager = self

    def load_alerters(self):
        """ Load the alerter plugin(s) specified in the app config. """
        from importlib import import_module
        from doorman.plugins import AbstractAlerterPlugin

        alerters = self.app.config.get('DOORMAN_ALERTER_PLUGINS', {})

        self.alerters = {}
        with self.app.app_context():
            for name, (plugin, config) in alerters.items():
                package, classname = plugin.rsplit('.', 1)
                module = import_module(package)
                klass = getattr(module, classname, None)

                if klass is None:
                    raise ValueError('Could not find a class named "{0}" in package "{1}"'.format(classname, package))

                if not issubclass(klass, AbstractAlerterPlugin):
                    raise ValueError('{0} is not a subclass of AbstractAlerterPlugin'.format(name))

                self.alerters[name] = klass(config)

    def load_rules(self):
        """ Load rules from the database. """
        from doorman.rules import Network
        from doorman.models import Rule
        from sqlalchemy.exc import SQLAlchemyError

        self.rules = []
        with self.app.app_context():
            try:
                all_rules = list(Rule.query.all())
            except SQLAlchemyError:
                # Ignore DB errors when testing
                if self.app.config['TESTING']:
                    all_rules = []
                else:
                    raise

        self.network = Network()
        for rule in all_rules:
            # Verify the alerters
            for alerter in rule.alerters:
                if alerter not in self.alerters:
                    raise ValueError('No such alerter: "{0}"'.format(alerter))

            # Create the rule.
            self.network.parse_query(rule.conditions, alerters=rule.alerters, rule_name=rule.name)

    def handle_log_entry(self, entry, node):
        """ The actual entrypoint for handling input log entries. """
        # Need to lazy-load rules
        if not self.loaded_rules:
            self.load_rules()
            self.loaded_rules = True

        alerts = self.network.process(RuleInput(
            result_log=entry.to_dict(),
            node=node.to_dict(),
        ))

        for alerter, rule_name in alerts:
            self.alerters[alerter].handle_alert(node, result_log.to_dict())


def make_celery(app, celery):
    """ From http://flask.pocoo.org/docs/0.10/patterns/celery/ """
    # Register our custom serializer type before updating the configuration.
    from kombu.serialization import register
    from doorman.celery_serializer import djson_dumps, djson_loads

    register(
        'djson', djson_dumps, djson_loads,
        content_type='application/x-djson',
        content_encoding='utf-8'
    )

    # Actually update the config
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


bcrypt = Bcrypt()
db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
debug_toolbar = DebugToolbarExtension()
log_tee = LogTee()
login_manager = LoginManager()
metrics = Metrics()
rule_manager = RuleManager()
