import { test } from 'eater/runner';
import socketioMiddleware, {emit, on, connect, disconnect, send} from '../src/';
import assert from 'assert';
import mustCall from 'must-call';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import plzPort from 'plz-port';

test('simple message echo test', (done) => {
  plzPort().then((port) => {
    const server = require('./support/server.js')(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({ 
        hostname: `http://localhost:${port}` 
      })),
    );
    const onMessage = createAction('on_message', mustCall((data) => { 
      assert(data === 'hello world');
      store.dispatch(disconnect());
      server.close();
    }));
    store.dispatch(connect({}));
    store.dispatch(on('message', onMessage));
    store.dispatch(emit('message', 'hello world'));  
  });
});

test('message connection/emit/disconnect test', (done) => {
  plzPort().then((port) => {
    const server = require('./support/server.js')(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({ 
        hostname: `http://localhost:${port}` 
      })),
    );
    const onConnect = createAction('on_connect', mustCall(() => { }));
    const onMessage = createAction('on_message', mustCall((data) => { 
      assert.deepEqual(data, { foo: 'bar' });
      store.dispatch(disconnect());
    }));
    const onDisconnect = createAction('on_disconnect', mustCall(() => { 
      server.close();
    }));
    store.dispatch(connect({}));
    store.dispatch(on('connect', onConnect));
    store.dispatch(on('disconnect', onDisconnect));
    store.dispatch(on('message', onMessage));
    store.dispatch(emit('message', { foo: 'bar' }));  
  });
});

test('message send test', (done) => {
  plzPort().then((port) => {
    const server = require('./support/server.js')(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({ 
        hostname: `http://localhost:${port}` 
      })),
    );
    const onConnect = createAction('on_connect', mustCall(() => { }));
    const onMessage = createAction('on_message', mustCall((data) => { 
      assert.deepEqual(data, { foo: 'bar' });
      store.dispatch(disconnect());
    }));
    const onDisconnect = createAction('on_disconnect', mustCall(() => { 
      server.close();
    }));
    store.dispatch(connect({}));
    store.dispatch(on('connect', onConnect));
    store.dispatch(on('disconnect', onDisconnect));
    store.dispatch(on('message', onMessage));
    store.dispatch(send({ foo: 'bar' }));  
  });
});

