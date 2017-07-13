import { test } from 'eater/runner';
import assert from 'assert';
import mustCall from 'must-call';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import plzPort from 'plz-port';
import socketioMiddleware, { emit, on, connect, disconnect, send, off } from '../src/';
import serverFactory from './support/server';

test('simple message echo test', (done) => {
  plzPort().then((port) => {
    const server = serverFactory(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({
        hostname: `http://localhost:${port}`,
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
    const server = serverFactory(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({
        hostname: `http://localhost:${port}`,
      })),
    );
    const onConnect = createAction('on_connect', mustCall(() => {
    }));
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
    const server = serverFactory(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({
        hostname: `http://localhost:${port}`,
      })),
    );
    const onConnect = createAction('on_connect', mustCall(() => {
    }));
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

test('message off test', (done) => {
  plzPort().then((port) => {
    const server = serverFactory(port);
    const store = createStore(
      () => null,
      {},
      applyMiddleware(socketioMiddleware({
        hostname: `http://localhost:${port}`,
      })),
    );
    const onConnect = createAction('on_connect', mustCall(() => {
    }));
    const onMessage = createAction('on_message', mustCall(() => {
      store.dispatch(disconnect());
    }));
    const onMessage2 = createAction('on_message2', () => {
      assert.fail('should not be reached here');
    });
    const onDisconnect = createAction('on_disconnect', mustCall(() => {
      server.close();
    }));
    store.dispatch(connect());
    store.dispatch(on('connect', onConnect));
    store.dispatch(on('disconnect', onDisconnect));
    store.dispatch(on('message', onMessage));
    store.dispatch(on('message2', onMessage2));
    store.dispatch(off('message2'));
    store.dispatch(emit('message2', 'test'));
    store.dispatch(emit('message', 'close me'));
  });
});

