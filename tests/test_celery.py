# -*- coding: utf-8 -*-
from doorman.tasks import example_task


class TestCelery:
    def setUp(self):
        """
        Actually pass tasks through to Celery in this test - since that's what
        we're testing!
        """
        from celery import current_app
        current_app.conf.CELERY_ALWAYS_EAGER = False

    def test_celery_simple(self):
        res = example_task.delay(1, 2)
        assert res.get() == 3
