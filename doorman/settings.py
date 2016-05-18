# -*- coding: utf-8 -*-
from binascii import b2a_hex
import datetime as dt
import os


class Config(object):
    SECRET_KEY = b2a_hex(os.urandom(20))

    DEBUG = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))

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
    DOORMAN_ENROLL_OVERRIDE = 'enroll_secret'
    DOORMAN_PACK_DELIMITER = '/'
    DOORMAN_ENROLL_DEFAULT_TAGS = [
    ]

    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

    CELERY_ACCEPT_CONTENT = ['djson', 'application/x-djson']
    CELERY_EVENT_SERIALIZER = 'djson'
    CELERY_RESULT_SERIALIZER = 'djson'
    CELERY_TASK_SERIALIZER = 'djson'

    GRAPHITE_ENABLED = False
    # GRAPHITE_HOST = "localhost"
    # GRAPHITE_PORT = 2003
    GRAPHITE_ALLOW = [
        'api.*',
    ]

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

    # You can specify a set of alerting plugins here.  These plugins can be
    # configured in rules to trigger alerts to a particular location.  Each
    # plugin consists of a full path to be imported, combined with some
    # configuration for the plugin.  Note that, since an alerter can be
    # configured multiple times with different names, we provide the
    # configuration per-name.
    DOORMAN_ALERTER_PLUGINS = {
        'debug': ('doorman.plugins.alerters.debug.DebugAlerter', {
            'level': 'error',
        }),

        #'pagerduty-security': ('doorman.plugins.alerters.pagerduty.PagerDutyAlerter', {
        #    # Required
        #    'access_key': 'foobar',
        #    'service_key': 'foobar',
        #
        #    # Optional
        #    'client_url': 'https://doorman.domain.com',
        #    'key_format': 'doorman-security-{count}',
        #}),
    }

    # Doorman uses the WatchedFileHandler in logging.handlers module.
    # It is the responsibility of the system to rotate these logs on
    # a periodic basis, as the file will grow indefinitely. See
    # https://docs.python.org/dev/library/logging.handlers.html#watchedfilehandler
    # for more information.
    DOORMAN_LOGGING_FILENAME = '/var/log/doorman/doorman.log'
    DOORMAN_LOGGING_FORMAT = '%(asctime)s -  %(name)s - %(levelname)s - %(thread)d - %(message)s'
    DOORMAN_LOGGING_LEVEL = 'WARNING'

    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_DURATION = dt.timedelta(days=30)
    REMEMBER_COOKIE_PATH = '/manage'
    REMEMBER_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True

    # see http://flask-login.readthedocs.io/en/latest/#session-protection
    # only applicable when DOORMAN_AUTH_METHOD = 'doorman'
    SESSION_PROTECTION = "strong"

    DOORMAN_AUTH_METHOD = None
    # DOORMAN_AUTH_METHOD = 'doorman'
    # DOORMAN_AUTH_METHOD = 'google'

    DOORMAN_OAUTH_GOOGLE_ALLOWED_DOMAINS = [
    ]

    DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS = [
    ]

    DOORMAN_OAUTH_CLIENT_ID = ''
    DOORMAN_OAUTH_CLIENT_SECRET = ''

    BCRYPT_LOG_ROUNDS = 13


class ProdConfig(Config):

    ENV = 'prod'
    DEBUG = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    SQLALCHEMY_DATABASE_URI = ''

    DOORMAN_ENROLL_SECRET = [

    ]

    BROKER_URL = ''
    CELERY_RESULT_BACKEND = ''

    GRAPHITE_ENABLED = True
    GRAPHITE_PREFIX = 'prod.doorman'
    GRAPHITE_HOST = ""
    GRAPHITE_PORT = 2003
    GRAPHITE_ALLOW = [
        'api.*',
    ]


class DevConfig(Config):
    """
    This class specifies a configuration that is suitable for running in
    development.  It should not be used for running in production.
    """
    ENV = 'dev'
    DEBUG = True
    DEBUG_TB_ENABLED = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    ASSETS_DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman'

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]

    GRAPHITE_PREFIX = 'dev.doorman'


class TestConfig(Config):
    """
    This class specifies a configuration that is used for our tests.
    """
    TESTING = True
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman_test'

    WTF_CSRF_ENABLED = False

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]
    DOORMAN_UNIQUE_HOST_ID = False

    GRAPHITE_ENABLED = False

    DOORMAN_AUTH_METHOD = None
