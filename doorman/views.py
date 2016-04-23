# -*- coding: utf-8 -*-
from flask import Blueprint, current_app, flash, jsonify, redirect, render_template, request, url_for
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

from doorman.forms import (
    CreateQueryForm,
    UpdateQueryForm,
    CreateTagForm,
    UploadPackForm,
    FilePathForm,
)
from doorman.database import db
from doorman.models import FilePath, Node, Pack, Query, Tag
from doorman.utils import create_query_pack_from_upload


blueprint = Blueprint('manage', __name__,
                      template_folder='./templates/manage',
                      url_prefix='/manage')


@blueprint.context_processor
def inject_models():
    return dict(Node=Node, Pack=Pack, Query=Query, Tag=Tag)


@blueprint.route('/')
def index():
    return render_template('index.html')


@blueprint.route('/nodes')
def nodes():
    nodes = Node.query.all()
    return render_template('nodes.html', nodes=nodes)


@blueprint.route('/nodes/add', methods=['GET', 'POST'])
def add_node():
    return redirect(url_for('.nodes'))


@blueprint.route('/nodes/tagged/<string:tags>')
def nodes_by_tag(tags):
    if tags == 'null':
        nodes = Node.query.filter(Node.tags == None).all()
    else:
        tag_names = [t.strip() for t in tags.split(',')]
        nodes = Node.query.filter(Node.tags.any(Tag.value.in_(tag_names))).all()
    return render_template('nodes.html', nodes=nodes)


@blueprint.route('/node/<int:node_id>')
def get_node(node_id):
    node = Node.query.filter(Node.id == node_id).one()
    return render_template('node.html', node=node)


@blueprint.route('/node/<int:node_id>/tags', methods=['GET', 'POST'])
def tag_node(node_id):
    node = Node.query.filter(Node.id == node_id).one()
    if request.is_xhr and request.method == 'POST':
        node.tags = create_tags(*request.get_json())
        node.save()
        return jsonify({}), 202

    return redirect(url_for('.get_node', node_id=node.id))


@blueprint.route('/packs')
def packs():
    packs = Pack.query.options(joinedload(Pack.queries).joinedload(Query.packs)).all()
    return render_template('packs.html', packs=packs)


@blueprint.route('/packs/add', methods=['GET', 'POST'])
@blueprint.route('/packs/upload', methods=['POST'])
def add_pack():
    form = UploadPackForm()
    if form.validate_on_submit():
        # TODO(andrew-d): validate that the SQL in this query pack is valid
        pack = create_query_pack_from_upload(form.pack)
        return redirect(url_for('.packs', _anchor=pack.name))
    return render_template('pack.html', form=form)


@blueprint.route('/pack/<string:pack_name>/tags', methods=['GET', 'POST'])
def tag_pack(pack_name):
    pack = Pack.query.filter(Pack.name == pack_name).one()
    if request.is_xhr:
        if request.method == 'POST':
            pack.tags = create_tags(*request.get_json())
            pack.save()
        return jsonify(tags=[t.value for t in pack.tags])

    return redirect(url_for('.packs'))


@blueprint.route('/queries')
def queries():
    queries = Query.query.options(joinedload(Query.packs)).all()
    return render_template('queries.html', queries=queries)


@blueprint.route('/queries/add', methods=['GET', 'POST'])
def add_query():
    form = CreateQueryForm()
    form.set_choices()

    if form.validate_on_submit():
        if not validate_osquery_query(form.sql.data):
            flash(u'Invalid osquery query', 'error')
            return render_template('query.html', form=form)

        query = Query(name=form.name.data,
                      sql=form.sql.data,
                      interval=form.interval.data,
                      platform=form.platform.data,
                      version=form.version.data,
                      description=form.description.data,
                      value=form.value.data)
        query.tags = create_tags(*form.tags.data.splitlines())
        query.save()

        return redirect(url_for('.query', query_id=query.id))

    return render_template('query.html', form=form)


