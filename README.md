# doorman

[![Build Status](https://travis-ci.org/mwielgoszewski/doorman.svg?branch=master)](https://travis-ci.org/mwielgoszewski/doorman)

Doorman is an osquery fleet manager that allows administrators to remotely manage the osquery configurations retrieved by nodes. Administrators can dynamically configure the set of packs, queries, and/or file integrity monitoring target paths using tags. Doorman takes advantage of osquery's TLS configuration, logger, and distributed read/write endpoints, to give administrators visibility across a fleet of devices with minimal overhead and intrusiveness.

# at a glance

Doorman makes extensive use of tags. A node's configuration is dependent on the tags it shares with packs, queries, and/or file paths. As tags are added and/or removed, a node's configuration will change.

For example, it's possible to assign a set of packs and queries a `baseline` tag. To ensure all nodes then receive this baseline configuration, you simply assign the `baseline` tag to the nodes you wish to include.

![nodes](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/nodes.png)

# state of the node

Click on any node to view its recent activity, original enrollment date, time of its last check-in, and the set of packs and queries that are configured for it. This view provides an "at-a-glance" view on the current state of a node.

![nodes](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/node.png)


# caveats

Doorman is currently in alpha status. For one, it lacks the required authentication and authorization checks one would expect from a production, release-ready project. Second, there's still quite a few details to work out. For example, some features I think are needed:

* authentication / authorization model
* validation of query sql
* enrollment workflow for new nodes, import existing nodes
* learn about nodes based on result logs
* dashboards!!
* API client certificate authentication
* a built-in query profiler?


# osquery tls api

Doorman exposes the following [osquery tls endpoints](https://osquery.readthedocs.org/en/stable/deployment/remote/#remote-server-api):

method | url | osquery configuration cli flag
-------|-----|-------------------------------
POST   | /enroll | `--enroll_tls_endpoint`
POST   | /config | `--config_tls_endpoint`
POST   | /log | `--logger_tls_endpoint`
POST   | /distributed/read | `--distributed_tls_read_endpoint`
POST   | /distributed/write | `--distributed_tls_write_endpoint`


# up and running (development mode)

1. Install PostgreSQL.
    a. Choose a directory to host the database. We'll use `~/doormandb` for these examples.
    a. Run `initdb ~/doormandb` to initialize the database.
    a. Run `pg_ctl -D ~/doormandb -l ~/doormandb/pg.log -o -p 5432 start` to start a Postgres instance.

    If you reboot or otherwise, just run the pg_ctl ... start command above to resurrect the server.

1. Create the doorman database by running:

    ~~~
    createdb -h localhost -p 5432 doorman
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

1. Start doorman by running:

    ~~~
    python manage.py ssl
    ~~~

1. Launch osquery with the [appropriate cli flags](https://osquery.readthedocs.org/en/stable/installation/cli-flags/#remote-settings-optional-for-configloggerdistributed-flags) to configure it to use the TLS enrollment, configuration, logging, and distributed read/write API's. **Below is an example bash script to be used _only_ for testing**:

    ~~~
    #!/usr/bin/env bash
    
    export ENROLL_SECRET=secret
    
    osqueryd \
       --pidfile /tmp/osquery.pid \
       --host_identifier uuid \
       --database_path /tmp/osquery.db \
       --config_plugin tls \
       --config_tls_endpoint /config \
       --config_tls_refresh 10 \
       --config_tls_max_attempts 3 \
       --enroll_tls_endpoint /enroll  \
       --enroll_secret_env ENROLL_SECRET \
       --disable_distributed=false \
       --distributed_plugin tls \
       --distributed_interval 10 \
       --distributed_tls_max_attempts 3 \
       --distributed_tls_read_endpoint /distributed/read \
       --distributed_tls_write_endpoint /distributed/write \
       --tls_dump true \
       --logger_path /tmp/ \
       --logger_plugin tls \
       --logger_tls_endpoint /log \
       --logger_tls_period 5 \
       --tls_hostname localhost:5000 \
       --tls_server_certs ./certificate.crt \
       --log_result_events=false \
       --pack_delimiter /
    ~~~

## running tests

To execute tests, simply run `python manage.py test`.
