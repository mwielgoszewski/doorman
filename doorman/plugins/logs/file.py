from copy import copy
import time
import datetime as dt

from doorman.utils import quote, extract_results
from doorman.plugins.logs.base import AbstractLogsPlugin


class LogPlugin(AbstractLogsPlugin):
    def __init__(self, config):
        append = config.setdefault('DOORMAN_LOG_FILE_PLUGIN_APPEND', True)
        status_path = config.get('DOORMAN_LOG_FILE_PLUGIN_STATUS_LOG')
        result_path = config.get('DOORMAN_LOG_FILE_PLUGIN_RESULT_LOG')

        if append:
            mode = 'a'
        else:
            mode = 'w'

        if status_path:
            self.status = open(status_path, mode)
        else:
            self.status = None

        if result_path:
            self.result = open(result_path, mode)
        else:
            self.result = None

    @property
    def name(self):
        return "file"

    def join_fields(self, fields):
        parts = []
        for name, val in fields.items():
            if not isinstance(val, str):
                val = str(val)
            parts.append(name + '=' + quote(val))

        return ', '.join(parts)

    def handle_status(self, data, **kwargs):
        if self.status is None:
            return

        # Write each status log on a different line
        for item in data.get('data', []):
            fields = {}
            fields.update(kwargs)
            fields.update({
                'line':     item.get('line', ''),
                'message':  item.get('message', ''),
                'severity': item.get('severity', ''),
                'filename': item.get('filename', ''),
            })

            if 'created' in item:
                fields['created'] = time.mktime(item['created'].timetuple())
            else:
                fields['created'] = time.mktime(dt.datetime.utcnow().timetuple())

            self.status.write(self.join_fields(fields) + '\n')

    def handle_result(self, data, **kwargs):
        if self.result is None:
            return

        # Process each result individually
        for item in extract_results(data):
            fields = {}
            fields.update(kwargs)
            fields.update({
                'name': item.get('name', ''),
            })

            if 'timestamp' in item:
                fields['timestamp'] = time.mktime(item['timestamp'].timetuple())
            else:
                fields['timestamp'] = time.mktime(dt.datetime.utcnow().timetuple())

            base = self.join_fields(fields)

            # Write each added/removed entry on a different line
            for entry in item['added']:
                curr_fields = {'result_type': 'added'}
                for key, val in entry.items():
                    curr_fields['added_' + key] = val

                self.result.write(base + ', ' + self.join_fields(curr_fields) + '\n')

            for entry in item['removed']:
                curr_fields = {'result_type': 'removed'}
                for key, val in entry.items():
                    curr_fields['removed_' + key] = val

                self.result.write(base + ', ' + self.join_fields(curr_fields) + '\n')
