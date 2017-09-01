# -*- coding: utf-8 -*-
from binascii import b2a_hex
import datetime as dt
import os


class Config(object):
    SECRET_KEY = b2a_hex(os.urandom(20))

    # Set the following to ensure Celery workers can construct an
    # external URL via `url_for`.
    # SERVER_NAME = "doorman.domain.com"
    PREFERRED_URL_SCHEME = "https"

    # PREFERRED_URL_SCHEME will not work without SERVER_NAME configured,
    # so we need to use SSLify extension for that.
    # By default it is enabled for all production configs.
    ENFORCE_SSL = False

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
    DOORMAN_CHECKIN_INTERVAL = dt.timedelta(seconds=3600)
    DOORMAN_ENROLL_OVERRIDE = 'enroll_secret'
    DOORMAN_PACK_DELIMITER = '/'
    DOORMAN_MINIMUM_OSQUERY_LOG_LEVEL = 0

    DOORMAN_ENROLL_SECRET_TAG_DELIMITER = None
    DOORMAN_ENROLL_DEFAULT_TAGS = [
    ]

    DOORMAN_CAPTURE_NODE_INFO = [
        ('computer_name', 'name'),
        ('hardware_vendor', 'make'),
        ('hardware_model', 'model'),
        ('hardware_serial', 'serial'),
        ('cpu_brand', 'cpu'),
        ('cpu_physical_cores', 'cpu cores'),
        ('physical_memory', 'memory'),
    ]

    # Doorman will validate queries against the expected set of tables from
    # osquery.  If you use any custom extensions, you'll need to add the
    # corresponding schema here so you can use them in queries.
    DOORMAN_EXTRA_SCHEMA = [
        #'CREATE TABLE example_extension_table(thing1 INTEGER, thing2 TEXT);',
    ]

    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

    CELERY_ACCEPT_CONTENT = ['djson', 'application/x-djson']
    CELERY_EVENT_SERIALIZER = 'djson'
    CELERY_RESULT_SERIALIZER = 'djson'
    CELERY_TASK_SERIALIZER = 'djson'
    CELERYBEAT_SCHEDULE = {
        'alert-when-node-goes-offline': {
            'task': 'doorman.tasks.alert_when_node_goes_offline',
            'schedule': 86400,
        },
    }

    # You can specify a set of custom logger plugins here.  These plugins will
    # be called for every status or result log that is received, and can
    # do what they wish with them.
    DOORMAN_LOG_PLUGINS = [
        # 'doorman.plugins.logs.file.LogPlugin',
        # 'doorman.plugins.logs.logstash.LogstashPlugin',
    ]

    # These are the configuration variables for the example logger plugin given
    # above.  Uncomment these to start logging results or status logs to the
    # given file.
    # DOORMAN_LOG_FILE_PLUGIN_JSON_LOG = '/tmp/osquery.log'     # Default: do not log status/results to json log
    # DOORMAN_LOG_FILE_PLUGIN_STATUS_LOG = '/tmp/status.log'     # Default: do not log status logs
    # DOORMAN_LOG_FILE_PLUGIN_RESULT_LOG = '/tmp/result.log'     # Default: do not log results
    # DOORMAN_LOG_FILE_PLUGIN_APPEND = True                      # Default: True

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

        # 'pagerduty-security': ('doorman.plugins.alerters.pagerduty.PagerDutyAlerter', {
        #     # Required
        #     'service_key': 'foobar',

        #     # Optional
        #     'client_url': 'https://doorman.domain.com',
        #     'key_format': 'doorman-security-{count}',
        # }),

        # 'email': ('doorman.plugins.alerters.emailer.EmailAlerter', {
        #     # Required
        #     'recipients': [
        #         # 'security@example.com',
        #     ],

        #     # Optional, see doorman/plugins/alerters/emailer.py for templates
        #     'subject_prefix': '[Doorman]',
        #     'subject_template': '',
        #     'message_template': '',

        # }),

        # 'sentry': ('doorman.plugins.alerters.sentry.SentryAlerter', {
        #     'dsn': 'https://<key>:<secret>@app.getsentry.com/<project>',
        # }),

        # 'slack': ('doorman.plugins.alerters.slack.SlackAlerter', {
        #     # Required, create webhook here: https://my.slack.com/services/new/incoming-webhook/
        #     'slack_webhook' : 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',

        #     # Optional
        #     'printColumns': False,
        #     'color': '#36a64f',
        # })
    }

    # MAIL_SERVER = 'localhost'
    # MAIL_PORT = 25
    # MAIL_USE_TLS = False
    # MAIL_USE_SSL = False
    # MAIL_USERNAME = None
    # MAIL_PASSWORD = None
    MAIL_DEFAULT_SENDER = 'doorman@localhost'

    # Doorman uses the WatchedFileHandler in logging.handlers module.
    # It is the responsibility of the system to rotate these logs on
    # a periodic basis, as the file will grow indefinitely. See
    # https://docs.python.org/dev/library/logging.handlers.html#watchedfilehandler
    # for more information.
    # Alternatively, you can set filename to '-' to log to stdout.
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

    BCRYPT_LOG_ROUNDS = 13

    DOORMAN_AUTH_METHOD = None
    # DOORMAN_AUTH_METHOD = 'doorman'
    # DOORMAN_AUTH_METHOD = 'google'
    # DOORMAN_AUTH_METHOD = 'ldap'

    DOORMAN_OAUTH_GOOGLE_ALLOWED_DOMAINS = [
    ]

    DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS = [
    ]

    DOORMAN_OAUTH_CLIENT_ID = ''
    DOORMAN_OAUTH_CLIENT_SECRET = ''

    # When using DOORMAN_AUTH_METHOD = 'ldap', see
    # http://flask-ldap3-login.readthedocs.io/en/latest/configuration.html#core
    # Note: not all configuration options are documented at the link
    # provided above. A complete list of options can be groked by
    # reviewing the the flask-ldap3-login code.

    # LDAP_HOST = None
    # LDAP_PORT = 636
    # LDAP_USE_SSL = True
    # LDAP_BASE_DN = 'dc=example,dc=org'
    # LDAP_USER_DN = 'ou=People'
    # LDAP_GROUP_DN = ''
    # LDAP_USER_OBJECT_FILTER = '(objectClass=inetOrgPerson)'
    # LDAP_USER_LOGIN_ATTR = 'uid'
    # LDAP_USER_RDN_ATTR = 'uid'
    # LDAP_GROUP_SEARCH_SCOPE = 'SEARCH_SCOPE_WHOLE_SUBTREE'
    # LDAP_GROUP_OBJECT_FILTER = '(cn=*)(objectClass=groupOfUniqueNames)'
    # LDAP_GROUP_MEMBERS_ATTR = 'uniquemember'
    # LDAP_GET_GROUP_ATTRIBUTES = ['cn']
    # LDAP_OPT_X_TLS_CACERTFILE = None
    # LDAP_OPT_X_TLS_CERTIFICATE_FILE = None
    # LDAP_OPT_X_TLS_PRIVATE_KEY_FILE = None
    # LDAP_OPT_X_TLS_REQUIRE_CERT = 2  # ssl.CERT_REQUIRED
    # LDAP_OPT_X_TLS_USE_VERSION = 3  # ssl.PROTOCOL_TLSv1
    # LDAP_OPT_X_TLS_VALID_NAMES = []

    # To enable Sentry reporting, configure the following keys
    # https://docs.getsentry.com/hosted/clients/python/integrations/flask/
    # SENTRY_DSN = 'https://<key>:<secret>@app.getsentry.com/<project>'
    # SENTRY_INCLUDE_PATHS = ['doorman']
    # SENTRY_USER_ATTRS = ['username', 'first_name', 'last_name', 'email']
    #
    # https://docs.getsentry.com/hosted/clients/python/advanced/#sanitizing-data
    # SENTRY_PROCESSORS = [
    #     'raven.processors.SanitizePasswordsProcessor',
    # ]
    # RAVEN_IGNORE_EXCEPTIONS = []


