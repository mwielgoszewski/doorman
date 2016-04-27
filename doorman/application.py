# -*- coding: utf-8 -*-
from flask import Flask

from doorman.api import blueprint as api
from doorman.assets import assets
from doorman.views import blueprint as backend
from doorman.extensions import db, migrate, debug_toolbar, log_tee
from doorman.models import Pack, Query
from doorman.settings import DevConfig
from doorman.utils import get_node_health


def create_app(config=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config)

    register_blueprints(app)
    register_extensions(app)
    register_filters(app)
    return app


def register_blueprints(app):
    app.register_blueprint(api)
    app.register_blueprint(backend)


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    assets.init_app(app)
    debug_toolbar.init_app(app)
    log_tee.init_app(app)

def register_filters(app):
    app.jinja_env.filters['health'] = get_node_health
