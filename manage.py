# -*- coding: utf-8 -*-
from os.path import abspath, basename, dirname, join, splitext
import os
import glob
import json

from flask_migrate import MigrateCommand
from flask_script import Command, Manager, Server, Shell
from flask_script.commands import Clean, ShowUrls

from doorman import create_app, db


app = create_app()


def _make_context():
    return {'app': app, 'db': db}


class SSLServer(Command):
    def run(self, *args, **kwargs):
        ssl_context = ('./certificate.crt', './private.key')
        app.run(ssl_context=ssl_context, *args, **kwargs)


manager = Manager(app)
manager.add_command('server', Server())
manager.add_command('ssl', SSLServer())
manager.add_command('shell', Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)
manager.add_command('clean', Clean())
manager.add_command('urls', ShowUrls())


@manager.command
def test():
    """Run the tests."""
    # Override the environment variable to load test configuration
    os.environ['DOORMAN_SETTINGS'] = 'doorman.settings.TestConfig'

    # Run tests
    import pytest
    test_path = join(abspath(dirname(__file__)), 'tests')
    exit_code = pytest.main([test_path, '--verbose'])
    return exit_code


@manager.command
def extract_ddl(specs_dir):
    """Extracts CREATE TABLE statements from osquery's table specifications"""
    from doorman.extract_ddl import extract_schema

    spec_files = []
    spec_files.extend(glob.glob(join(specs_dir, '*.table')))
    spec_files.extend(glob.glob(join(specs_dir, '**', '*.table')))

    ddl = sorted([extract_schema(f) for f in spec_files])

    opath = join(dirname(__file__), 'doorman', 'osquery_schema.sql')
    with open(opath, 'wb') as f:
        f.write('-- This file is generated using "python manage.py extract_ddl" - do not edit manually\n')
        f.write('\n'.join(ddl))


if __name__ == '__main__':
    manager.run()
