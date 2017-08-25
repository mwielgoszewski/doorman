# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template

from doorman.api import blueprint as api
from doorman.assets import assets
from doorman.manage import blueprint as backend
from doorman.extensions import (
    bcrypt, csrf, db, debug_toolbar, ldap_manager, log_tee, login_manager,
    mail, make_celery, migrate, rule_manager, sentry
)
from doorman.settings import ProdConfig
from doorman.tasks import celery
from doorman.utils import get_node_health, pretty_field, pretty_operator


def create_app(config=ProdConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    app.config.from_envvar('DOORMAN_SETTINGS', silent=True)

    register_blueprints(app)
    register_errorhandlers(app)
    register_loggers(app)
    register_extensions(app)
    register_auth_method(app)
    register_filters(app)

    return app


def register_blueprints(app):
    app.register_blueprint(api)
    csrf.exempt(api)

    # if the DOORMAN_NO_MANAGER environment variable isn't set,
    # register the backend blueprint. This is useful when you want
    # to only deploy the api as a standalone service.

    if 'DOORMAN_NO_MANAGER' in os.environ:
        return

    app.register_blueprint(backend)


def register_extensions(app):
    bcrypt.init_app(app)
    csrf.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    assets.init_app(app)
    debug_toolbar.init_app(app)
    log_tee.init_app(app)
    rule_manager.init_app(app)
    mail.init_app(app)
    make_celery(app, celery)
    login_manager.init_app(app)
    sentry.init_app(app)
    if app.config['ENFORCE_SSL']:
        # Due to architecture of flask-sslify,
        # its constructor expects to be launched within app context
        # unless app is passed.
        # As a result, we cannot create sslify object in `extensions` module
        # without getting an error.
        from flask_sslify import SSLify
        SSLify(app)


def register_loggers(app):
    if app.debug:
        return

    import logging
    from logging.handlers import WatchedFileHandler
    import sys

    logfile = app.config['DOORMAN_LOGGING_FILENAME']
    if logfile == '-':
        handler = logging.StreamHandler(sys.stdout)
    else:
        handler = WatchedFileHandler(logfile)
    levelname = app.config['DOORMAN_LOGGING_LEVEL']
    if levelname in ('DEBUG', 'INFO', 'WARN', 'WARNING', 'ERROR', 'CRITICAL'):
        handler.setLevel(getattr(logging, levelname))
    formatter = logging.Formatter(app.config['DOORMAN_LOGGING_FORMAT'])
    handler.setFormatter(formatter)

    app.logger.addHandler(handler)


def register_errorhandlers(app):
    """Register error handlers."""
    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        if 'DOORMAN_NO_MANAGER' in os.environ:
            return '', 400
        return render_template('{0}.html'.format(error_code)), error_code

    for errcode in [401, 403, 404, 500]:
        app.errorhandler(errcode)(render_error)


def register_filters(app):
    app.jinja_env.filters['health'] = get_node_health
    app.jinja_env.filters['pretty_field'] = pretty_field
    app.jinja_env.filters['pretty_operator'] = pretty_operator


def register_auth_method(app):
    from doorman.users import views
    app.register_blueprint(views.blueprint)

    if app.config['DOORMAN_AUTH_METHOD'] is None:
        from doorman.users.mixins import NoAuthUserMixin
        login_manager.anonymous_user = NoAuthUserMixin
        return

    login_manager.login_view = 'users.login'
    login_manager.login_message_category = 'warning'

    if app.config['DOORMAN_AUTH_METHOD'] == 'ldap':
        ldap_manager.init_app(app)
        return

    # no other authentication methods left, falling back to OAuth

    if app.config['DOORMAN_AUTH_METHOD'] != 'doorman':
        login_manager.login_message = None
        login_manager.needs_refresh_message = None

        from doorman.users.oauth import OAuthLogin
        provider = OAuthLogin.get_provider(app.config['DOORMAN_AUTH_METHOD'])
        provider.init_app(app)
