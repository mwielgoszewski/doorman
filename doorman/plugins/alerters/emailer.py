# -*- coding: utf-8 -*-
import datetime as dt

from flask import render_template
from flask_mail import Message

from doorman.extensions import mail
from .base import AbstractAlerterPlugin


class EmailAlerter(AbstractAlerterPlugin):

    def __init__(self, config):
        self.recipients = config['recipients']
        self.subject_template = config.get('subject_template', 'email/alert.subject.txt')
        self.message_template = config.get('message_template', 'email/alert.body.txt')
        self.subject_prefix = config.get('subject_prefix', '[Doorman]')

    def handle_alert(self, node, match):
        subject = render_template(
            self.subject_template,
            prefix=self.subject_prefix,
            match=match,
            timestamp=dt.datetime.utcnow(),
            node=node
        )

        body = render_template(
            self.message_template,
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
