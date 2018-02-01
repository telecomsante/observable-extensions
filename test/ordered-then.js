/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import extensions from '..';

const then = extensions(Observable).then(true);
const wait = ms => value => new Promise(resolve => setTimeout(() => resolve(value), ms));

test(t => {
  t.plan(1);
  return then(Observable.of())
    .forEach(() => t.fail())
    .then(() => t.pass());
});

test(t => {
  t.plan(1);
  return then(Observable.of(1))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1]));
});

test(t => {
  t.plan(1);
  return then(Observable.of(1, 2))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1, 2]));
});

test(t => {
  t.plan(1);
  return then(Observable.of(Promise.resolve(1).then(wait(100))))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1]));
});

test(t => {
  t.plan(1);
  return then(Observable.of(
    Promise.resolve(1).then(wait(100)),
    Promise.resolve(2).then(wait(200))
  ))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1, 2]));
});

test(t => {
  t.plan(1);
  return then(Observable.of(
    Promise.resolve(1).then(wait(200)),
    Promise.resolve(2).then(wait(100))
  ))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1, 2]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(then(new Observable(observer => observer.error(new Error('test'))))
    .forEach(() => t.fail()), Error, 'test');
});

test(t => {
  // error
  t.plan(1);
  return t.throws(then(Observable.of(Promise.reject(new Error('test'))))
    .forEach(() => t.fail()), Error, 'test');
});
