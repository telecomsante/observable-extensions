/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import {flatten} from 'ramda';
import timedObservable from './helpers/timed-observable.js';
import extensions from '..';

const {merge} = extensions(Observable);

test(t => {
  t.plan(6);
  return merge([Observable.of(1, 2, 3), Observable.of(4, 5, 6)]).map(() => {
    return t.pass();
  });
});

[
  [
    [[1, 10], [3, 30], [5, 50]],
    [[2, 20], [4, 40], [6, 60]]
  ], [
    [[1, 10], [4, 40], [7, 70]],
    [[2, 20], [5, 50], [8, 80]],
    [[3, 30], [6, 60], [9, 90]]
  ], [
    [[1, 10]],
    [[2, 20], [4, 40]],
    [[3, 30], [5, 50], [6, 60]]
  ]
].forEach(scenarios => test(t => {
  t.plan(flatten(scenarios).length / 2);
  return merge(scenarios.map(timedObservable)).reduce((previous, current) => {
    if (current-previous === 1) {
      t.pass();
    } else {
      t.fail();
    }
    return current;
  }, 0);
}));

test(t => {
  // 4 pass + 1 throws
  t.plan(5);
  return t.throws(merge([
    [[1, 10], [4, 40], [7, 70]],
    [[2, 20], [new Error('test'), 50], [8, 80]],
    [[3, 30], [6, 60], [9, 90]]
  ].map(timedObservable)).forEach(() => t.pass()), Error, 'test');
});
