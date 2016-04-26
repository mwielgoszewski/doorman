from copy import copy
import time

from doorman.utils import quote
from doorman.plugins.logs.base import AbstractLogsPlugin


class Plugin(AbstractLogsPlugin):
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

    def _node_fields(self, node):
        """Returns an node fields that we want to log."""
        return 'host_identifier={0}'.format(node.host_identifier)

    def _join_fields(self, fields):
        parts = []
        for name, val in fields.items():
            if not isinstance(val, str):
                val = str(val)
            parts.append(name + '=' + quote(val))

        return ', '.join(parts)

    def handle_status(self, log):
        if self.status is None:
            return

        fields = {
            'line':     log.line,
            'message':  log.message,
            'severity': log.severity,
            'filename': log.filename,
            'created':  time.mktime(log.created.timetuple()),
        }

        self.status.write(self._node_fields(log.node) + ', ' + self._join_fields(fields) + '\n')

    def handle_result(self, log):
        if self.result is None:
            return

        fields = {
            'name':      log.name,
            'timestamp': time.mktime(log.timestamp.timetuple()),
        }
        base = self._node_fields(log.node) + ', ' + self._join_fields(fields)

        for entry in log.added:
            curr_fields = {'result_type': 'added'}
            for key, val in entry.items():
                curr_fields['added_' + key] = val

            self.result.write(base + ', ' + self._join_fields(curr_fields) + '\n')

        for entry in log.removed:
            curr_fields = {'result_type': 'removed'}
            for key, val in entry.items():
                curr_fields['removed_' + key] = val

            self.result.write(base + ', ' + self._join_fields(curr_fields) + '\n')
