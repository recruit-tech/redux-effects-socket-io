import { createAction } from 'redux-actions';
import io from 'socket.io-client';

/**
 * Action types
 */
export const SOCKET_IO = 'EFFECT_SOCKET_IO';

export function connect(conf) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'connect',
      conf,
    },
  };
}

export function disconnect() {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'disconnect',
    },
  };
}

export function emit(event, data) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'emit',
      event,
      data,
    },
  };
}

export function send(data) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'send',
      data,
    },
  };
}

export function on(event, listenerAction) {
  return {
    type: SOCKET_IO,
    payload: {
      operation: 'on',
      event,
      listenerAction,
    },
  };
}

/**
 * socket.io middleware
 */
export default function socketioMiddleware(config) {
  const hostname = (config && config.hostname) || location.host;
  let socket = null;
  return ({ dispatch }) => (next) => (action) => {
    if (action.type !== SOCKET_IO) {
      return next(action);
    }

    switch (action.payload.operation) {
      case 'connect':
        const conf = Object.assign(action.payload.conf, config);
        if (!socket) {
          socket = io(hostname, conf);
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

        socket.on(action.payload.event, (data) => dispatch(action.payload.listenerAction(data)));
        break;
      case 'send':
        if (!socket) {
          throw new Error('need to connect first');
        }

        socket.send(action.payload.data);
        break;
    }
  };
}
