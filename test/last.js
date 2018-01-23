/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import extensions from '..';

const {last} = extensions(Observable);

test(t => {
  t.plan(1);
  return last(Observable.of())
    .forEach(() => t.fail())
    .then(() => t.pass());
});

test(t => {
  t.plan(1);
  return last(Observable.of(1))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [1]));
});

test(t => {
  t.plan(1);
  return last(Observable.of(1, 2))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [2]));
});

test(t => {
  t.plan(1);
  return last(Observable.of(1, 2, 3, 4, 5))
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [5]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(last(new Observable(observer => observer.error(new Error('test'))))
    .forEach(() => t.fail()), Error, 'test');
});
