# doorman

[![Build Status](https://travis-ci.org/mwielgoszewski/doorman.svg?branch=master)](https://travis-ci.org/mwielgoszewski/doorman)
[![Code Climate](https://codeclimate.com/github/mwielgoszewski/doorman/badges/gpa.svg)](https://codeclimate.com/github/mwielgoszewski/doorman)

Doorman is an osquery fleet manager that allows administrators to remotely manage the osquery configurations retrieved by nodes. Administrators can dynamically configure the set of packs, queries, and/or file integrity monitoring target paths using tags. Doorman takes advantage of osquery's TLS configuration, logger, and distributed read/write endpoints, to give administrators visibility across a fleet of devices with minimal overhead and intrusiveness.


# at a glance

Doorman makes extensive use of tags. A node's configuration is dependent on the tags it shares with packs, queries, and/or file paths. As tags are added and/or removed, a node's configuration will change.

For example, it's possible to assign a set of packs and queries a `baseline` tag. To ensure all nodes then receive this baseline configuration, you simply assign the `baseline` tag to the nodes you wish to include.

![nodes](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/nodes.png)


# state of the node

Click on any node to view its recent activity, original enrollment date, time of its last check-in, and the set of packs and queries that are configured for it. This view provides an "at-a-glance" view on the current state of a node.

![node](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/node.png)

![recent_activity](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/recent_activity.png)


# distributed queries

With Doorman, you can distribute ad-hoc queries to one, some, or all nodes. A distributed query's status in Doorman is tracked based on whether the node has picked up the query and/or returned its results.

![distributed_queries](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/distributed_queries.png)

![distributed_query](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/distributed_query.png)


# rules and alerts

If you're not acting on the information you collect, what's the point? Doorman allows fleet managers to configure custom rules to trigger alerts on specific events (for example, an unauthorized browser plugin is installed, or a removable USB storage device is inserted). Doorman allows building complex rule sets that can use arbitrary boolean logic and a variety of operators to test the results of a query.  For example:

![rule builder](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/rules.png)

Doorman allows supports alerting via the following methods:

* PagerDuty
* Email
* Sentry
* Log file (primarily for development)


# logging

Doorman is intended to be configured to receive results from nodes via the osquery tls logging plugin. Results are saved in a Postgres database for easy access to recent events. Doorman also supports development of custom plugins to handle event data, allowing Doorman to send data elsewhere, such as to a separate file, rsyslog, Elasticsearch, etc.


# osquery tls api

Doorman exposes the following [osquery tls endpoints](https://osquery.readthedocs.org/en/stable/deployment/remote/#remote-server-api):

method | url | osquery configuration cli flag
-------|-----|-------------------------------
POST   | /enroll | `--enroll_tls_endpoint`
POST   | /config | `--config_tls_endpoint`
POST   | /log | `--logger_tls_endpoint`
POST   | /distributed/read | `--distributed_tls_read_endpoint`
POST   | /distributed/write | `--distributed_tls_write_endpoint`

To reach the Doorman management interface, point your browser at [https://localhost:5000/manage/](https://localhost:5000/manage/) (or the server it's running on).

# authentication

Authenticating to Doorman can be handled several ways:

* `DOORMAN_AUTH_METHOD = None`
* `DOORMAN_AUTH_METHOD = 'doorman'`
* `DOORMAN_AUTH_METHOD = 'ldap'`
* `DOORMAN_AUTH_METHOD = 'google'`

`None` implies no authentication, resulting in an exposed manager web interface. If you deploy the api and web interface (the manager) separately, and the manager will only be accessible from a trusted network, this may be enough for you.

`doorman` utilizes username and password based authentication, managed by the backend database. Passwords are stored as bcrypt hashes with a work factor of 13 log_rounds. Doorman does not support user registration, or password reset capabilities from the web interface. This must be handled by the administrator using Doorman's [manage.py](https://github.com/mwielgoszewski/doorman/blob/master/manage.py) script.

`ldap` authentication relies on an LDAP server to authenticate users. See the [flask-ldap3-login](http://flask-ldap3-login.readthedocs.io/en/latest/configuration.html) documentation for the configuration values required by the plugin in order to successfully bind and authenticate to your LDAP server.

`google` uses OAuth 2.0 to authenticate with your Google credentials. To get started, you'll need to register a new web application client in the [Google API Console](https://console.developers.google.com/apis/credentials) and obtain a client_id and client_secret, along with authorize a callback URL. The following will need to be configured:

* `DOORMAN_OAUTH_CLIENT_ID = "client_id"`
* `DOORMAN_OAUTH_CLIENT_SECRET = "client_secret"`

Additionally, you should configure at least one of the following:

* `DOORMAN_OAUTH_GOOGLE_ALLOWED_DOMAINS`
* `DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS`

Both of the aforementioned keys accept a list argument of app domains or user email addresses that are authorized to authenticate to Doorman. **WARNING**: if these values are not configured, then anyone with a Google account will be able to authenticate to your instance of Doorman!

The callback URL by default is `https://SERVER_NAME/oauth2callback`. The `SERVER_NAME` is populated from the environment parameters passed from your upstream web proxy (i.e., nginx's [server_name](http://nginx.org/en/docs/http/server_names.html)).

# configuration

Doorman's [default configuration](https://github.com/mwielgoszewski/doorman/blob/master/doorman/settings.py) can be overridden by setting the `DOORMAN_SETTINGS` environment variable to a configuration file.

The following settings should be configured to get up and running:

Setting       | Description
--------------|------------
`SECRET_KEY`  |  Flask's [secret_key](http://flask.pocoo.org/docs/0.10/api/#flask.Flask.secret_key). This should be a cryptographically secure random value, unique to your environment. |
`SERVER_NAME` |  The name and port number of the server. See Flask's [Builtin Configuration Values](http://flask.pocoo.org/docs/0.10/config/#builtin-configuration-values) for more details.
`PREFERRED_URL_SCHEME` |  The URL scheme that should be used for URL generation if no URL scheme is available. This defaults to `https`.
`SQLALCHEMY_DATABASE_URI` |  The database URI that should be used for the connection. Example: <p><ul><li>`postgresql://localhost:5432/doorman`</li></ul></p> See the [Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.1/config/#configuration-keys) documentation for additional configuration settings.
`BROKER_URL`  |  The Celery [broker URL](http://docs.celeryproject.org/en/latest/configuration.html#broker-url). Default: `redis://localhost:6379/0`
`CELERY_RESULT_BACKEND`  |  The Celery [result backend URL](http://docs.celeryproject.org/en/latest/configuration.html#celery-result-backend). Default: `redis://localhost:6379/0`
`DOORMAN_ENROLL_SECRET`  |  A list of valid enrollment keys to use. See osquery TLS [remoting settings](https://osquery.readthedocs.io/en/stable/deployment/remote/) for more information. By default, this list is empty.
`DOORMAN_EXPECTS_UNIQUE_HOST_ID`  |  If osquery is deployed on endpoints to start with the `--host_identifier=uuid` cli flag, set this value to `True`. Default is `True`.
`DOORMAN_CHECKIN_INTERVAL`  |  Time (in seconds) nodes are expected to check-in for configurations or call the distributed read endpoint. Nodes that fail to check-in within this time will be highlighted in red on the main nodes page.
`DOORMAN_ENROLL_DEFAULT_TAGS`  |  A default set of tags to apply to newly enrolled nodes. See also `DOORMAN_ENROLL_SECRET_TAG_DELIMITER`.
`DOORMAN_ENROLL_SECRET_TAG_DELIMITER` | A delimiter to separate the enroll secret from tag values (up to maximum of 10 tags) the node should inherit upon enrollment. Default is `None`, i.e., a node will not inherit any tags when first enrolled. This provides a little more flexibility than `DOORMAN_ENROLL_DEFAULT_TAGS`, allowing individual nodes to inherit different tags based on environment, asset class, etc. In the osquery configuration, you would supply an enroll secret in the format: `--enroll-secret=secret:tag1:tag2:tag3`, assuming `:` is your tag delimiter.
`DOORMAN_CAPTURE_NODE_INFO` |  A list of tuples, containing a pair of osquery result column and label used to determine what information is captured about a node and presented on a node's information page. In order for this information to be captured, a node must execute a query which returns a result containing these columns. By default, the following information is captured: (i.e., `select * from system_info;`) <ul><li>`computer_name`</li><li>`hardware_vendor`</li><li>`hardware_model`</li><li>`hardware_serial`</li><li>`cpu_brand`</li><li>`cpu_physical_cores`</li><li>`physical_memory`</li></ul>
`DOORMAN_EXTRA_SCHEMA` | Doorman will validate queries against the expected set of tables from osquery.  If you use any custom extensions, you'll need to add the corresponding schema here so you can use them in queries.
`DOORMAN_MINIMUM_OSQUERY_LOG_LEVEL` |  The minimum osquery status log level to retain. Default is `0`, (all logs).
`DOORMAN_AUTH_METHOD`  |  The authentication backend used to authenticate Doorman users (not osquery endpoints). May be one of: <p><ul><li>`None`</li><li>`doorman`</li><li>`ldap`</li><li>`google`</li></ul></p> Note, google and doorman must be wrapped in quotes. Default is `None`. See the [authentication] (#authentication) section above for more information.
`DOORMAN_ALERTER_PLUGINS`  | The available `AbstractAlerterPlugin` implementations. This settings expects a dictionary of alerter names and tuples, where the first tuple item is the class name implemting `AbstractAlerterPlugin` to import, and the second value is a dictionary configuration passed to configure the Alerter class. Available Alerter plugins at time of this release are:<p><ul><li>`doorman.plugins.alerters.debug.DebugAlerter `</li><li> `doorman.plugins.alerters.emailer.EmailAlerter`</li><li> `doorman.plugins.alerters.pagerduty.PagerDutyAlerter`</li><li> `doorman.plugins.alerters.sentry.SentryAlerter`</li></ul></p>
`MAIL_DEFAULT_SENDER`  |  If using the `doorman.plugins.alerters.emailer.EmailAlerter` alerter above, specify the sender email address used by Doorman for the `FROM:` field.
`SENTRY_DSN` |  A Sentry project DSN (_Data Source Name_). See [Sentry docs](https://docs.getsentry.com/hosted/quickstart/#configure-the-dsn) for more information.



# up and running (development mode)

1. Install PostgreSQL (9.4 or later).

    a. Choose a directory to host the database. We'll use `~/doormandb` for these examples.
    b. Run `initdb ~/doormandb` to initialize the database.
    c. Run `pg_ctl -D ~/doormandb -l ~/doormandb/pg.log -o -p5432 start` to start a Postgres instance.

    If you reboot or otherwise, just run the pg_ctl ... start command above to resurrect the server.

1. Create the doorman database by running:

    ~~~
    createdb -h localhost -p 5432 doorman
    ~~~

1. Install and start Redis:

    ~~~
    redis-server /etc/redis/redis.conf
    ~~~

1. Install the required Python dependencies under [requirements/dev.txt](https://github.com/mwielgoszewski/doorman/blob/master/requirements/dev.txt).

1. Initialize the database by running:

    ~~~
    python manage.py db upgrade
    ~~~

1. Generate a self-signed certificate for testing, or obtain one from [Let's Encrypt](https://letsencrypt.org/).

    ~~~
    openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt
    ~~~

1. Install Javascript dependencies with `bower`:

    ~~~
    bower install
    ~~~

1. Start the doormany celery workers:

    ~~~
    celery worker -A doorman.worker:celery -l INFO
    ~~~

1. Start doorman by running:

    ~~~
    python manage.py ssl
    ~~~

1. Launch osquery with the [appropriate cli flags](https://osquery.readthedocs.org/en/stable/installation/cli-flags/#remote-settings-optional-for-configloggerdistributed-flags) to configure it to use the TLS enrollment, configuration, logging, and distributed read/write API's. **Below is an example osquery.flags to be used _only_ for testing**:

    ~~~
    --pidfile=/tmp/osquery.pid
    --host_identifier=uuid
    --database_path=/tmp/osquery.db
    --config_plugin=tls
    --config_tls_endpoint=/config
    --config_tls_refresh=10
    --config_tls_max_attempts=3
    --enroll_tls_endpoint=/enroll
    --enroll_secret_env=ENROLL_SECRET
    --disable_distributed=false
    --distributed_plugin=tls
    --distributed_interval=10
    --distributed_tls_max_attempts=3
    --distributed_tls_read_endpoint=/distributed/read
    --distributed_tls_write_endpoint=/distributed/write
    --logger_plugin=tls
    --logger_tls_endpoint=/log
    --logger_tls_period=5
    --tls_hostname=localhost:5000
    --tls_server_certs=./certificate.crt
    --log_result_events=false
    --pack_delimiter=/
    --utc
    --verbose
    --tls_dump=true
    ~~~

    And then invoke `osqueryd` as root by running:

    ~~~
    root@localhost# ENROLL_SECRET=secret osqueryd --flagfile osquery.flags
    ~~~

1. Point your browser at [https://localhost:5000/manage/](https://localhost:5000/manage/) to get to the main administration page (visiting the root index from a browser will return an HTTP 204 No Content response).


## running in Docker

First, build the Docker container:

```
$ docker build -t doorman .
```

Second, run the container, providing it with the credentials to access the
Postgres database:

```
$ docker run \
    -e DOORMAN_ENROLL_SECRET=foo \
    -e DOORMAN_SECRET_KEY=secret-key \
    -e POSTGRES_USER=doorman \
    -e POSTGRES_PASSWORD=pass \
    -e POSTGRES_ENV_POSTGRES_PORT=your-host-here \
    -p host-port:5000 \
    doorman
```

The container will contain everything needed for Doorman to function (i.e.
Redis, the Celery worker, and the API), managed by
[Runit](http://smarden.org/runit/).  You can edit the service configuration
under [`/docker`](https://github.com/mwielgoszewski/doorman/tree/master/docker)
to set additional options.

*Note: The `POSTGRES_ENV_POSTGRES_PORT` environment variable is the same
variable that is expected when using the `--link` argument to `docker run`, so
linking a Postgres container to the Doorman container should work without
passing that environment variable.*


## running on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you want to secure your instance with authentication then you will need to configure Google auth
(which is currently the only one supported with Heroku); see the next section.

## configuring Google auth

In order to configure authentication with Google, you need to do the following steps:

1. Open [Google developer's console](https://console.developers.google.com/) and create a new app,
   or choose an existing one;
2. Open `Credentials` section on the left menu;
3. Press `Create credentials` button and choose `OAuth client ID`;
4. Choose `Web application` for an application type;
5. Fill in app name, and enter `https://YOUR_DOMAIN/oauth2callback`
   (put in the domain you have installed the app on, and check scheme).
   For Heroku it will be `APPNAME.herokuapps.com` unless you use your own domain.
6. Press `Create` button; you will get `CLIENT_ID` and `CLIENT_SECRET` values to put in the config.
7. Go back to `Credentials` page and open `OAuth consent screen` tab. Fill in required fields.
8. Specify your Google account's primary email address in `*_ALLOWED_USERS` config option.
   If you want to specify several accounts, separate them with spaces.

## running tests

To execute tests, simply run `python manage.py test`.


## troubleshooting

Q. I started Doorman and it looks like it's running, but how do I actually use it?

> A. Point your browser at [https://localhost/manage/](https://localhost:5000/manage/) (or whatever domain name/port number it's hosted on).

Q. When loading /manage/ in the browser for first time, I receved some error about lessc not being installed.

> `lessc` should have been installed during the `bower install` step above. If it did not install, you can install it by running `npm install -g less` or installing less via your operating system distribution's package manager.

Q. I try to run the `python manage.py db upgrade` script, but I get an error along the lines of: *type "JSONB" does not exist*.

> Verify you have postgresql 9.4 (or later) installed. Doorman uses the postgresql JSONB column type for storing osquery result data.


# authors

Doorman is written and maintained by Marcin Wielgoszewski, with contributions from the following individuals and companies:

* [Andrew Dunham](https://github.com/andrew-d) (Stripe)
