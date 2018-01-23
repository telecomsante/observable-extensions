/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import timedObservable from './helpers/timed-observable';
import extensions from '..';

const {repeat} = extensions(Observable);

test(t => {
  t.plan(1);
  return repeat(10)(Observable.of())
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, []));
});

test(t => {
  t.plan(1);
  return repeat(20)(timedObservable([[1, 10]]))
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [1]));
});

test(t => {
  t.plan(1);
  return repeat(100)(timedObservable([[1, 10], [17, 170], [31, 310]]))
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [1, 1, 17, 17, 31]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(repeat(10)(new Observable(observer => observer.error(new Error('test'))))
    .forEach(() => t.fail()), Error, 'test');
});
