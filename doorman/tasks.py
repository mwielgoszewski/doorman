# -*- coding: utf-8 -*-
from celery import Celery


celery = Celery(__name__)


@celery.task()
def example_task(one, two):
    print('Adding {0} and {1}'.format(one, two))
    return one + two
