# -*- coding: utf-8 -*-
try:
    from urlparse import urlparse, urljoin
except ImportError:
    from urllib.parse import urlparse, urljoin

from flask import (
    Blueprint, abort, current_app, flash, redirect, render_template,
    request, session, url_for
)
from flask_login import current_user, login_user, logout_user, COOKIE_NAME

from oauthlib.oauth2 import OAuth2Error

from .forms import LoginForm
from doorman.extensions import csrf, ldap_manager, login_manager
from doorman.models import User
from doorman.utils import flash_errors


blueprint = Blueprint('users', __name__)


@login_manager.user_loader
def load_user(user_id):
    if current_app.config['DOORMAN_AUTH_METHOD'] is None:
        from doorman.users.mixins import NoAuthUserMixin
        return NoAuthUserMixin()
    return User.get_by_id(int(user_id))


@ldap_manager.save_user
def save_user(dn, username, userdata, memberships):
    user = User.query.filter_by(username=username).first()
    kwargs = {}
    kwargs['username'] = username

    if 'givenName' in userdata:
        kwargs['first_name'] = userdata['givenName'][0]

    if 'sn' in userdata:
        kwargs['last_name'] = userdata['sn'][0]

    return user.update(**kwargs) if user else User.create(**kwargs)


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
        login_user(form.user, remember=form.remember.data)
        flash(u'Welcome {0}.'.format(form.user.username), 'info')
        current_app.logger.info("%s logged in", form.user.username)
        return safe_redirect(next, url_for('manage.index'))

    if form.errors:
        flash(u'Invalid username or password.', 'danger')

    return render_template('login.html', form=form)


@blueprint.route('/logout')
def logout():
    username = getattr(current_user, 'username', None)
    oauth = False

    logout_user()

    # clear any oauth state
    for key in ('_oauth_state', '_oauth_token'):
        oauth |= not not session.pop(key, None)

    response = redirect(url_for('users.login'))

    if username and not oauth:
        flash(u"You have successfully logged out.", "info")
        current_app.logger.info("%s logged out", username)

    # explicitly log the user out, and clear their remember me cookie

    cookie_name = current_app.config.get('REMEMBER_COOKIE_NAME', COOKIE_NAME)
    cookie_path = current_app.config.get('REMEMBER_COOKIE_PATH', '/')
    response.set_cookie(cookie_name, path=cookie_path, expires=0)
    return response, 302


@csrf.exempt
@blueprint.route('/oauth2callback')
def oauth2callback():
    if '_oauth_state' not in session:
        return redirect(url_for('users.login'))

    try:
        user = current_app.oauth_provider.fetch_user()
    except OAuth2Error:
        current_app.logger.exception("Failed to authenticate with oauth")
        return redirect(url_for('users.logout'))

    login_user(user)
    flash(u'Welcome {0}.'.format(user.first_name or user.username), 'info')
    current_app.logger.info("%s logged in", user.username)

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
