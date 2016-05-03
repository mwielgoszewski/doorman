# -*- coding: utf-8 -*-
from binascii import b2a_hex
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
    DOORMAN_OSQUERY_STATUS_LOG_LEVEL = 0
    DOORMAN_ENROLL_OVERRIDE = 'enroll_secret'
    DOORMAN_PACK_DELIMITER = '/'

    CELERY_ACCEPT_CONTENT = ['djson']
    CELERY_EVENT_SERIALIZER = 'djson'
    CELERY_RESULT_SERIALIZER = 'djson'
    CELERY_TASK_SERIALIZER = 'djson'

    GRAPHITE_ENABLED = False
    GRAPHITE_PREFIX = 'dev.doorman'
    GRAPHITE_ALLOW = [
        'api.*',
        # 'manage-*',
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


class DevConfig(Config):
    """
    This class specifies a configuration that is suitable for running in
    development.  It should not be used for running in production.
    """
    ENV = 'dev'
    DEBUG = True
    DEBUG_TB_ENABLED = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman'

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]


class TestConfig(Config):
    """
    This class specifies a configuration that is used for our tests.
    """
    ENV = 'test'
    TESTING = True
    DEBUG = True

    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost:5432/doorman_test'

    WTF_CSRF_ENABLED = False

    DOORMAN_ENROLL_SECRET = [
        'secret',
    ]
    DOORMAN_UNIQUE_HOST_ID = False
