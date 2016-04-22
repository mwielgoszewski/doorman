# -*- coding: utf-8 -*-
from factory import Sequence
from factory.alchemy import SQLAlchemyModelFactory

from doorman.database import db
from doorman.models import Node, Pack, Query, Tag


class BaseFactory(SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = db.session


class NodeFactory(BaseFactory):

    class Meta:
        model = Node


class PackFactory(BaseFactory):

    class Meta:
        model = Pack


class QueryFactory(BaseFactory):

    class Meta:
        model = Query


class TagFactory(BaseFactory):

    class Meta:
        model = Tag