class ProdConfig(Config):

    ENV = 'prod'
    DEBUG = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    ENFORCE_SSL = True

    SQLALCHEMY_DATABASE_URI = ''

    DOORMAN_ENROLL_SECRET = [

    ]
    DOORMAN_MINIMUM_OSQUERY_LOG_LEVEL = 1

    BROKER_URL = ''
    CELERY_RESULT_BACKEND = ''


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
    DOORMAN_EXPECTS_UNIQUE_HOST_ID = False

    DOORMAN_AUTH_METHOD = None


if os.environ.get('DYNO'):
    # we don't want to even define this class elsewhere,
    # because its definition depends on Heroku-specific environment variables
    class HerokuConfig(ProdConfig):
        """
        Environment variables accessed here are provided by Heroku.
        REDIS_URL and DATABASE_URL are defined by addons,
        while others should be created using `heroku config`.
        They are also declared in `app.json`, so they will be created
        when deploying using `Deploy to Heroku` button.
        """
        ENV = 'heroku'

        DOORMAN_LOGGING_FILENAME = '-'  # handled specially - stdout

        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
        BROKER_URL = os.environ['REDIS_URL']
        CELERY_RESULT_BACKEND = os.environ['REDIS_URL']

        try:
            SECRET_KEY = os.environ['SECRET_KEY']
        except KeyError:
            pass  # leave default random-filled key
        # several values can be specified as a space-separated string
        DOORMAN_ENROLL_SECRET = os.environ['ENROLL_SECRET'].split()

        DOORMAN_AUTH_METHOD = "google" if os.environ.get('OAUTH_CLIENT_ID') else None
        DOORMAN_OAUTH_CLIENT_ID = os.environ.get('OAUTH_CLIENT_ID')
        DOORMAN_OAUTH_CLIENT_SECRET = os.environ.get('OAUTH_CLIENT_SECRET')
        DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS = os.environ.get('OAUTH_ALLOWED_USERS', '').split()

        # mail config
        MAIL_SERVER = os.environ.get('MAIL_SERVER')
        MAIL_PORT = os.environ.get('MAIL_PORT')
        MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
        MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
        MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
        MAIL_USE_SSL = True

        DOORMAN_ALERTER_PLUGINS = {
            'debug': ('doorman.plugins.alerters.debug.DebugAlerter', {
                'level': 'error',
            }),

            'email': ('doorman.plugins.alerters.emailer.EmailAlerter', {
                'recipients': [
                    email.strip() for email in
                    os.environ.get('MAIL_RECIPIENTS', '').split(';')
                ],
            }),

        }


# choose proper configuration based on environment -
# this is both for manage.py and for worker.py
if os.environ.get('DOORMAN_ENV') == 'prod':
    CurrentConfig = ProdConfig
elif os.environ.get('DOORMAN_ENV') == 'test':
    CurrentConfig = TestConfig
elif os.environ.get('DYNO'):
    CurrentConfig = HerokuConfig
else:
    CurrentConfig = DevConfig
