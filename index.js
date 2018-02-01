// All side effects are contained in Observable monads (at least I hope so)
const sideEffects = () => true;

const pendingMark = {};
const isPending = promise => Promise.race([promise, Promise.resolve(pendingMark)]).then(v => v === pendingMark, () => false);
const keepPending = async promises => {
  const pending = await Promise.all(promises.map(isPending));
  return promises.filter((p, i) => pending[i]);
};

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


const then = Observable => {
  const orderedThen = observable => new Observable(observer => {
    const context = {last: Promise.resolve()};
    // eslint-disable-next-line fp/no-mutation
    const add = promise => context.last = promise;
    return observable.subscribe({
      next: value => typeof value.then === 'function'
        ? add(context.last.then(() => value).then(observer.next.bind(observer), observer.error.bind(observer)))
        : observer.next(value),
      error: observer.error.bind(observer),
      complete: () => context.last.then(observer.complete.bind(observer))
    });
  });

  const unorderedThen = observable => new Observable(observer => {
    const context = {promises: []};
    const add = async promise => {
      const pending = keepPending(context.promises);
      // eslint-disable-next-line fp/no-mutation
      context.promises = [...context.promises, pending, promise];
      // eslint-disable-next-line fp/no-mutation
      return context.promises = [...await pending, promise];
    };
    return observable.subscribe({
      next: value => typeof value.then === 'function'
        ? add(value.then(observer.next.bind(observer), observer.error.bind(observer)))
        : observer.next(value),
      error: observer.error.bind(observer),
      complete: () => Promise.all(context.promises).then(observer.complete.bind(observer))
    });
  });

  return order => order ? orderedThen : unorderedThen;
};

const exported = {debounce, last, merge, reduce, repeat, then};

const exportTest = test => exported => test ? {...exported, keepPending} : exported;

module.exports = (Observable, test = false) => exportTest(test)(Object.entries(exported)
  .map(([name, func]) => [name, func(Observable)])
  .reduce((object, [name, func]) => ({...object, [name]: func}), {})
);
