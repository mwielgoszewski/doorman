# -*- coding: utf-8 -*-
from doorman.application import create_app
from doorman.settings import CurrentConfig
from doorman.tasks import celery


app = create_app(config=CurrentConfig)
