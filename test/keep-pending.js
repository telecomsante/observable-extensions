/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import extensions from '..';

const {keepPending} = extensions(() => ({}), true);

test(async t => t.deepEqual(await keepPending([]), []));
test(async t => t.deepEqual(await keepPending([Promise.resolve()]), []));
test(async t => t.deepEqual(await keepPending([Promise.reject()]), []));
test(async t => t.deepEqual(await keepPending([Promise.resolve(), Promise.reject()]), []));
test(async t => {
  const unfulfilled = new Promise(() => true);
  return t.deepEqual(await keepPending([unfulfilled]), [unfulfilled]);
});
test(async t => {
  const unfulfilled1 = new Promise(() => true);
  const unfulfilled2 = new Promise(() => true);
  return t.deepEqual(
    await keepPending([Promise.resolve(), unfulfilled1, Promise.reject(), unfulfilled2, Promise.resolve()]),
    [unfulfilled1, unfulfilled2]
  );
});
