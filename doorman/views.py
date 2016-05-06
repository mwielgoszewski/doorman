# -*- coding: utf-8 -*-
import json

from flask import Blueprint, current_app, flash, jsonify, redirect, render_template, request, url_for
from flask_paginate import Pagination

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

from doorman.forms import (
    AddDistributedQueryForm,
    CreateQueryForm,
    UpdateQueryForm,
    CreateTagForm,
    UploadPackForm,
    FilePathForm,
    CreateRuleForm,
    UpdateRuleForm,
)
from doorman.database import db
from doorman.models import DistributedQuery, FilePath, Node, Pack, Query, Tag, Rule
from doorman.tasks import reload_rules
from doorman.utils import create_query_pack_from_upload, flash_errors


blueprint = Blueprint('manage', __name__,
                      template_folder='./templates/manage',
                      url_prefix='/manage')


@blueprint.context_processor
def inject_models():
    return dict(Node=Node, Pack=Pack, Query=Query, Tag=Tag,
                DistributedQuery=DistributedQuery)


@blueprint.route('/')
def index():
    return render_template('index.html')


@blueprint.route('/nodes')
@blueprint.route('/nodes/<int:page>')
def nodes(page=1):
    try:
        per_page = int(request.args.get('pp', 20))
    except Exception:
        per_page = 20

    per_page = max(0, min(20, per_page))

    order_by = request.args.get('order_by', 'id')
    if order_by not in ('id', 'host_identifier', 'enrolled_on', 'last_checkin'):
        order_by = 'id'
    order_by = getattr(Node, order_by)

    sort = request.args.get('sort', 'asc')
    if sort not in ('asc', 'desc'):
        sort = 'asc'

    order_by = getattr(order_by, sort)()

    nodes = Node.query.order_by(order_by).paginate(page=page, per_page=per_page)
    pagination = Pagination(page=page,
                            per_page=per_page,
                            total=nodes.total,
                            alignment='center',
                            show_single_page=True,
                            record_name='nodes',
                            bs_version=3)

    return render_template('nodes.html', nodes=nodes.items,
                           pagination=pagination)


@blueprint.route('/nodes/add', methods=['GET', 'POST'])
def add_node():
    return redirect(url_for('manage.nodes'))


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
    node = Node.query.filter(Node.id == node_id).first_or_404()
    return render_template('node.html', node=node)


@blueprint.route('/node/<int:node_id>/activity')
def node_activity(node_id):
    node = Node.query.filter(Node.id == node_id).first_or_404()
    return render_template('activity.html', node=node)


@blueprint.route('/node/<int:node_id>/tags', methods=['GET', 'POST'])
def tag_node(node_id):
    node = Node.query.filter(Node.id == node_id).first_or_404()
    if request.is_xhr and request.method == 'POST':
        node.tags = create_tags(*request.get_json())
        node.save()
        return jsonify({}), 202

    return redirect(url_for('manage.get_node', node_id=node.id))


@blueprint.route('/node/<int:node_id>/distributed/result/<string:guid>')
def get_distributed_result(node_id, guid):
    node = Node.query.filter(Node.id == node_id).first_or_404()
    query = DistributedQuery.query.filter(
        DistributedQuery.guid == guid,
        DistributedQuery.node == node,
    ).first_or_404()
    return render_template('distributed.result.html', node=node, query=query)


@blueprint.route('/packs')
def packs():
    packs = Pack.query.options(joinedload(Pack.queries).joinedload(Query.packs)).all()
    return render_template('packs.html', packs=packs)


@blueprint.route('/packs/add', methods=['GET', 'POST'])
@blueprint.route('/packs/upload', methods=['POST'])
def add_pack():
    form = UploadPackForm()
    if form.validate_on_submit():
        pack = create_query_pack_from_upload(form.pack)

        # Only redirect back to the pack list if everything was successful
        if pack is not None:
            return redirect(url_for('manage.packs', _anchor=pack.name))

    flash_errors(form)
    return render_template('pack.html', form=form)


@blueprint.route('/pack/<string:pack_name>/tags', methods=['GET', 'POST'])
def tag_pack(pack_name):
    pack = Pack.query.filter(Pack.name == pack_name).first_or_404()
    if request.is_xhr:
        if request.method == 'POST':
            pack.tags = create_tags(*request.get_json())
            pack.save()
        return jsonify(tags=[t.value for t in pack.tags])

    return redirect(url_for('manage.packs'))


@blueprint.route('/queries')
def queries():
    queries = Query.query.options(joinedload(Query.packs)).all()
    return render_template('queries.html', queries=queries)


@blueprint.route('/queries/add', methods=['GET', 'POST'])
def add_query():
    form = CreateQueryForm()
    form.set_choices()

    if form.validate_on_submit():
        query = Query(name=form.name.data,
                      sql=form.sql.data,
                      interval=form.interval.data,
                      platform=form.platform.data,
                      version=form.version.data,
                      description=form.description.data,
                      value=form.value.data,
                      removed=form.removed.data)
        query.tags = create_tags(*form.tags.data.splitlines())
        query.save()

        return redirect(url_for('manage.query', query_id=query.id))

    flash_errors(form)
    return render_template('query.html', form=form)


