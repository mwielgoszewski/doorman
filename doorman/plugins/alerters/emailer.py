# -*- coding: utf-8 -*-
import datetime as dt
from string import Template

from flask_mail import Message

from doorman.extensions import mail
from .base import AbstractAlerterPlugin


SUBJECT_TEMPLATE = Template(u"{host_identifier} {name} ({action})")

MESSAGE_TEMPLATE = Template(u"""
A doorman alert was triggered: $alert_name

Timestamp: $timestamp
Action:    $action
Columns:

$columns

Review $host_identifier's most recent activity at $recent_activity_url.
This rule's configuration may be reviewed at $rule_url.

---END notification

""")


class EmailAlerter(AbstractAlerterPlugin):

    def __init__(self, config):
        self.recipients = config['recipients']
        self.subject_template = config.get('subject_template', SUBJECT_TEMPLATE)
        self.message_template = config.get('message_template', MESSAGE_TEMPLATE)

    def handle_alert(self, node, match):

        rule = Rule.get_by_id(match.rule_id)

        subject = self.subject_template.substitute(
            host_identifier=node['host_identifier'],
            name=rule.name,
            action=match.action)

        content = []
        for key, value in match.match.items():
            content.append("  {key}: {value}".format(key, value))

        body = self.message_template.safe_substitute(
            alert_name=rule.name,
            timestamp=dt.datetime.utcnow(),
            host_identifier=node['host_identifier'],
            content='\n'.join(content),
            # recent_activity_url=url_for('manage.node_activity', node_id=node['id'])
            rule_url=url_for('manage.rule', rule_id=rule.id),
        )

        message = Message(subject,
                          recipients=self.recipients,
                          body=body,
                          charset='utf-8',
        )

        return mail.send(message)
