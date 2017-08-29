# -*- coding: utf-8 -*-
import datetime as dt
import string
import uuid

from flask_login import UserMixin

from doorman.database import (
    Column,
    Table,
    ForeignKey,
    Index,
    Model,
    SurrogatePK,
    db,
    reference_col,
    relationship,
    ARRAY,
    JSONB,
    INET,
    declared_attr,
)
from doorman.extensions import bcrypt


querypacks = Table(
    'query_packs',
    Column('pack.id', db.Integer, ForeignKey('pack.id')),
    Column('query.id', db.Integer, ForeignKey('query.id'))
)

pack_tags = Table(
    'pack_tags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('pack.id', db.Integer, ForeignKey('pack.id'), index=True)
)

node_tags = Table(
    'node_tags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('node.id', db.Integer, ForeignKey('node.id'), index=True)
)

query_tags = Table(
    'query_tags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('query.id', db.Integer, ForeignKey('query.id'), index=True)
)

file_path_tags = Table(
    'file_path_tags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('file_path.id', db.Integer, ForeignKey('file_path.id'), index=True)
)


class Tag(SurrogatePK, Model):

    value = Column(db.String, nullable=False, unique=True)

    nodes = relationship(
        'Node',
        secondary=node_tags,
        back_populates='tags',
    )

    packs = relationship(
        'Pack',
        secondary=pack_tags,
        back_populates='tags',
    )

    queries = relationship(
        'Query',
        secondary=query_tags,
        back_populates='tags',
    )

    file_paths = relationship(
        'FilePath',
        secondary=file_path_tags,
        back_populates='tags',
    )

    def __init__(self, value, **kwargs):
        self.value = value

    def __repr__(self):
        return '<Tag: {0.value}>'.format(self)

    @property
    def packs_count(self):
        return db.session.object_session(self) \
            .query(Pack.id).with_parent(self, 'packs').count()

    @property
    def nodes_count(self):
        return db.session.object_session(self) \
            .query(Node.id).with_parent(self, 'nodes').count()

    @property
    def queries_count(self):
        return db.session.object_session(self) \
            .query(Query.id).with_parent(self, 'queries').count()

    @property
    def file_paths_count(self):
        return db.session.object_session(self) \
            .query(FilePath.id).with_parent(self, 'file_paths').count()


class Query(SurrogatePK, Model):

    name = Column(db.String, nullable=False)
    sql = Column(db.String, nullable=False)
    interval = Column(db.Integer, default=3600)
    platform = Column(db.String)
    version = Column(db.String)
    description = Column(db.String)
    value = Column(db.String)
    removed = Column(db.Boolean, nullable=False, default=True)
    shard = Column(db.Integer)

    packs = relationship(
        'Pack',
        secondary=querypacks,
        back_populates='queries',
    )

    tags = relationship(
        'Tag',
        secondary=query_tags,
        back_populates='queries',
        lazy='joined',
    )

    def __init__(self, name, query=None, sql=None, interval=3600, platform=None,
                 version=None, description=None, value=None, removed=True,
                 shard=None, **kwargs):
        self.name = name
        self.sql = query or sql
        self.interval = int(interval)
        self.platform = platform
        self.version = version
        self.description = description
        self.value = value
        self.removed = removed
        self.shard = shard

    def __repr__(self):
        return '<Query: {0.name}>'.format(self)

    def to_dict(self):
        return {
            'query': self.sql,
            'interval': self.interval,
            'platform': self.platform,
            'version': self.version,
            'description': self.description,
            'value': self.value,
            'removed': self.removed,
            'shard': self.shard,
        }


class Pack(SurrogatePK, Model):

    name = Column(db.String, nullable=False, unique=True)
    platform = Column(db.String)
    version = Column(db.String)
    description = Column(db.String)
    shard = Column(db.Integer)

    queries = relationship(
        'Query',
        secondary=querypacks,
        back_populates='packs',
    )

    tags = relationship(
        'Tag',
        secondary=pack_tags,
        back_populates='packs',
    )

    def __init__(self, name, platform=None, version=None,
                 description=None, shard=None, **kwargs):
        self.name = name
        self.platform = platform
        self.version = version
        self.description = description
        self.shard = shard

    def __repr__(self):
        return '<Pack: {0.name}>'.format(self)

    def to_dict(self):
        queries = {}
        discovery = []

        for query in self.queries:
            if 'discovery' in (t.value for t in query.tags):
                discovery.append(query.sql)
            else:
                queries[query.name] = query.to_dict()

        return {
            'platform': self.platform,
            'version': self.version,
            'shard': self.shard,
            'discovery': discovery,
            'queries': queries,
        }


