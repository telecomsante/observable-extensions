/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {sort} from 'ramda';
import timedObservable from './helpers/timed-observable.js';

test(t => {
  t.plan(1);
  return timedObservable([[1, 1]]).map(v => v === 1 ? t.pass() : t.fail());
});

[
  [[1, 10], [2, 20], [3, 30]],
  [[3, 30], [1, 10], [2, 20]],
  [[1, 30], [2, 20], [3, 10]]
].forEach(scenario => test(t => {
  t.plan(3);
  const indexedScenario = scenario.reduce((o, [val, time]) => ({...o, [time]: val}), {});
  const initialState = sort((l, r) => l-r, [...Object.keys(indexedScenario)]).map(time => indexedScenario[time]);
  return timedObservable(scenario).reduce((state, value) => {
    if (value === state[0]) {
      t.pass();
    } else {
      t.fail();
    }
    return state.slice(1);
  }, initialState);
}));

test(t => {
  // 2 pass + 1 throws
  t.plan(3);
  return t.throws(timedObservable([[1, 10], [2, 20], [new Error('test'), 30], [4, 40]]).forEach(() => t.pass()), Error, 'test');
});
