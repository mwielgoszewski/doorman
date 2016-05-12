# -*- coding: utf-8 -*-

from flask_login import UserMixin


class NoAuthUserMixin(UserMixin):

    def get_id(self):
        return u''

    @property
    def username(self):
        return u''
