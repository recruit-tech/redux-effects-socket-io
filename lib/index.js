'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SOCKET_IO = undefined;
exports.connect = connect;
exports.disconnect = disconnect;
exports.emit = emit;
exports.send = send;
exports.on = on;
exports.default = socketioMiddleware;

var _reduxActions = require('redux-actions');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Action types
 */
var SOCKET_IO = exports.SOCKET_IO = 'EFFECT_SOCKET_IO';

function connect(conf) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'connect',
      conf: conf
    }
  };
}

function disconnect() {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'disconnect'
    }
  };
}

function emit(event, data) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'emit',
      event: event,
      data: data
    }
  };
}

function send(data) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'send',
      data: data
    }
  };
}

function on(event, listenerAction) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'on',
      event: event,
      listenerAction: listenerAction
    }
  };
}

/**
 * socket.io middleware
 */
function socketioMiddleware(config) {
  var hostname = config && config.hostname || location.host;
  var socket = null;
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        if (action.type !== SOCKET_IO) {
          return next(action);
        }

        switch (action.payload.operation) {
          case 'connect':
            var conf = Object.assign(action.payload.conf, config);
            if (!socket) {
              socket = (0, _socket2.default)(hostname, conf);
            }

            break;
          case 'disconnect':
            if (!socket) {
              throw new Error('need to connect first');
            }

            socket.disconnect();
            socket = null;
            break;
          case 'emit':
            if (!socket) {
              throw new Error('need to connect first');
            }

            socket.emit(action.payload.event, action.payload.data);
            break;
          case 'on':
            if (!socket) {
              throw new Error('need to connect first');
            }

            socket.on(action.payload.event, function (data) {
              return dispatch(action.payload.listenerAction(data));
            });
            break;
          case 'send':
            if (!socket) {
              throw new Error('need to connect first');
            }

            socket.send(action.payload.data);
            break;
        }
      };
    };
  };
}