# -*- coding: utf-8 -*-
from urlparse import urlparse, urljoin

from flask import (Blueprint, abort, current_app, flash, redirect, render_template,
    request, session, url_for)
from flask_login import current_user, login_user, logout_user

from .forms import LoginForm
from doorman.extensions import login_manager
from doorman.models import User
from doorman.utils import flash_errors


blueprint = Blueprint('users', __name__)


@login_manager.user_loader
def load_user(user_id):
    if current_app.config['DOORMAN_AUTH_METHOD'] is None:
        from doorman.users.mixins import NoAuthUserMixin
        return NoAuthUserMixin()
    return User.get_by_id(int(user_id))


@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    next = request.args.get('next', url_for('manage.index'))

    if current_user and current_user.is_authenticated:
        return safe_redirect(next, url_for('manage.index'))

    if current_app.config['DOORMAN_AUTH_METHOD'] not in (None, 'doorman', 'ldap'):
        authorization_url = current_app.oauth_provider.get_authorize_url()
        current_app.logger.debug("Redirecting user to %s", authorization_url)
        return redirect(authorization_url)

    form = LoginForm()
    if form.validate_on_submit():
        login_user(form.user)
        flash(u'Welcome {0}.'.format(form.user.username), 'info')
        return safe_redirect(next, url_for('manage.index'))

    if form.errors:
        flash(u'Invalid username or password.', 'danger')

    return render_template('login.html', form=form)


@blueprint.route('/logout')
def logout():
    logout_user()

    # clear any oauth state
    for key in ('_oauth_state', '_oauth_token'):
        session.pop(key, None)

    return redirect(url_for('manage.index'))


@blueprint.route('/oauth2callback')
def oauth2callback():
    if '_oauth_state' not in session:
        return redirect(url_for('users.login'))

    user = current_app.oauth_provider.fetch_user()
    login_user(user)
    flash(u'Welcome {0}.'.format(user.first_name or user.username), 'info')

    return redirect(url_for('users.login'))


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
        ref_url.netloc == test_url.netloc


def safe_redirect(target, default):
    if is_safe_url(target):
        return redirect(target)
    else:
        return redirect(default)
