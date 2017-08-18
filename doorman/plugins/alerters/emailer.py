# -*- coding: utf-8 -*-
import datetime as dt

from flask import render_template
from flask_mail import Message

from doorman.extensions import mail
from .base import AbstractAlerterPlugin


class EmailAlerter(AbstractAlerterPlugin):

    def __init__(self, config):
        self.recipients = config['recipients']
        self.config = config

    def handle_alert(self, node, match):
        subject_template = self.config.setdefault(
            'subject_template', 'email/alert.subject.txt'
        )
        message_template = self.config.setdefault(
            'message_template', 'email/alert.body.txt'
        )
        subject_prefix = self.config.setdefault(
            'subject_prefix', '[Doorman]'
        )

        subject = render_template(
            subject_template,
            prefix=subject_prefix,
            match=match,
            timestamp=dt.datetime.utcnow(),
            node=node
        )

        body = render_template(
            message_template,
            match=match,
            timestamp=dt.datetime.utcnow(),
            node=node
        )

        message = Message(
            subject.strip(),
            recipients=self.recipients,
            body=body,
            charset='utf-8',
        )

        return mail.send(message)
