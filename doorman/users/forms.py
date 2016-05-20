# -*- coding: utf-8 -*-

from flask import current_app

from flask_wtf import Form
from wtforms import BooleanField, PasswordField, StringField
from wtforms.validators import DataRequired, Optional

from doorman.extensions import bcrypt
from doorman.models import User


class LoginForm(Form):

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember me', validators=[Optional()])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(LoginForm, self).__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        initial_validation = super(LoginForm, self).validate()
        if not initial_validation:
            return False

        error_message = u'Invalid username or password.'

        if current_app.config['DOORMAN_AUTH_METHOD'] == 'doorman':
            self.user = User.query.filter_by(username=self.username.data).first()

            if not self.user:
                from doorman.extensions import bcrypt
                # avoid timing leaks
                bcrypt.generate_password_hash(self.password.data)
                self.username.errors.append(error_message)
                return False

            if not self.user.check_password(self.password.data):
                self.username.errors.append(error_message)
                return False

        elif current_app.config['DOORMAN_AUTH_METHOD'] == 'ldap':
            pass

        return True

    @property
    def auth_method(self):
        return current_app.config['DOORMAN_AUTH_METHOD']
