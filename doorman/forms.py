# -*- coding: utf-8 -*-

from flask_wtf import Form
from flask_wtf.file import FileField, FileRequired

from wtforms.fields import (BooleanField,
                            DateTimeField,
                            IntegerField,
                            SelectField,
                            SelectMultipleField,
                            StringField,
                            TextAreaField)
from wtforms.validators import DataRequired, Optional, ValidationError

from doorman.utils import validate_osquery_query


class ValidSQL(object):
    def __init__(self, message=None):
        if not message:
            message = u'Field must contain valid SQL to be run against osquery tables'
        self.message = message

    def __call__(self, form, field):
        if not validate_osquery_query(field.data):
            raise ValidationError(self.message)


class UploadPackForm(Form):

    pack = FileField(u'Pack configuration', validators=[FileRequired()])


class QueryForm(Form):

    name = StringField('Name', validators=[DataRequired()])
    sql = TextAreaField("Query", validators=[DataRequired(), ValidSQL()])
    interval = IntegerField('Interval', default=3600, validators=[DataRequired()])
    platform = SelectField('Platform', default='all', choices=[
        ('all', 'All'),
        ('darwin', 'Darwin'),
        ('linux', 'Linux'),
        ('redhat/centos', 'Red Hat/CentOS'),
    ])
    version = StringField('Version')
    description = TextAreaField('Description')
    value = TextAreaField('Value') 
    removed = BooleanField('Log Removed?', default=True)
    packs = SelectMultipleField('Packs', default=None, choices=[
    ])
    tags = TextAreaField("Tags")

    def set_choices(self):
        from doorman.models import Pack
        self.packs.choices = Pack.query.with_entities(Pack.name, Pack.name).all()


class UpdateQueryForm(QueryForm):

    def __init__(self, *args, **kwargs):
        super(UpdateQueryForm, self).__init__(*args, **kwargs)
        self.set_choices()
        query = kwargs.pop('obj', None)
        if query:
            self.packs.process_data([p.name for p in query.packs])
            self.tags.process_data('\n'.join(t.value for t in query.tags))


class CreateQueryForm(QueryForm):

    def validate(self):
        from doorman.models import Query
        initial_validation = super(CreateQueryForm, self).validate()
        if not initial_validation:
            return False

        query = Query.query.filter(Query.name == self.name.data).first()
        if query:
            self.name.errors.append(
                "Query with the name {0} already exists!".format(
                self.name.data)
            )
            return False

        # TODO could do some validation of the sql query
        return True


class AddDistributedQueryForm(Form):

    sql = TextAreaField('Query', validators=[DataRequired(), ValidSQL()])
    not_before = DateTimeField('Not Before', format="%Y-%m-%d %H:%M:%S",
                               validators=[Optional()])
    nodes = SelectMultipleField('Nodes', choices=[])
    tags = SelectMultipleField('Tags', choices=[])

    def set_choices(self):
        from doorman.models import Node, Tag
        self.nodes.choices = Node.query.with_entities(Node.node_key, Node.host_identifier).all()
        self.tags.choices = Tag.query.with_entities(Tag.value, Tag.value).all()


class CreateTagForm(Form):
    value = TextAreaField('Tag', validators=[DataRequired()])


class FilePathForm(Form):
    category = StringField('category', validators=[DataRequired()])
    target_paths = TextAreaField('files', validators=[DataRequired()])
