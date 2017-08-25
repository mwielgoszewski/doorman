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
    'fuzz_paths',
    'WINDOWS',
]


def table_name(name, aliases=None):
    current_spec['name'] = name
    current_spec['aliases'] = aliases


def Column(name, col_type, *args, **kwargs):
    return (name, col_type)


def schema(schema):
    # Filter out 'None' entries (usually from ForeignKeys)
    real_schema = [x for x in schema if x is not None]
    current_spec['schema'] = real_schema

def extended_schema(macro, schema):
    # Filter out 'None' entries (usually from ForeignKeys)
    real_schema = [x for x in schema if x is not None]
    current_spec['extended_schema'] = real_schema

def extract_schema(filename):
    namespace = {
        'Column': Column,
        'schema': schema,
        'table_name': table_name,
        'extended_schema': extended_schema,
        'current_spec': {},
    }

    for fn in DUMMY_FUNCTIONS:
        namespace[fn] = lambda *args, **kwargs: None

    for ty in SQL_TYPES:
        namespace[ty] = ty

    with open(filename, 'rU') as f:
        tree = ast.parse(f.read())
        exec(compile(tree, '<string>', 'exec'), namespace)

    columns = ', '.join('%s %s' % (x[0], x[1]) for x in current_spec['schema'])
    statements = []
    statements = []
    statements.append('CREATE TABLE %s (%s);' % (current_spec['name'], columns))
    if 'extended_schema' in current_spec:
        statement = 'ALTER TABLE %s ADD %%s %%s' % (current_spec['name'], )
        for column_name, column_definition in current_spec['extended_schema']:
            statements.append(statement % (column_name, column_definition))
        del current_spec['extended_schema']
    return '\n'.join(statements)


if __name__ == '__main__':
    import sys
    print extract_schema(sys.argv[1])
