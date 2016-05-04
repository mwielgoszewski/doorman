# -*- coding: utf-8 -*-
from datetime import datetime
from time import mktime
import json

from doorman.compat import string_types


class DJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return {
                '__type__': '__datetime__',
                'epoch': int(mktime(obj.timetuple()))
            }
        else:
            return json.JSONEncoder.default(self, obj)


def djson_decoder(obj):
    if '__type__' in obj:
        if obj['__type__'] == '__datetime__':
            return datetime.fromtimestamp(obj['epoch'])
    return obj


# Encoder function
def djson_dumps(obj):
    return json.dumps(obj, cls=DJSONEncoder)


# Decoder function
def djson_loads(s):
    if not isinstance(s, string_types):
        s = s.decode('utf-8')
    return json.loads(s, object_hook=djson_decoder)
