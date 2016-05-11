# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template

from doorman.api import blueprint as api
from doorman.assets import assets
from doorman.manage import blueprint as backend
from doorman.extensions import (
    db, debug_toolbar, log_tee, login_manager, make_celery, metrics,
    migrate, rule_manager
)
from doorman.settings import ProdConfig
from doorman.tasks import celery
from doorman.utils import get_node_health


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

    # if the DOORMAN_NO_MANAGER environment variable isn't set,
    # register the backend blueprint. This is useful when you want
    # to only deploy the api as a standalone service.

    if 'DOORMAN_NO_MANAGER' in os.environ:
        return

    app.register_blueprint(backend)


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    assets.init_app(app)
    debug_toolbar.init_app(app)
    log_tee.init_app(app)
    rule_manager.init_app(app)
    make_celery(app, celery)
    metrics.init_app(app)
    login_manager.init_app(app)


def register_loggers(app):
    if app.debug:
        return

    import logging
    from logging.handlers import WatchedFileHandler

    handler = WatchedFileHandler(app.config['DOORMAN_LOGGING_FILENAME'])
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


def register_auth_method(app):
    from doorman.users import views
    app.register_blueprint(views.blueprint)

    if app.config['DOORMAN_AUTH_METHOD'] is None:
        from doorman.users.mixins import NoAuthUserMixin
        login_manager.anonymous_user = NoAuthUserMixin
        return

    login_manager.login_view = 'users.login'
    login_manager.login_message_category = 'warning'

    if app.config['DOORMAN_AUTH_METHOD'] != 'doorman':
        login_manager.login_message = None
        login_manager.needs_refresh_message = None

        from doorman.users.oauth import OAuthLogin
        provider = OAuthLogin.get_provider(app.config['DOORMAN_AUTH_METHOD'])
        provider.init_app(app)
