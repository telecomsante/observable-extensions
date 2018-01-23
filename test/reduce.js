/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import extensions from '..';

const {reduce} = extensions(Observable);

test(t => {
  t.plan(1);
  return reduce((a, v) => a + v, 0)(Observable.of())
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [0]));
});

test(t => {
  t.plan(1);
  return reduce((a, v) => a + v, 0)(Observable.of(1, 2, 3, 4, 5))
    .reduce((a, v) => [...a, v], [])
    .forEach(r => t.deepEqual(r, [0, 1, 3, 6, 10, 15]));
});

test(t => {
  // initial value + error
  t.plan(2);
  return t.throws(reduce((a, v) => a + v, 0)(new Observable(observer => observer.error(new Error('test'))))
    .forEach(v => t.is(v, 0)), Error, 'test');
});
