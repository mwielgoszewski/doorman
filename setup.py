# -*- coding: utf-8 -*-
from setuptools import setup, find_packages


setup(
    name='doorman',
    description='an osquery fleet manager',
    url='https://github.com/mwielgoszewski/doorman',
    version='0.3',
    packages=find_packages(
        exclude=[
            'tests*',
        ]
    ),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'alembic==0.8.6',
        'amqp==1.4.9',
        'anyjson==0.3.3',
        'billiard==3.3.0.23',
        'blinker==1.4',
        'celery==3.1.23',
        'cssmin==0.2.0',
        'Flask==0.10.1',
        'Flask-Assets==0.11',
        'Flask-Bcrypt==0.7.1',
        'Flask-Login==0.3.2',
        'Flask-Migrate==1.8.0',
        'Flask-Script==2.0.5',
        'Flask-SQLAlchemy==2.1',
        'Flask-WTF==0.12',
        'itsdangerous==0.24',
        'Jinja2==2.8',
        'jsmin==2.2.1',
        'kombu==3.0.35',
        'Mako==1.0.4',
        'MarkupSafe==0.23',
        'psycopg2==2.6.1',
        'python-editor==1.0',
        'pytz==2016.4',
        'redis==2.10.5',
        'requests==2.10.0',
        'requests-oauthlib==0.6.1',
        'scales==1.0.9',
        'SQLAlchemy==1.0.12',
        'webassets==0.11.1',
        'Werkzeug==0.11.8',
        'WTForms==2.1',
    ],
    package_data={
        'resources': 'doorman/resources/*',
        'static': 'doorman/static/*',
        'templates': 'doorman/templates/*',
    }
)