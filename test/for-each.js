/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {identity} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {forEach} = extensions();

test(t => {
  t.plan(1);
  return forEach(() => t.fail())(Observable.of())
    .then(() => t.pass());
});

test(t => {
  t.plan(1);
  return forEach(v => t.is(v, 1))(Observable.of(1));
});

test(t => {
  const context = {count: 0};
  t.plan(5);
  // eslint-disable-next-line fp/no-mutation
  return forEach(v => t.is(v, ++context.count))(Observable.of(1, 2, 3, 4, 5));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(forEach(identity)(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
