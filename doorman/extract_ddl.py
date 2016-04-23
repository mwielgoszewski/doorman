# -*- coding: utf-8 -*-
import ast


# This has to be a global due to `exec` shenanigans :-(
current_spec = {}

# SQL types
SQL_TYPES = [
    'TEXT',
    'DATE',
    'DATETIME',
    'INTEGER',
    'BIGINT',
    'UNSIGNED_BIGINT',
    'DOUBLE',
    'BLOB',
]

# Functions that we don't need
DUMMY_FUNCTIONS = [
    'ForeignKey',
    'attributes',
    'description',
    'examples',
    'implementation',
]


def table_name(name):
    current_spec['name'] = name


def Column(name, col_type, *args, **kwargs):
    return (name, col_type)


def schema(schema):
    # Filter out 'None' entries (usually from ForeignKeys)
    real_schema = [x for x in schema if x is not None]
    current_spec['schema'] = real_schema


do_nothing = lambda *args, **kwargs: None


def extract_schema(filename):
    namespace = {
        'Column': Column,
        'schema': schema,
        'table_name': table_name,

        'current_spec': {},
    }

    for fn in DUMMY_FUNCTIONS:
        namespace[fn] = do_nothing

    for ty in SQL_TYPES:
        namespace[ty] = ty

    with open(filename, 'rU') as f:
        tree = ast.parse(f.read())
        exec compile(tree, '<string>', 'exec') in namespace

    columns = ', '.join('%s %s' % (x[0], x[1]) for x in current_spec['schema'])
    return 'CREATE TABLE %s (%s);' % (current_spec['name'], columns)
