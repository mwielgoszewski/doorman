# -*- coding: utf-8 -*-
from flask_debugtoolbar import DebugToolbarExtension
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
migrate = Migrate()
debug_toolbar = DebugToolbarExtension()
