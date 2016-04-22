# -*- coding: utf-8 -*-
from os.path import abspath, basename, dirname, join, splitext
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
    import pytest
    test_path = join(abspath(dirname(__file__)), 'tests')
    exit_code = pytest.main([test_path, '--verbose'])
    return exit_code


if __name__ == '__main__':
    manager.run()
