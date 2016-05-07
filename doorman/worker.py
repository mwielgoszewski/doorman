# -*- coding: utf-8 -*-
import os

from doorman.application import create_app
from doorman.settings import DevConfig, ProdConfig, TestConfig


if os.environ.get('DOORMAN_ENV') == 'prod':
    CONFIG = ProdConfig
elif os.environ.get('DOORMAN_ENV') == 'test':
    CONFIG = TestConfig
else:
    CONFIG = DevConfig


app = create_app(config=CONFIG)


from doorman.tasks import celery
