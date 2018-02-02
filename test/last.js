/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {forEach, last} = extensions(Observable);

test(t => {
  t.plan(1);
  return pipe(
    last,
    forEach(() => t.fail())
  )(Observable.of()).then(() => t.pass());
});

test(t => {
  t.plan(1);
  return pipe(
    last,
    forEach(v => t.is(v, 1))
  )(Observable.of(1));
});

test(t => {
  t.plan(1);
  return pipe(
    last,
    forEach(v => t.is(v, 2))
  )(Observable.of(1, 2));
});

test(t => {
  t.plan(1);
  return pipe(
    last,
    forEach(v => t.is(v, 5))
  )(Observable.of(1, 2, 3, 4, 5));
});

test(t => {
  // error
  t.plan(1);
  return t.throws(pipe(
    last,
    forEach(() => t.fail())
  )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
});
