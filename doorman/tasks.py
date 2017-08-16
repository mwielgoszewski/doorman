# -*- coding: utf-8 -*-
from celery import Celery
from flask import current_app


celery = Celery(__name__)


@celery.task()
def analyze_result(result, node):
    current_app.rule_manager.handle_log_entry(result, node)
    learn_from_result.s(result, node).delay()
    return


@celery.task()
def learn_from_result(result, node):
    from doorman.utils import learn_from_result
    learn_from_result(result, node)
    return


@celery.task()
def notify_of_node_enrollment(node):
    current_app.rule_manager.handle_enroll(node)
    return


@celery.task()
def example_task(one, two):
    print('Adding {0} and {1}'.format(one, two))
    return one + two
