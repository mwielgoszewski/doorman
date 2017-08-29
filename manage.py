# -*- coding: utf-8 -*-
from os.path import abspath, dirname, join
import glob

from flask_assets import ManageAssets
from flask_migrate import MigrateCommand
from flask_script import Command, Manager, Server, Shell
from flask_script.commands import Clean, ShowUrls

from doorman import create_app, db
from doorman.settings import CurrentConfig
from doorman.assets import assets


app = create_app(config=CurrentConfig)


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
manager.add_command("assets", ManageAssets(assets))


@manager.add_command
class test(Command):
    name = 'test'
    capture_all_args = True

    def run(self, remaining):
        import pytest
        test_path = join(abspath(dirname(__file__)), 'tests')

        if remaining:
            test_args = remaining + ['--verbose']
        else:
            test_args = [test_path, '--verbose']

        exit_code = pytest.main(test_args)
        return exit_code


@manager.command
def extract_ddl(specs_dir):
    """Extracts CREATE TABLE statements from osquery's table specifications"""
    from doorman.extract_ddl import extract_schema

    spec_files = []
    spec_files.extend(glob.glob(join(specs_dir, '*.table')))
    spec_files.extend(glob.glob(join(specs_dir, '**', '*.table')))

    ddl = sorted([extract_schema(f) for f in spec_files], key=lambda x:x.split()[2])

    opath = join(dirname(__file__), 'doorman', 'resources', 'osquery_schema.sql')
    with open(opath, 'w') as f:
        f.write('-- This file is generated using "python manage.py extract_ddl"'
                '- do not edit manually\n')
        f.write('\n'.join(ddl))


@manager.option('username')
@manager.option('--email', default=None)
def adduser(username, email):
    from doorman.models import User
    import getpass
    import sys

    if User.query.filter_by(username=username).first():
        raise ValueError("Username already exists!")

    password = getpass.getpass(stream=sys.stderr)

    try:
        user = User.create(
            username=username,
            email=email or username,
            password=password,
        )
    except Exception as error:
        print("Failed to create user {0} - {1}".format(username, error))
        exit(1)
    else:
        print("Created user {0}".format(user.username))
        exit(0)


if __name__ == '__main__':
    manager.run()