class Node(SurrogatePK, Model):

    node_key = Column(db.String, nullable=False, unique=True)
    enroll_secret = Column(db.String)
    enrolled_on = Column(db.DateTime)
    host_identifier = Column(db.String)
    last_checkin = Column(db.DateTime)
    node_info = Column(JSONB, default={}, nullable=False)
    is_active = Column(db.Boolean, default=True, nullable=False)
    last_ip = Column(INET, nullable=True)

    tags = relationship(
        'Tag',
        secondary=node_tags,
        back_populates='nodes',
        lazy='joined',
    )

    def __init__(self, host_identifier, node_key=None,
                 enroll_secret=None, enrolled_on=None, last_checkin=None,
                 is_active=True, last_ip=None,
                 **kwargs):
        self.node_key = node_key or str(uuid.uuid4())
        self.host_identifier = host_identifier
        self.enroll_secret = enroll_secret
        self.enrolled_on = enrolled_on
        self.last_checkin = last_checkin
        self.is_active = is_active
        self.last_ip = last_ip

    def __repr__(self):
        return '<Node-{0.id}: node_key={0.node_key}, host_identifier={0.host_identifier}>'.format(self)

    def get_config(self, **kwargs):
        from doorman.utils import assemble_configuration
        return assemble_configuration(self)

    def get_new_queries(self, **kwargs):
        from doorman.utils import assemble_distributed_queries
        return assemble_distributed_queries(self)

    @property
    def display_name(self):
        if 'display_name' in self.node_info and self.node_info['display_name']:
            return self.node_info['display_name']
        elif 'hostname' in self.node_info and self.node_info['hostname']:
            return self.node_info['hostname']
        elif 'computer_name' in self.node_info and self.node_info['computer_name']:
            return self.node_info['computer_name']
        else:
            return self.host_identifier

    @property
    def packs(self):
        return db.session.object_session(self) \
            .query(Pack) \
            .join(pack_tags, pack_tags.c['pack.id'] == Pack.id) \
            .join(node_tags, node_tags.c['tag.id'] == pack_tags.c['tag.id']) \
            .filter(node_tags.c['node.id'] == self.id) \
            .options(db.lazyload('*'))

    @property
    def queries(self):
        return db.session.object_session(self) \
            .query(Query) \
            .join(query_tags, query_tags.c['query.id'] == Query.id) \
            .join(node_tags, node_tags.c['tag.id'] == query_tags.c['tag.id']) \
            .filter(node_tags.c['node.id'] == self.id) \
            .options(db.lazyload('*'))

    @property
    def file_paths(self):
        return db.session.object_session(self) \
            .query(FilePath) \
            .join(file_path_tags, file_path_tags.c['file_path.id'] == FilePath.id) \
            .join(node_tags, node_tags.c['tag.id'] == file_path_tags.c['tag.id']) \
            .filter(node_tags.c['node.id'] == self.id) \
            .options(db.lazyload('*'))

    def to_dict(self):
        # NOTE: deliberately not including any secret values in here, for now.
        return {
            'id': self.id,
            'display_name': self.display_name,
            'enrolled_on': self.enrolled_on,
            'host_identifier': self.host_identifier,
            'last_checkin': self.last_checkin,
            'node_info': self.node_info.copy(),
            'last_ip': self.last_ip,
            'is_active': self.is_active
        }


class FilePath(SurrogatePK, Model):

    category = Column(db.String, nullable=False, unique=True)
    target_paths = Column(db.String)

    tags = relationship(
        'Tag',
        secondary=file_path_tags,
        back_populates='file_paths',
        lazy='joined',
    )

    def __init__(self, category=None, target_paths=None, *args, **kwargs):
        self.category = category

        if target_paths is not None:
            self.set_paths(*target_paths)
        elif args:
            self.set_paths(*args)
        else:
            self.target_paths = ''

    def to_dict(self):
        return {
            self.category: self.get_paths()
        }

    def get_paths(self):
        return self.target_paths.split('!!')

    def set_paths(self, *target_paths):
        self.target_paths = '!!'.join(target_paths)


class ResultLog(SurrogatePK, Model):

    name = Column(db.String, nullable=False)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)
    action = Column(db.String)
    columns = Column(JSONB)

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('result_logs', lazy='dynamic')
    )

    def __init__(self, name=None, action=None, columns=None, timestamp=None,
                 node=None, node_id=None, **kwargs):
        self.name = name
        self.action = action
        self.columns = columns or {}
        self.timestamp = timestamp
        if node:
            self.node = node
        elif node_id:
            self.node_id = node_id

    @declared_attr
    def __table_args__(cls):
        return (
            Index('idx_%s_node_id_timestamp_desc' % cls.__tablename__,
                  'node_id', cls.timestamp.desc()),
        )


