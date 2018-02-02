/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {forEach, reduce} = extensions(Observable);

test(t => {
  t.plan(1);
  return pipe(
    reduce((a, v) => a + v, 0),
    forEach(v => t.is(v, 0))
  )(Observable.of());
});

test(t => {
  const sample = [0, 1, 3, 6, 10, 15];
  const context = {index: 0};
  t.plan(6);
  return pipe(
    reduce((a, v) => a + v, 0),
    // eslint-disable-next-line fp/no-mutation
    forEach(v => t.is(v, sample[context.index++]))
  )(Observable.of(1, 2, 3, 4, 5));
});

test(t => {
  // initial value + error
  t.plan(2);
  return t.throws(pipe(
    reduce((a, v) => a + v, 0),
    forEach(v => t.is(v, 0))
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
