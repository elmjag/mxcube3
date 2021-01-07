from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from flask_socketio import emit, join_room, leave_room
from mxcube3 import socketio
from mxcube3 import app as mxcube
from mxcube3 import server
from mxcube3.core import loginutils

import json


def flush():
    mxcube.UI_STATE = dict()


def init():
    @socketio.on("connect", namespace="/ui_state")
    @server.ws_restrict
    def connect():
        pass

    @socketio.on("disconnect", namespace="/ui_state")
    @server.ws_restrict
    def disconnect():
        pass

    @socketio.on("ui_state_get", namespace="/ui_state")
    @server.ws_restrict
    def ui_state_get(k):
        k = k.replace("reduxPersist:", "")
        # print 'ui state GET',k,'returning:',STATE[k]
        return json.dumps(mxcube.UI_STATE[k])

    @socketio.on("ui_state_rm", namespace="/ui_state")
    @server.ws_restrict
    def ui_state_rm(k):
        k = k.replace("reduxPersist:", "")
        # print 'ui state REMOVE',k
        del mxcube.UI_STATE[k]

    @socketio.on("ui_state_set", namespace="/ui_state")
    @server.ws_restrict
    def ui_state_update(key_val):
        key, val = key_val
        mxcube.UI_STATE[key.replace("reduxPersist:", "")] = json.loads(val)
        
        emit(
            "state_update",
            json.dumps(mxcube.UI_STATE),
            namespace="/ui_state",
            broadcast=True,
            include_self=False 
        )

    @socketio.on("ui_state_getkeys", namespace="/ui_state")
    @server.ws_restrict
    def ui_state_getkeys(*args):
        return ["reduxPersist:" + k for k in mxcube.UI_STATE.keys()]