@blueprint.route('/queries/tagged/<string:tags>')
def queries_by_tag(tags):
    tag_names = [t.strip() for t in tags.split(',')]
    queries = Query.query.filter(Query.tags.any(Tag.value.in_(tag_names))).all()
    return render_template('queries.html', queries=queries)


@blueprint.route('/query/<int:query_id>', methods=['GET', 'POST'])
def query(query_id):
    query = Query.query.filter(Query.id == query_id).one()
    form = UpdateQueryForm(request.form)

    if form.validate_on_submit():
        if form.packs.data:
            query.packs = Pack.query.filter(Pack.name.in_(form.packs.data)).all()
        else:
            query.packs = []

        query.tags = create_tags(*form.tags.data.splitlines())
        query = query.update(name=form.name.data,
                             sql=form.sql.data,
                             interval=form.interval.data,
                             platform=form.platform.data,
                             version=form.version.data,
                             description=form.description.data,
                             value=form.value.data)
        return redirect(url_for('.query', query_id=query.id))

    form = UpdateQueryForm(request.form, obj=query)
    return render_template('query.html', form=form, query=query)


@blueprint.route('/query/<int:query_id>/tags', methods=['GET', 'POST'])
def tag_query(query_id):
    query = Query.query.filter(Query.id == query_id).one()
    if request.is_xhr:
        if request.method == 'POST':
            query.tags = create_tags(*request.get_json())
            query.save()
        return jsonify(tags=[t.value for t in query.tags])

    return redirect(url_for('.query', query_id=query.id))


@blueprint.route('/files')
def files():
    file_paths = FilePath.query.all()
    return render_template('files.html', file_paths=file_paths)


@blueprint.route('/files/add', methods=['GET', 'POST'])
def add_file():
    form = FilePathForm()
    if form.validate_on_submit():
        FilePath.create(category=form.category.data,
                        target_paths=form.target_paths.data.splitlines())
        return redirect(url_for('.files'))

    return render_template('file.html', form=form)


@blueprint.route('/file/<int:file_path_id>/tags', methods=['GET', 'POST'])
def tag_file(file_path_id):
    file_path = FilePath.query.filter(FilePath.id == file_path_id).one()
    if request.is_xhr:
        if request.method == 'POST':
            file_path.tags = create_tags(*request.get_json())
            file_path.save()
        return jsonify(tags=[t.value for t in file_path.tags])

    return redirect(url_for('.files'))


@blueprint.route('/tags')
def tags():
    if request.is_xhr:
        return jsonify(tags=[t.value for t in Tag.query.all()])
    return render_template('tags.html', tags=Tag.query)


@blueprint.route('/tags/add', methods=['GET', 'POST'])
def add_tag():
    form = CreateTagForm()
    if form.validate_on_submit():
        create_tags(*form.value.data.splitlines())
        return redirect(url_for('.tags'))
    return render_template('tag.html', form=form)


@blueprint.route('/tag/<string:tag_value>')
def get_tag(tag_value):
    tag = Tag.query.filter(Tag.value == tag_value).one()
    return render_template('tag.html', tag=tag)


@blueprint.route('/tag/<string:tag_value>', methods=['DELETE'])
def delete_tag(tag_value):
    tag = Tag.query.filter(Tag.value == tag_value).one()
    tag.delete()
    return jsonify({}), 204


def create_tags(*tags):
    values = []
    existing = []

    # create a set, because we haven't yet done our association_proxy in
    # sqlalchemy

    for value in (v.strip() for v in set(tags) if v.strip()):
        tag = Tag.query.filter(Tag.value == value).first()
        if not tag:
            values.append(Tag.create(value=value))
        else:
            existing.append(tag)
    else:
        if values:
            flash(u"Created tag{0} {1}".format(
                  's' if len(values) > 1 else '',
                  ', '.join(tag.value for tag in values)),
                  'info')
    return values + existing
