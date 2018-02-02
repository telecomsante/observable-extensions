/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {pipe} from 'ramda';
import Observable from './helpers/observable';
import extensions from '..';

const {forEach, last, reduce, then} = extensions(Observable);
const wait = ms => value => new Promise(resolve => setTimeout(() => resolve(value), ms));

[then(true), then(false)].forEach(then => {
  test(t => {
    t.plan(1);
    return pipe(
      then,
      forEach(() => t.fail())
    )(Observable.of())
      .then(() => t.pass());
  });

  test(t => {
    t.plan(1);
    return pipe(
      then,
      reduce((a, v) => [...a, v], []),
      last,
      forEach(v => t.deepEqual(v, [1]))
    )(Observable.of(1));
  });

  test(t => {
    t.plan(1);
    return pipe(
      then,
      reduce((a, v) => [...a, v], []),
      last,
      forEach(v => t.deepEqual(v, [1, 2]))
    )(Observable.of(1, 2));
  });

  test(t => {
    t.plan(1);
    return pipe(
      then,
      reduce((a, v) => [...a, v], []),
      last,
      forEach(v => t.deepEqual(v, [1]))
    )(Observable.of(Promise.resolve(1).then(wait(100))));
  });

  test(t => {
    t.plan(1);
    return pipe(
      then,
      reduce((a, v) => [...a, v], []),
      last,
      forEach(v => t.deepEqual(v, [1, 2]))
    )(Observable.of(
      Promise.resolve(1).then(wait(100)),
      Promise.resolve(2).then(wait(200))
    ));
  });

  test(t => {
    // error
    t.plan(1);
    return t.throws(pipe(
      then,
      forEach(() => t.fail())
    )(new Observable(observer => observer.error(new Error('test')))), Error, 'test');
  });

  test(t => {
    // error
    t.plan(1);
    return t.throws(pipe(
      then,
      forEach(() => t.fail())
    )(Observable.of(Promise.reject(new Error('test')))), Error, 'test');
  });

  return true;
});

test(t => {
  t.plan(1);
  return pipe(
    then(true),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [1, 2]))
  )(Observable.of(
    Promise.resolve(1).then(wait(200)),
    Promise.resolve(2).then(wait(100))
  ));
});

test(t => {
  t.plan(1);
  return pipe(
    then(false),
    reduce((a, v) => [...a, v], []),
    last,
    forEach(v => t.deepEqual(v, [2, 1]))
  )(Observable.of(
    Promise.resolve(1).then(wait(200)),
    Promise.resolve(2).then(wait(100))
  ));
});
