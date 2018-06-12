# -*- coding: utf-8 -*-
from flask_assets import Bundle, Environment

css = Bundle(
    Bundle('css/bootstrap.less',
           depends=('**/*.less'),
           output='css/bootstrap.css',
           filters='less',
    ),
    'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
    'libs/bootstrap-vertical-tabs/bootstrap.vertical-tabs.css',
    'libs/jQuery-QueryBuilder/dist/css/query-builder.default.css',
    'css/style.css',
    filters='cssmin',
    output='public/css/common.css',
)

js = Bundle(
    'libs/jQuery/dist/jquery.js',
    'libs/bootstrap/dist/js/bootstrap.js',
    'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
    'libs/jquery-extendext/jQuery.extendext.js',
    'libs/jQuery-QueryBuilder/dist/js/query-builder.standalone.js',
    'libs/interact/interact.js',
    'js/plugins.js',
    filters='jsmin',
    output='public/js/common.js',
)

assets = Environment()

assets.register('js_all', js)
assets.register('css_all', css)
