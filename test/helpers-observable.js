/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import isObservable from 'is-observable';
import Observable from './helpers/observable';

test(t => t.true(isObservable(new Observable(() => () => true))));

test(t => {
  const observable = new Observable(observer => {
    observer.next(1);
    return observer.complete();
  });
  t.plan(2);
  return observable.subscribe({
    next: v => t.is(v, 1),
    error: () => t.fail(),
    complete: () => t.pass()
  });
});

test(t => {
  t.plan(2);
  return Observable.of(1).subscribe({
    next: v => t.is(v, 1),
    error: () => t.fail(),
    complete: () => t.pass()
  });
});

test(t => {
  t.plan(2);
  return Observable.of(1).subscribe(
    v => t.is(v, 1),
    () => t.fail(),
    () => t.pass()
  );
});

test(t => {
  t.plan(2);
  return Observable.from([1]).subscribe(
    v => t.is(v, 1),
    () => t.fail(),
    () => t.pass()
  );
});

test(t => {
  t.plan(2);
  return Observable.from(Observable.of(1)).subscribe(
    v => t.is(v, 1),
    () => t.fail(),
    () => t.pass()
  );
});
