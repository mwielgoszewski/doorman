# -*- coding: utf-8 -*-
from celery import Celery
from flask import current_app


celery = Celery(__name__)


@celery.task()
def analyze_result(result, node):
    current_app.rule_manager.handle_log_entry(result, node)
    return


@celery.task()
def example_task(one, two):
    print('Adding {0} and {1}'.format(one, two))
    return one + two
