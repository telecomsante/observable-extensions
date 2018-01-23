// All side effects are contained in Observable monads (at least I hope so)
const sideEffects = () => true;

module.exports = Observable => ({
  debounce: ms => observable => new Observable(observer => {
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
  }),

  last: observable => new Observable(observer => {
    const last = {};
    return observable.subscribe({
      // eslint-disable-next-line fp/no-mutation
      next: value => (last.value = value),
      error: err => observer.error(err),
      complete: () => (last.hasOwnProperty('value') && observer.next(last.value) || true) && observer.complete()
    });
  }),

  merge: observables => new Observable(observer => {
    const subscriptions = observables.map(observable => observable.subscribe({
      next: value => observer.next(value),
      error: err => observer.error(err)
    }));
    const completeSubscriptions = observables.map(observable => observable.subscribe({
      complete: () => subscriptions.filter(s => !s.closed).length < 1 ? observer.complete() : observer
    }));
    return () => [...subscriptions, ...completeSubscriptions].forEach(s => s.unsubscribe());
  }),

  reduce: (reducer, initial) => observable => new Observable(observer => {
    const accumulator = {value: initial};
    return sideEffects(observer.next(accumulator.value)) && observable.subscribe({
      next: value => {
        // eslint-disable-next-line fp/no-mutation
        accumulator.value = reducer(accumulator.value, value);
        return observer.next(accumulator.value);
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  }),

  repeat: ms => observable => new Observable(observer => {
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
  })
});
