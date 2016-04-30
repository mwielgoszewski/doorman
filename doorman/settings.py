# -*- coding: utf-8 -*-
import os


class Config(object):
    SECRET_KEY = 'secret'

    DEBUG = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))

    DB_NAME = 'osquery.db'
    DB_PATH = None
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # When osquery is configured to start with the command-line flag
    # --host_identifier=uuid, set this value to True. This will allow
    # nodes requesting to enroll / re-enroll to reuse the same node_key.
    #
    # When set to False, nodes that request the /enroll endpoint subsequently
    # will have a new node_key generated, and a different corresponding
    # node record in the database. This will result in stale node entries.
    DOORMAN_EXPECTS_UNIQUE_HOST_ID = True
    DOORMAN_CHECKIN_INTERVAL = 3600
    DOORMAN_OSQUERY_STATUS_LOG_LEVEL = 0
    DOORMAN_ENROLL_OVERRIDE = 'enroll_secret'
    DOORMAN_PACK_DELIMITER = '/'

    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

    # You can specify a set of custom logger plugins here.  These plugins will
    # be called for every status or result log that is received, and can
    # do what they wish with them.
    #DOORMAN_LOG_PLUGINS = ['doorman.plugins.logs.file.LogPlugin']

    # These are the configuration variables for the example logger plugin given
    # above.  Uncomment these to start logging results or status logs to the
    # given file.
    #DOORMAN_LOG_FILE_PLUGIN_STATUS_LOG = '/tmp/status.log'     # Default: do not log status logs
    #DOORMAN_LOG_FILE_PLUGIN_RESULT_LOG = '/tmp/result.log'     # Default: do not log results
    #DOORMAN_LOG_FILE_PLUGIN_APPEND = True                      # Default: True


class DevConfig(Config):
    ENV = 'dev'
    DEBUG = True
    DEBUG_TB_ENABLED = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    DB_NAME = 'dev.db'
    # Put the db file in project root
    DB_PATH = os.path.join(Config.PROJECT_ROOT, DB_NAME)
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///{0}'.format(DB_PATH)
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman'

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]


class TestConfig(Config):
    TESTING = True
    DEBUG = True
    # SQLALCHEMY_DATABASE_URI = 'sqlite://'
    # SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:6432/doorman_test'
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman_test'
    WTF_CSRF_ENABLED = False

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]
    DOORMAN_UNIQUE_HOST_ID = False
