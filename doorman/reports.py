# -*- coding: utf-8 -*-
from sqlalchemy import and_, or_
from doorman.models import Node, Pack, Query, Tag


def get_coverage_report():
    report = {}

    report['nodes'] = total_nodes = Node.query.count()
    report['packs'] = total_packs = Pack.query.count()
    report['queries'] = total_queries = Query.query.count()

    report['coverage'] = coverage = {}

    node_coverage = {}
    for node in Node.query:
        node_coverage[node.id] = get_coverage_report_for_node(node,
            total_queries=total_queries, total_packs=total_packs)

    total_effective_queries = sum(c['effective_queries'] for c in node_coverage.values())

    query_coverage = float(total_effective_queries) / (total_queries * total_nodes)

    coverage['queries'] = query_coverage
    coverage['nodes'] = node_coverage

    return report


def get_coverage_report_for_node(node, total_queries=None, total_packs=None):
    report = {}

    if not total_queries:
        total_queries = Query.query.count()
    if not total_packs:
        total_packs = Pack.query.count()

    num_packs = node.packs.count()
    num_queries = node.queries.count()

    report['packs'] = num_packs
    report['total_packs'] = total_packs
    report['packs_percent'] = (float(num_packs) / total_packs) * 100

    report['queries'] = num_queries
    report['total_queries'] = total_queries
    report['queries_percent'] = (float(num_queries) / total_queries) * 100

    tags = [t.value for t in node.tags]

    effective_queries = Query.query \
        .filter(
            or_(
                Query.packs.any(
                    Pack.tags.any(
                        Tag.value.in_(tags)
                    )
                ),
                Query.tags.any(
                    Tag.value.in_(tags)
                )
            )
        ).distinct().count()
    report['effective_queries'] = effective_queries
    report['effective_queries_percent'] = (float(effective_queries) / total_queries) * 100

    return report


def get_coverage_report_for_query(query, total_nodes=None, total_packs=None):
    report = {}

    if not total_nodes:
        total_nodes = Node.query.count()
    if not total_packs:
        total_packs = Pack.query.count()

    num_packs = len(query.packs)

    report['packs'] = num_packs
    report['packs_percent'] = (float(num_packs) / total_packs) * 100

    report['total_nodes'] = total_nodes

    tags = [t.value for t in query.tags]

    effective_nodes = Node.query \
        .filter(
            or_(
                Node.tags.any(
                    Tag.value.in_(tags)
                ),

                Pack.tags.any(
                    Tag.value.in_(tags)
                )

            )
        ).distinct().count()

    report['effective_nodes'] = effective_nodes
    report['effective_nodes_percent'] = (float(effective_nodes) / total_nodes) * 100

    return report
