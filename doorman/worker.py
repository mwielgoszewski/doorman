# -*- coding: utf-8 -*-
import os

from doorman.application import create_app
from doorman.settings import DevConfig, TestConfig

# Allow overriding config if we're testing
config = DevConfig
if os.environ.get('DOORMAN_CELERY_TESTING'):
    config = TestConfig

app = create_app(config=config)


from doorman.tasks import celery
