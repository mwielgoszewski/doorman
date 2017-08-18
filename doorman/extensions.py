# -*- coding: utf-8 -*-
from flask_bcrypt import Bcrypt
from flask_debugtoolbar import DebugToolbarExtension
from flask_ldap3_login import LDAP3LoginManager
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect
from raven import Client
from raven.contrib.celery import register_signal, register_logger_signal
from raven.contrib.flask import Sentry


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
                raise ValueError('{0} is not a subclass of AbstractLogsPlugin'.format(klass))

            self.plugins.append(klass(app.config))

    def handle_status(self, data, **kwargs):
        for plugin in self.plugins:
            plugin.handle_status(data, **kwargs)

    def handle_result(self, data, **kwargs):
        for plugin in self.plugins:
            plugin.handle_result(data, **kwargs)


class RuleManager(object):
    def __init__(self, app=None):
        self.network = None
        self.last_update = None

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
        for name, (plugin, config) in alerters.items():
            package, classname = plugin.rsplit('.', 1)
            module = import_module(package)
            klass = getattr(module, classname, None)

            if klass is None:
                raise ValueError('Could not find a class named "{0}" in package "{1}"'.format(classname, package))

            if not issubclass(klass, AbstractAlerterPlugin):
                raise ValueError('{0} is not a subclass of AbstractAlerterPlugin'.format(name))

            self.alerters[name] = klass(config)

    def should_reload_rules(self):
        """ Checks if we need to reload the set of rules. """
        from doorman.models import Rule

        if self.last_update is None:
            return True

        newest_rule = Rule.query.order_by(Rule.updated_at.desc()).limit(1).first()
        if newest_rule and self.last_update < newest_rule.updated_at:
            return True

        return False

    def load_rules(self):
        """ Load rules from the database. """
        from doorman.rules import Network
        from doorman.models import Rule

        if not self.should_reload_rules():
            return

        all_rules = list(Rule.query.all())

        self.network = Network()

        if not all_rules:
            return

        for rule in all_rules:
            # Verify the alerters
            for alerter in rule.alerters:
                if alerter not in self.alerters:
                    raise ValueError('No such alerter: "{0}"'.format(alerter))

            # Create the rule.
            self.network.parse_query(rule.conditions, alerters=rule.alerters, rule_id=rule.id)

        # Save the last updated date
        # Note: we do this here, and not in should_reload_rules, because it's
        # possible that we've reloaded a rule in between the two functions, and
        # thus we accidentally don't reload when we should.
        self.last_update = max(r.updated_at for r in all_rules)

    def handle_log_entry(self, entry, node):
        """ The actual entrypoint for handling input log entries. """
        from doorman.models import Rule
        from doorman.rules import RuleMatch
        from doorman.utils import extract_results

        self.load_rules()

        to_trigger = []
        for name, action, columns, timestamp in extract_results(entry):
            result = {
                'name': name,
                'action': action,
                'timestamp': timestamp,
                'columns': columns,
            }
            alerts = self.network.process(result, node)
            if len(alerts) == 0:
                continue

            # Alerts is a set of (alerter name, rule id) tuples.  We convert
            # these into RuleMatch instances, which is what our alerters are
            # actually expecting.
            for alerter, rule_id in alerts:
                rule = Rule.get_by_id(rule_id)

                to_trigger.append((alerter, RuleMatch(
                    rule=rule,
                    result=result,
                    node=node
                )))

        # Now that we've collected all results, start triggering them.
        for alerter, match in to_trigger:
            self.alerters[alerter].handle_alert(node, match)


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

    # Register Sentry client
    if 'SENTRY_DSN' in app.config and app.config['SENTRY_DSN']:
        client = Client(app.config['SENTRY_DSN'])
        # register a custom filter to filter out duplicate logs
        register_logger_signal(client)
        # hook into the Celery error handler
        register_signal(client)

    TaskBase = celery.Task

    class ContextTask(TaskBase):

        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


bcrypt = Bcrypt()
csrf = CsrfProtect()
db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
debug_toolbar = DebugToolbarExtension()
log_tee = LogTee()
ldap_manager = LDAP3LoginManager()
login_manager = LoginManager()
rule_manager = RuleManager()
sentry = Sentry()
