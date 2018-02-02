/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import timedObservable from './helpers/timed-observable';
import extensions from '..';

const {forEach, last, reduce, repeat} = extensions(Observable);

test(t => {
  t.plan(1);
  return pipe(
    repeat(10),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, []))
  )(Observable.of());
});

test(t => {
  t.plan(1);
  return pipe(
    repeat(20),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, [1]))
  )(timedObservable([[1, 10]]));
});

test(t => {
  t.plan(1);
  return pipe(
    repeat(100),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, [1, 1, 17, 17, 31]))
  )(timedObservable([[1, 10], [17, 170], [31, 310]]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(pipe(
    repeat(10),
    forEach(() => t.fail())
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
