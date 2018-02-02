/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {filter, forEach, last, reduce} = extensions(Observable);
const keepEven = filter(v => v % 2 === 0);

test(t => {
  t.plan(1);
  return pipe(
    keepEven,
    forEach(() => t.fail())
  )(Observable.of()).then(() => t.pass());
});

test(t => {
  t.plan(1);
  return pipe(
    keepEven,
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, []))
  )(Observable.of(1));
});

test(t => {
  t.plan(1);
  return pipe(
    keepEven,
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [2]))
  )(Observable.of(2));
});

test(t => {
  t.plan(1);
  return pipe(
    keepEven,
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [2, 4]))
  )(Observable.of(1, 2, 3, 4, 5));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(pipe(
    keepEven,
    forEach(() => t.fail())
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