class StatusLog(SurrogatePK, Model):

    line = Column(db.Integer)
    message = Column(db.String)
    severity = Column(db.Integer)
    filename = Column(db.String)
    created = Column(db.DateTime, default=dt.datetime.utcnow)
    version = Column(db.String)

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('status_logs', lazy='dynamic')
    )

    def __init__(self, line=None, message=None, severity=None,
                 filename=None, created=None, node=None, node_id=None,
                 version=None, **kwargs):
        self.line = int(line)
        self.message = message
        self.severity = int(severity)
        self.filename = filename
        self.created = created
        self.version = version
        if node:
            self.node = node
        elif node_id:
            self.node_id = node_id

    @declared_attr
    def __table_args__(cls):
        return (
            Index('idx_%s_node_id_created_desc' % cls.__tablename__,
                'node_id', cls.created.desc()),
        )


class DistributedQuery(SurrogatePK, Model):

    description = Column(db.String, nullable=True)
    sql = Column(db.String, nullable=False)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)
    not_before = Column(db.DateTime, default=dt.datetime.utcnow)

    def __init___(self, sql, description=None, not_before=None):
        self.sql = sql
        self.description = description
        self.not_before = not_before


class DistributedQueryTask(SurrogatePK, Model):

    NEW = 0
    PENDING = 1
    COMPLETE = 2
    FAILED = 3

    guid = Column(db.String, nullable=False, unique=True)
    status = Column(db.Integer, default=0, nullable=False)
    timestamp = Column(db.DateTime)

    distributed_query_id = reference_col('distributed_query', nullable=False)
    distributed_query = relationship(
        'DistributedQuery',
        backref=db.backref('tasks',
                           cascade='all, delete-orphan',
                           lazy='dynamic'),
    )

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('distributed_queries', lazy='dynamic'),
    )

    def __init__(self, node=None, node_id=None,
                 distributed_query=None, distributed_query_id=None):
        self.guid = str(uuid.uuid4())
        if node:
            self.node = node
        elif node_id:
            self.node_id = node_id
        if distributed_query:
            self.distributed_query = distributed_query
        elif distributed_query_id:
            self.distributed_query_id = distributed_query_id

    @declared_attr
    def __table_args__(cls):
        return (
            Index('idx_%s_node_id_status' % cls.__tablename__, 'node_id', 'status'),
        )


class DistributedQueryResult(SurrogatePK, Model):

    columns = Column(JSONB)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)

    distributed_query_task_id = reference_col('distributed_query_task', nullable=False)
    distributed_query_task = relationship(
        'DistributedQueryTask',
        backref=db.backref('results',
                           cascade='all, delete-orphan',
                           lazy='joined'),
    )

    distributed_query_id = reference_col('distributed_query', nullable=False)
    distributed_query = relationship(
        'DistributedQuery',
        backref=db.backref('results',
                           cascade='all, delete-orphan',
                           lazy='joined'),
    )

    def __init__(self, columns, distributed_query=None, distributed_query_task=None):
        self.columns = columns
        self.distributed_query = distributed_query
        self.distributed_query_task = distributed_query_task


class Rule(SurrogatePK, Model):

    name = Column(db.String, nullable=False)
    alerters = Column(ARRAY(db.String), nullable=False)
    description = Column(db.String, nullable=True)
    conditions = Column(JSONB)
    updated_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)

    def __init__(self, name, alerters, description=None, conditions=None, updated_at=None):
        self.name = name
        self.description = description
        self.alerters = alerters
        self.conditions = conditions
        self.updated_at = updated_at

    @property
    def template(self):
        return string.Template("{name}\r\n\r\n{description}".format(
            name=self.name, description=self.description or '')
        )


class User(UserMixin, SurrogatePK, Model):

    username = Column(db.String(80), unique=True, nullable=False)
    email = Column(db.String)

    password = Column(db.String, nullable=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)

    # oauth related stuff
    social_id = Column(db.String)
    first_name = Column(db.String)
    last_name = Column(db.String)

    def __init__(self, username, password=None, email=None, social_id=None,
                 first_name=None, last_name=None):
        self.username = username
        self.email = email
        if password:
            self.set_password(password)
        else:
            self.password = None

        self.social_id = social_id
        self.first_name = first_name
        self.last_name = last_name

    def set_password(self, password):
        self.update(password=bcrypt.generate_password_hash(password))
        return

    def check_password(self, value):
        if not self.password:
            # still do the computation
            return bcrypt.generate_password_hash(value) and False
        return bcrypt.check_password_hash(self.password, value)
