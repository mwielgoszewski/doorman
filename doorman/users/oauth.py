# -*- coding: utf-8 -*-
from flask import abort, current_app, flash, request, session, url_for
from requests_oauthlib import OAuth2Session

from doorman.models import User


class OAuthLogin(object):
    providers = None

    @classmethod
    def get_provider(self, provider_name):
        if self.providers is None:
            self.providers = {}
            for provider_class in self.__subclasses__():
                provider = provider_class()
                self.providers[provider.provider_name] = provider
        return self.providers[provider_name]

    @property
    def client_id(self):
        return self.config.get('DOORMAN_OAUTH_CLIENT_ID')

    @property
    def client_secret(self):
        return self.config.get('DOORMAN_OAUTH_CLIENT_SECRET')

    @property
    def base_url(self):
        return self.config.get('DOORMAN_OAUTH_GOOGLE_BASE_URL')

    @property
    def redirect_uri(self):
        return url_for(self.config.get('DOORMAN_AUTH_REDIRECT_VIEW'),
                       _scheme=self.config.get('PREFERRED_URL_SCHEME'),
                       _external=True)

    @property
    def token_url(self):
        return self.config.get('DOORMAN_OAUTH_GOOGLE_TOKEN_URL')

    @property
    def scope(self):
        return self.config.get('DOORMAN_OAUTH_GOOGLE_SCOPE')

    def fetch_user(self):
        pass

    def get_authorize_url(self):
        pass


class GoogleOAuthV2Login(OAuthLogin):

    def __init__(self, app=None):
        self.provider_name = 'google'
        self.app = app
        self.config = {}
        if app:
            self.init_app(app)

    def init_app(self, app):
        self.config = app.config

        if not self.config['DOORMAN_OAUTH_CLIENT_ID']:
            raise ValueError("DOORMAN_OAUTH_CLIENT_ID must be configured")

        if not self.config['DOORMAN_OAUTH_CLIENT_SECRET']:
            raise ValueError("DOORMAN_OAUTH_CLIENT_SECRET must be configured")

        self.config.setdefault('DOORMAN_OAUTH_GOOGLE_BASE_URL',
                               'https://accounts.google.com/o/oauth2/auth')
        self.config.setdefault('DOORMAN_OAUTH_GOOGLE_TOKEN_URL',
                               'https://www.googleapis.com/oauth2/v3/token')
        self.config.setdefault('DOORMAN_AUTH_REDIRECT_VIEW',
                               'users.oauth2callback')

        self.config.setdefault('DOORMAN_OAUTH_GOOGLE_SCOPE', ['email', 'profile'])

        self.config.setdefault('DOORMAN_OAUTH_GOOGLE_ALLOWED_DOMAINS', [])
        self.config.setdefault('DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS', [])

        app.oauth_provider = self

    @property
    def allowed_users(self):
        return self.config.get('DOORMAN_OAUTH_GOOGLE_ALLOWED_USERS', [])

    @property
    def allowed_domains(self):
        return self.config.get('DOORMAN_OAUTH_GOOGLE_ALLOWED_DOMAINS', [])

    def get_authorize_url(self):
        provider = OAuth2Session(self.client_id,
                                 scope=self.scope,
                                 redirect_uri=self.redirect_uri)

        authorization_url, state = provider.authorization_url(
            self.base_url,
            access_type='online',
            approval_prompt='force',
        )

        session['_oauth_state'] = state

        return authorization_url

    def fetch_user(self):
        code = request.args.get('code')
        state = session.pop('_oauth_state')

        provider = OAuth2Session(
            self.client_id,
            redirect_uri=self.redirect_uri,
            state=state
        )

        token = provider.fetch_token(
            self.token_url,
            client_secret=self.client_secret,
            code=code,
            authorization_response=request.url,
        )

        response = provider.get('https://www.googleapis.com/oauth2/v1/userinfo')
        userinfo = response.json()

        if not userinfo:
            current_app.logger.error("No userinfo object returned!")
            abort(500)

        current_app.logger.debug("Got userinfo: %s", userinfo)

        if self.allowed_users and userinfo['email'] not in self.allowed_users:
            current_app.logger.error("%s is not authorized for this application",
                                     userinfo['email'])
            flash(u"{0} is not authorized for this application.".format(
                  userinfo['email']), 'danger')
            abort(401)

        if self.allowed_domains and userinfo['hd'] not in self.allowed_domains:
            current_app.logger.error("%s domain and %s not authorized",
                                     userinfo['hd'], userinfo['email'])
            flash(u"{0} is not authorized for this application.".format(
                  userinfo['email']), 'danger')
            abort(401)

        if not userinfo['verified_email']:
            flash(u"You must verify your email before using this application.",
                  'danger')
            abort(401)

        user = User.query.filter_by(
            email=userinfo['email'],
            social_id=userinfo['id'],
        ).first()

        if not user:
            user = User.create(
                username=userinfo['email'],
                email=userinfo['email'],
                social_id=userinfo['id'],
                first_name=userinfo['given_name'],
                last_name=userinfo['family_name'],
            )
        else:
            user.update(
                username=userinfo['email'],
                email=userinfo['email'],
                social_id=userinfo['id'],
                first_name=userinfo['given_name'],
                last_name=userinfo['family_name'],
            )

        session['_oauth_token'] = token

        return user
