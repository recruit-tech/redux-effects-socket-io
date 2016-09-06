# redux-effects-socket-io
[![Build Status](https://travis-ci.org/recruit-tech/redux-effects-socket-io.svg?branch=master)](https://travis-ci.org/recruit-tech/redux-effects-socket-io)

[`socket.io`](socket.io) binding for `redux-effects` family.

# Install

```
$ npm install redux-effects-socket-io --save
```

# Usage

Register `redux-effects-socket-io` as middleware

```javascript
import { createStore, applyMiddleware } from 'redux';
import stepsMiddleware from 'redux-effects-steps';
import socketio from 'redux-effects-socket-io';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(
    stepsMiddleware,
    // specify hostname default location.host
    socketio({ hostname: 'localhost:3010'})
  )
);
```

Usage `redux-effects-socket-io` as client

```javascript
import { createAction } from 'redux-actions';
import { steps } from 'redux-effects-steps';
import { connect, emit, on } from 'redux-effects-socket-io';

const ON_MESSAGE = 'on_message';

const onMessage = createAction(ON_MESSAGE, (data) => ({ data }));

const EMIT_MESSAGE = 'emit_message';

const emitMessage = createAction(EMIT_MESSAGE, (data) => ({ data }));

function onMessage(event) {
  return steps(
    connect(),
    on(event, onMessageChat)
  );
}

function emitMessage(event, data) {
  retrun emit(event, data);
}
```

Use from component

```javascript
const promise = store.dispatch(onMessage('message'));
```

# API

## connect(config = {}) 

connect to `socket.io` server.

## emit(event, data) 

emit event and data to `socket.io` server.

## on(event, action) 

receive event and send action event

## disconnect() 

disconnect from `socket.io` server.
