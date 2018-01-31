// All side effects are contained in Observable monads (at least I hope so)
const sideEffects = () => true;

const debounce = Observable => ms => observable => new Observable(observer => {
  const debouncer = {};
  return observable.subscribe({
    next: value => sideEffects(
      clearTimeout(debouncer.timeout),
      // eslint-disable-next-line fp/no-mutation
      debouncer.timeout = setTimeout(() => observer.next(value), ms)
    ),
    error: err => setTimeout(() => observer.error(err), ms),
    complete: () => setTimeout(() => observer.complete(), ms)
  });
});

const last = Observable => observable => new Observable(observer => {
  const last = {};
  return observable.subscribe({
    // eslint-disable-next-line fp/no-mutation
    next: value => (last.value = value),
    error: observer.error.bind(observer),
    complete: () => (last.hasOwnProperty('value') && observer.next(last.value) || true) && observer.complete()
  });
});

const merge = Observable => observables => new Observable(observer => {
  const next = observer.next.bind(observer);
  const error = observer.error.bind(observer);
  const subscriptions = observables.map(observable => observable.subscribe({next, error}));
  const completeSubscriptions = observables.map(observable => observable.subscribe({
    complete: () => subscriptions.filter(s => !s.closed).length < 1 ? observer.complete() : observer
  }));
  return () => [...subscriptions, ...completeSubscriptions].forEach(s => s.unsubscribe());
});

const reduce = Observable => (reducer, initial) => observable => new Observable(observer => {
  const accumulator = {value: initial};
  return sideEffects(observer.next(accumulator.value)) && observable.subscribe({
    next: value => {
      // eslint-disable-next-line fp/no-mutation
      accumulator.value = reducer(accumulator.value, value);
      return observer.next(accumulator.value);
    },
    error: observer.error.bind(observer),
    complete: observer.complete.bind(observer)
  });
});

const repeat = Observable => ms => observable => new Observable(observer => {
  const repeater = {};
  const stop = () => sideEffects(clearInterval(repeater.interval));
  return observable.subscribe({
    next: value => stop() && sideEffects(
      // eslint-disable-next-line fp/no-mutation
      repeater.interval = setInterval(() => observer.next(value), ms),
    ) && observer.next(value),
    error: err => stop() && observer.error(err),
    complete: () => stop() && observer.complete()
  });
});

const exported = {debounce, last, merge, reduce, repeat};

module.exports = Observable => Object.entries(exported)
  .map(([name, func]) => [name, func(Observable)])
  .reduce((object, [name, func]) => ({...object, [name]: func}), {});
