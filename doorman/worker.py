# -*- coding: utf-8 -*-
import os

from doorman.application import create_app

app = create_app()

# Override config if we're testing
if os.environ.get('DOORMAN_CELERY_TESTING'):
    app.config.from_object('doorman.settings.TestConfig')

from doorman.tasks import celery
