# -*- coding: utf-8 -*-
"""Database module, including the SQLAlchemy database object and DB-related utilities."""
from __future__ import absolute_import

import six
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql.base import ischema_names
from sqlalchemy.orm import relationship

from doorman.compat import basestring
from doorman.extensions import db


json = None
try:
    import anyjson as json
except ImportError:
    import json as json

try:
    from sqlalchemy.dialects.postgresql import JSON, JSONB
    has_postgres_json = True
except ImportError:
    class PostgresJSONType(sa.types.UserDefinedType):
        """
        Text search vector type for postgresql.
        """
        def get_col_spec(self):
            return 'json'

    class PostgresJSONBType(sa.types.UserDefinedType):
        """
        Text search vector type for postgresql.
        """
        def get_col_spec(self):
            return 'jsonb'

    ischema_names['json'] = PostgresJSONType
    ischema_names['jsonb'] = PostgresJSONBType
    has_postgres_json = False


# Alias common SQLAlchemy names
Column = db.Column
Table = db.Table
ForeignKey = db.ForeignKey
relationship = relationship


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete) operations."""

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save()

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return commit and self.save() or self

    def save(self, commit=True):
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=True):
        """Remove the record from the database."""
        db.session.delete(self)
        return commit and db.session.commit()


class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""

    __abstract__ = True


# From Mike Bayer's "Building the app" talk
# https://speakerdeck.com/zzzeek/building-the-app
class SurrogatePK(object):
    """A mixin that adds a surrogate integer 'primary key' column named ``id`` to any declarative-mapped class."""

    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)

    @classmethod
    def get_by_id(cls, record_id):
        """Get record by ID."""
        if any(
                (isinstance(record_id, basestring) and record_id.isdigit(),
                 isinstance(record_id, (int, float))),
        ):
            return cls.query.get(int(record_id))
        return None


def reference_col(tablename, nullable=False, pk_name='id', **kwargs):
    """Column that adds primary key foreign key reference.

    Usage: ::

        category_id = reference_col('category')
        category = relationship('Category', backref='categories')
    """
    return db.Column(
        ForeignKey('{0}.{1}'.format(tablename, pk_name)),
        nullable=nullable, **kwargs)


class JSONType(sa.types.TypeDecorator):
    """
    JSONType offers way of saving JSON data structures to database. On
    PostgreSQL the underlying implementation of this data type is 'json'
    while on other databases its simply 'text'.

    This and the JSONBType allow us to continue to use sqlite for our
    unit tests.

    ::


        from sqlalchemy_utils import JSONType


        class Product(Base):
            __tablename__ = 'product'
            id = sa.Column(sa.Integer, autoincrement=True)
            name = sa.Column(sa.Unicode(50))
            details = sa.Column(JSONType)


        product = Product()
        product.details = {
            'color': 'red',
            'type': 'car',
            'max-speed': '400 mph'
        }
        session.commit()
    """
    impl = sa.UnicodeText

    # Note, this will not work on sqlite
    comparator_factory = JSON.comparator_factory

    def __init__(self, *args, **kwargs):
        if json is None:
            raise ImproperlyConfigured(
                'JSONType needs anyjson package installed.'
            )
        super(JSONType, self).__init__(*args, **kwargs)

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            # Use the native JSON type.
            if has_postgres_json:
                return dialect.type_descriptor(JSON())
            else:
                return dialect.type_descriptor(PostgresJSONType())
        else:
            return dialect.type_descriptor(self.impl)

    def process_bind_param(self, value, dialect):
        if dialect.name == 'postgresql' and has_postgres_json:
            return value
        if value is not None:
            value = six.text_type(json.dumps(value))
        return value

    def process_result_value(self, value, dialect):
        if dialect.name == 'postgresql':
            return value
        if value is not None:
            value = json.loads(value)
        return value


class JSONBType(JSONType):

    # Note, this will not work on sqlite
    comparator_factory = JSONB.comparator_factory

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            # Use the native JSON type.
            if has_postgres_json:
                # jsonb = JSONB()
                # jsonb.
                return dialect.type_descriptor(JSONB())
            else:
                return dialect.type_descriptor(PostgresJSONBType())
        else:
            return dialect.type_descriptor(self.impl)


if not has_postgres_json:
    JSON = JSONType
    JSONB = JSONBType
