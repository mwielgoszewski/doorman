# -*- coding: utf-8 -*-
from doorman.tasks import example_task


class TestCelery:
    def test_celery_simple(self):
        res = example_task.delay(1, 2)
        assert res.get() == 3
