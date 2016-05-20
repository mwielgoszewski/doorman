# -*- coding: utf-8 -*-
import datetime as dt
from string import Template

from flask import url_for
from flask_mail import Message

from doorman.extensions import mail
from doorman.models import Rule
from .base import AbstractAlerterPlugin


SUBJECT_TEMPLATE = Template(u"$prefix $host_identifier $name ($action)")

MESSAGE_TEMPLATE = Template(u"""
A doorman alert was triggered: $alert_name

Timestamp: $timestamp
   Action: $action
  Content:

$content

Review $host_identifier's most recent activity at $recent_activity_url.
This rule's configuration may be reviewed at $rule_url.

---END doorman notification

""")


class EmailAlerter(AbstractAlerterPlugin):

    def __init__(self, config):
        self.recipients = config['recipients']
        self.subject_template = config.get('subject_template', SUBJECT_TEMPLATE)
        self.message_template = config.get('message_template', MESSAGE_TEMPLATE)
        self.subject_prefix = config.get('subject_prefix', '[Doorman]')

    def handle_alert(self, node, match):
        rule = Rule.get_by_id(match.rule_id)

        subject = self.subject_template.substitute(
            prefix=self.subject_prefix.strip(),
            host_identifier=node['host_identifier'],
            name=rule.name,
            action=match.action
        )

        padding = max(map(len, match.match)) + 2

        content = []
        for key, value in sorted(match.match.items()):
            content.append(
                "{padding}{key}:  {value}".format(
                    padding=' ' * (padding - len(key)),
                    key=key,
                    value=value
                )
            )

        body = self.message_template.substitute(
            alert_name=rule.name,
            action=match.action,
            timestamp=dt.datetime.utcnow(),
            host_identifier=node['host_identifier'],
            content='\n'.join(content),
            recent_activity_url=url_for(
                'manage.node_activity',
                node_id=node.get('id', 0),
                _external=True
            ),
            rule_url=url_for(
                'manage.rule',
                rule_id=rule.id,
                _external=True),
        )

        message = Message(
            subject,
            recipients=self.recipients,
            body=body,
            charset='utf-8',
        )

        return mail.send(message)
