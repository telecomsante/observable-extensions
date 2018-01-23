
/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import timedObservable from './helpers/timed-observable';
import extensions from '..';

const {debounce} = extensions(Observable);

test(t => {
  t.plan(1);
  return debounce(10)(Observable.of())
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, []));
});

test(t => {
  t.plan(1);
  return debounce(20)(timedObservable([[1, 10], [2, 20], [3, 30]]))
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [3]));
});

test(t => {
  t.plan(1);
  return debounce(40)(timedObservable([[1, 10], [2, 20], [3, 30], [15, 150], [16, 160]]))
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [3, 16]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(debounce(10)(new Observable(observer => observer.error(new Error('test'))))
    .forEach(() => t.fail()), Error, 'test');
});
