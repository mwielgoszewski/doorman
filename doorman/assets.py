# -*- coding: utf-8 -*-
from flask_assets import Bundle, Environment

css = Bundle(
    Bundle('css/bootstrap.less',
           output='css/bootstrap.css',
           filters='less',
    ),
    'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
    'css/style.css',
    filters='cssmin',
    output='public/css/common.css',
)

js = Bundle(
    'libs/jQuery/dist/jquery.js',
    'libs/bootstrap/dist/js/bootstrap.js',
    'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
    'js/plugins.js',
    filters='jsmin',
    output='public/js/common.js',
)

assets = Environment()

assets.register('js_all', js)
assets.register('css_all', css)
