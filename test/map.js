/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {forEach, last, map, reduce} = extensions(Observable);
const map2Times = map(v => 2 * v);

test(t => {
  t.plan(1);
  return pipe(
    map2Times,
    forEach(() => t.fail())
  )(Observable.of())
    .then(() => t.pass());
});

test(t => {
  t.plan(1);
  return pipe(
    map2Times,
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [2]))
  )(Observable.of(1));
});

test(t => {
  t.plan(1);
  return pipe(
    map2Times,
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [2, 4, 6, 8, 10]))
  )(Observable.of(1, 2, 3, 4, 5));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(pipe(
    map2Times,
    forEach(() => t.fail())
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
