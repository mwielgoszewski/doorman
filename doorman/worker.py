# -*- coding: utf-8 -*-

from doorman.application import create_app

app = create_app()

from doorman.tasks import celery
