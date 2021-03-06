/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import timedObservable from './helpers/timed-observable';
import extensions from '..';

const {debounce, forEach, last, reduce} = extensions(Observable);

test(t => {
  t.plan(1);
  return pipe(
    debounce(10),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, []))
  )(Observable.of());
});

test(t => {
  t.plan(1);
  return pipe(
    debounce(20),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, [3]))
  )(timedObservable([[1, 10], [2, 20], [3, 30]]));
});

test(t => {
  t.plan(1);
  return pipe(
    debounce(40),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(r => t.deepEqual(r, [3, 16]))
  )(timedObservable([[1, 10], [2, 20], [3, 30], [15, 150], [16, 160]]));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(pipe(
    debounce(10),
    forEach(() => t.fail())
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
