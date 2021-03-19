# -*- coding: utf-8 -*-
from setuptools import setup, find_packages


setup(
    name='doorman',
    description='an osquery fleet manager',
    url='https://github.com/mwielgoszewski/doorman',
    version='0.5.1',
    packages=find_packages(
        exclude=[
            'tests*',
        ]
    ),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'alembic==1.0.5',
        'amqp==2.3.2',
        'bcrypt==3.1.5',
        'billiard==3.5.0.5',
        'blinker==1.4',
        'celery==4.2.1',
        'certifi==2018.11.29',
        'cffi==1.11.5',
        'chardet==3.0.4',
        'Click==7.0',
        'contextlib2==0.5.5',
        'cssmin==0.2.0',
        'enum34==1.1.6',
        'Flask==1.0.2',
        'Flask-Assets==0.12',
        'Flask-Bcrypt==0.7.1',
        'Flask-DebugToolbar==0.10.1',
        'flask-ldap3-login==0.9.16',
        'Flask-Login==0.4.1',
        'Flask-Mail==0.9.1',
        'Flask-Migrate==2.3.1',
        'flask-paginate==0.5.1',
        'Flask-Script==2.0.6',
        'Flask-SQLAlchemy==2.3.2',
        'Flask-SSLify==0.1.5',
        'Flask-WTF==0.14.2',
        'idna==2.8',
        'itsdangerous==1.1.0',
        'Jinja2==2.11.3',
        'jsmin==2.2.2',
        'kombu==4.2.2.post1',
        'ldap3==2.5.2',
        'Mako==1.0.7',
        'MarkupSafe==1.1.0',
        'oauthlib==2.1.0',
        'psycopg2-binary==2.7.6.1',
        'pyasn1==0.4.5',
        'pycparser==2.19',
        'python-dateutil==2.7.5',
        'python-editor==1.0.3',
        'pytz==2018.7',
        'raven==6.10.0',
        'redis==3.0.1',
        'requests==2.21.0',
        'six==1.12.0',
        'SQLAlchemy==1.2.15',
        'unicodecsv==0.14.1',
        'urllib3==1.24.1',
        'vine==1.1.4',
        'webassets==0.12.1',
        'Werkzeug==0.14.1',
        'WTForms==2.2.1',
    ],
    package_data={
        'resources': 'doorman/resources/*',
        'static': 'doorman/static/*',
        'templates': 'doorman/templates/*',
    }
)