@blueprint.route('/queries/distributed')
@blueprint.route('/queries/distributed/<any(new, pending, complete):status>')
@blueprint.route('/node/<int:node_id>/distributed/<any(new, pending, complete):status>')
def distributed(node_id=None, status=None):
    if status == 'new':
        queries = DistributedQuery.query.filter(
            DistributedQuery.status == DistributedQuery.NEW)
    elif status == 'pending':
        queries = DistributedQuery.query.filter(
            DistributedQuery.status == DistributedQuery.PENDING)
    elif status == 'complete':
        queries = DistributedQuery.query.filter(
            DistributedQuery.status == DistributedQuery.COMPLETE)
    else:
        queries = DistributedQuery.query

    if node_id:
        node = Node.query.filter(Node.id == node_id).first_or_404()
        queries = queries.filter(DistributedQuery.node_id == node.id)

    return render_template('distributed.html', queries=queries, status=status)


@blueprint.route('/queries/distributed/add', methods=['GET', 'POST'])
def add_distributed():
    form = AddDistributedQueryForm()
    form.set_choices()

    if form.validate_on_submit():
        nodes = []

        if not form.nodes.data and not form.tags.data:
            # all nodes get this query
            nodes = Node.query.all()

        if form.nodes.data:
            nodes.extend(
                Node.query.filter(
                    Node.node_key.in_(form.nodes.data)
                ).all()
            )

        if form.tags.data:
            nodes.extend(
                Node.query.filter(
                    Node.tags.any(
                        Tag.value.in_(tag_names)
                    )
                ).all()
            )

        for node in nodes:
            query = DistributedQuery(sql=form.sql.data,
                                     node=node,
                                     not_before=form.not_before.data)
            db.session.add(query)
        else:
            db.session.commit()

        return redirect(url_for('manage.distributed', status='new'))

    flash_errors(form)
    return render_template('distributed.html', form=form)


@blueprint.route('/queries/tagged/<string:tags>')
def queries_by_tag(tags):
    tag_names = [t.strip() for t in tags.split(',')]
    queries = Query.query.filter(Query.tags.any(Tag.value.in_(tag_names))).all()
    return render_template('queries.html', queries=queries)


@blueprint.route('/query/<int:query_id>', methods=['GET', 'POST'])
def query(query_id):
    query = Query.query.filter(Query.id == query_id).first_or_404()
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
                             value=form.value.data,
                             removed=form.removed.data)
        return redirect(url_for('manage.query', query_id=query.id))

    form = UpdateQueryForm(request.form, obj=query)
    flash_errors(form)
    return render_template('query.html', form=form, query=query)


@blueprint.route('/query/<int:query_id>/tags', methods=['GET', 'POST'])
def tag_query(query_id):
    query = Query.query.filter(Query.id == query_id).first_or_404()
    if request.is_xhr:
        if request.method == 'POST':
            query.tags = create_tags(*request.get_json())
            query.save()
        return jsonify(tags=[t.value for t in query.tags])

    return redirect(url_for('manage.query', query_id=query.id))


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
        return redirect(url_for('manage.files'))

    flash_errors(form)
    return render_template('file.html', form=form)


@blueprint.route('/file/<int:file_path_id>/tags', methods=['GET', 'POST'])
def tag_file(file_path_id):
    file_path = FilePath.query.filter(FilePath.id == file_path_id).first_or_404()
    if request.is_xhr:
        if request.method == 'POST':
            file_path.tags = create_tags(*request.get_json())
            file_path.save()
        return jsonify(tags=[t.value for t in file_path.tags])

    return redirect(url_for('manage.files'))


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
        return redirect(url_for('manage.tags'))

    flash_errors(form)
    return render_template('tag.html', form=form)


@blueprint.route('/tag/<string:tag_value>')
def get_tag(tag_value):
    tag = Tag.query.filter(Tag.value == tag_value).first_or_404()
    return render_template('tag.html', tag=tag)


@blueprint.route('/tag/<string:tag_value>', methods=['DELETE'])
def delete_tag(tag_value):
    tag = Tag.query.filter(Tag.value == tag_value).first_or_404()
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


@blueprint.route('/rules')
def rules():
    rules = Rule.query.all()
    return render_template('rules.html', rules=rules)


@blueprint.route('/rules/add', methods=['GET', 'POST'])
def add_rule():
    form = CreateRuleForm()
    form.set_choices()

    if form.validate_on_submit():
        rule = Rule(type=form.type.data,
                    name=form.name.data,
                    action=form.action.data,
                    alerters=form.alerters.data,
                    config=form.config.data)
        rule.save()
        reload_rules.delay()

        return redirect(url_for('manage.rule', rule_id=rule.id))

    flash_errors(form)
    return render_template('rule.html', form=form)


@blueprint.route('/rules/<int:rule_id>', methods=['GET', 'POST'])
def rule(rule_id):
    rule = Rule.query.filter(Rule.id == rule_id).first_or_404()
    form = UpdateRuleForm(request.form)

    if form.validate_on_submit():
        rule = rule.update(type=form.type.data,
                           name=form.name.data,
                           action=form.action.data,
                           alerters=form.alerters.data,
                           config=form.config.data)
        reload_rules.delay()
        return redirect(url_for('manage.rule', rule_id=rule.id))

    form = UpdateRuleForm(request.form, obj=rule)
    flash_errors(form)
    return render_template('rule.html', form=form, rule=rule)
