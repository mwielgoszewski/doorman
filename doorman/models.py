# -*- coding: utf-8 -*-
from itertools import chain
import datetime as dt
import uuid

from doorman.database import (
    Column,
    Table,
    ForeignKey,
    Model,
    SurrogatePK,
    db,
    reference_col,
    relationship,
    JSONBType,
    JSONB,
)


querypacks = Table('querypacks',
    Column('pack.id', db.Integer, ForeignKey('pack.id')),
    Column('query.id', db.Integer, ForeignKey('query.id'))
)

pack_tags = Table('packtags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('pack.id', db.Integer, ForeignKey('pack.id'))
)

node_tags = Table('nodetags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('node.id', db.Integer, ForeignKey('node.id'))
)

query_tags = Table('querytags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('query.id', db.Integer, ForeignKey('query.id'))
)

filepath_tags = Table('pathtags',
    Column('tag.id', db.Integer, ForeignKey('tag.id')),
    Column('filepath.id', db.Integer, ForeignKey('filepath.id'))
)


class Tag(SurrogatePK, Model):
    __tablename__ = 'tag'

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
        secondary=filepath_tags,
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
    __tablename__ = 'query'

    name = Column(db.String, nullable=False)
    sql = Column(db.String, nullable=False)
    interval = Column(db.Integer, default=3600)
    platform = Column(db.String)
    version = Column(db.String)
    description = Column(db.String)
    value = Column(db.String)
    removed = Column(db.Boolean, nullable=False, default=True)

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
                 **kwargs):
        self.name = name
        self.sql = query or sql
        self.interval = int(interval)
        self.platform = platform
        self.version = version
        self.description = description
        self.value = value
        self.removed = removed

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
        }


class Pack(SurrogatePK, Model):
    __tablename__ = 'pack'

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
    __tablename__ = 'node'

    node_key = Column(db.String, nullable=False, unique=True)
    enroll_secret = Column(db.String)
    enrolled_on = Column(db.DateTime)
    host_identifier = Column(db.String)
    last_checkin = Column(db.DateTime)

    tags = relationship(
        'Tag',
        secondary=node_tags,
        back_populates='nodes',
        lazy='joined',
    )

    def __init__(self, host_identifier, node_key=None,
                 enroll_secret=None, enrolled_on=None, last_checkin=None,
                 **kwargs):
        self.node_key = node_key or str(uuid.uuid4())
        self.host_identifier = host_identifier
        self.enroll_secret = enroll_secret
        self.enrolled_on = enrolled_on
        self.last_checkin = last_checkin

    def __repr__(self):
        return '<Node-{0.id}: node_key={0.node_key}, host_identifier={0.host_identifier}>'.format(self)

    def get_config(self, **kwargs):
        from doorman.utils import assemble_configuration
        return assemble_configuration(self)

    def get_new_queries(self, **kwargs):
        from doorman.utils import assemble_distributed_queries
        return assemble_distributed_queries(self)

    @property
    def packs(self):
        return db.session.object_session(self) \
            .query(Pack).join((Tag, Pack.tags)) \
            .filter(Pack.tags.any(Tag.value.in_(t.value for t in self.tags))) \
            .distinct()

    @property
    def queries(self):
        return db.session.object_session(self) \
            .query(Query).join((Tag, Query.tags)) \
            .filter(Query.tags.any(Tag.value.in_(t.value for t in self.tags))) \
            .distinct()

    @property
    def file_paths(self):
        return db.session.object_session(self) \
            .query(FilePath).join((Tag, FilePath.tags)) \
            .filter(FilePath.tags.any(Tag.value.in_(t.value for t in self.tags))) \
            .distinct()

    def get_recent(self, days=7, minutes=0, seconds=0):
        now = dt.datetime.utcnow()
        when = now - dt.timedelta(days=days, minutes=minutes, seconds=seconds)
        return self.result_logs.filter(ResultLog.timestamp > when) \
            .order_by(ResultLog.timestamp.desc())



class FilePath(SurrogatePK, Model):
    __tablename__ = 'filepath'

    category = Column(db.String, nullable=False, unique=True)
    target_paths = Column(db.String)

    tags = relationship(
        'Tag',
        secondary=filepath_tags,
        back_populates='file_paths',
        lazy='joined',
    )

    def __init__(self, category=None, target_paths=None, *args, **kwargs):
        self.category = category

        if target_paths is not None:
            self.target_paths = '!!'.join(target_paths)
        elif args:
            self.target_paths = '!!'.join(args)
        else:
            self.target_paths = ''

    def to_dict(self):
        return {
            self.category: self.get_paths()
        }

    def get_paths(self):
        return self.target_paths.split('!!')


class ResultLog(SurrogatePK, Model):

    name = Column(db.String, nullable=False)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)
    added = Column(JSONBType)
    removed = Column(JSONBType)

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('result_logs', lazy='dynamic')
    )

    def __init__(self, name=None, timestamp=None, added=None, removed=None,
                 node=None):
        self.name = name
        self.timestamp = timestamp
        self.added = added
        self.removed = removed
        self.node = node


class StatusLog(SurrogatePK, Model):

    line = Column(db.Integer)
    message = Column(db.String)
    severity = Column(db.Integer)
    filename = Column(db.String)
    created = Column(db.DateTime, default=dt.datetime.utcnow)

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('status_logs', lazy='dynamic')
    )

    def __init__(self, line=None, message=None, severity=None,
                 filename=None, created=None, node=None):
        self.line = int(line)
        self.message = message
        self.severity = int(severity)
        self.filename = filename
        self.created = created
        self.node = node


class DistributedQuery(SurrogatePK, Model):

    NEW = 0
    PENDING = 1
    COMPLETE = 2

    guid = Column(db.String, nullable=False, unique=True)
    status = Column(db.Integer, default=0, nullable=False)
    sql = Column(db.String, nullable=False)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)
    not_before = Column(db.DateTime, default=dt.datetime.utcnow)
    retrieved = Column(db.DateTime)

    node_id = reference_col('node', nullable=False)
    node = relationship(
        'Node',
        backref=db.backref('distributed_queries', lazy='dynamic'),
    )

    def __init__(self, sql, node=None, not_before=None):
        self.guid = str(uuid.uuid4())
        self.sql = sql
        self.node = node
        self.not_before = not_before


class DistributedQueryResult(SurrogatePK, Model):

    data = Column(JSONBType)
    timestamp = Column(db.DateTime, default=dt.datetime.utcnow)

    distributed_query_id = reference_col('distributed_query', nullable=False)
    distributed_query = relationship(
        'DistributedQuery',
        backref=db.backref('result',
                           uselist=False,
                           cascade='all, delete-orphan',
                           lazy='joined'),
    )

    def __init__(self, data, distributed_query=None):
        self.data = data
        self.distributed_query = distributed_query
