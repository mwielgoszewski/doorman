# -*- coding: utf-8 -*-
import datetime as dt
import pytest

from doorman.models import Node, Pack, Query, Tag, FilePath

from .factories import NodeFactory, PackFactory, QueryFactory, TagFactory


@pytest.mark.usefixtures('db')
class TestNode:

    def test_factory(self, db):
        node = NodeFactory(host_identifier='foo')
        db.session.commit()
        assert node.node_key is not None
        assert node.host_identifier == 'foo'

    def test_tags(self):
        tag = Tag.create(value='foo')
        node = NodeFactory(host_identifier='foo')
        node.tags.append(tag)
        node.save()
        assert tag in node.tags

    def test_config(self):
        node = NodeFactory(host_identifier='foo')
        tag = Tag.create(value='foo')
        node.tags.append(tag)
        node.save()

        query1 = Query.create(name='bar', sql='select * from osquery_info;')
        query2 = Query.create(name='foobar', sql='select * from system_info;')
        query2.tags.append(tag)
        query2.save()

        pack = Pack.create(name='baz')
        pack.queries.append(query1)
        pack.tags.append(tag)
        pack.save()

        file_path = FilePath.create(category='foobar', target_paths=[
            '/home/foobar/%%',
        ])
        file_path.tags.append(tag)
        file_path.save()

        assert tag in pack.tags
        assert tag in query2.tags
        assert tag in file_path.tags
        assert tag not in query1.tags
        assert query1 in pack.queries
        assert query2 not in pack.queries

        assert pack in node.packs
        assert query2 in node.queries
        assert query1 not in node.queries

        config = node.get_config()

        assert pack.name in config['packs']
        assert query1.name in config['packs'][pack.name]['queries']
        assert query1.sql == config['packs'][pack.name]['queries'][query1.name]['query']

        assert query2.name not in config['packs']
        assert query2.name in config['schedule']
        assert query2.sql == config['schedule'][query2.name]['query']

        assert file_path.category in config['file_paths']


@pytest.mark.usefixtures('db')
class TestQuery:

    def test_factory(self, db):
        query = QueryFactory(name='foobar', query='select * from foobar;')
        db.session.commit()

        assert query.name == 'foobar'
        assert query.sql == 'select * from foobar;'


@pytest.mark.usefixtures('db')
class TestFilePath:
    def test_create(self):
        target_paths = [
            '/root/.ssh/%%',
            '/home/.ssh/%%',
        ]

        file_path = FilePath.create(category='foobar', target_paths=target_paths)
        assert file_path.to_dict() == {'foobar': target_paths}

    def test_update(self):
        target_paths = [
            '/root/.ssh/%%',
            '/home/.ssh/%%',
        ]

        file_path = FilePath.create(category='foobar', target_paths=target_paths)
        assert file_path.to_dict() == {'foobar': target_paths}

        target_paths.append('/etc/%%')
        file_path.set_paths(*target_paths)
        file_path.save()
        assert file_path.to_dict() == {'foobar': target_paths}
