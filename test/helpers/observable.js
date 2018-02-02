import Observable from 'zen-observable';
import Symbol_observable from 'symbol-observable';

// eslint-disable-next-line fp/no-rest-parameters
const ObservableProxy = function (...args) {
  const zen = new Observable(...args);
  // eslint-disable-next-line fp/no-mutating-assign,fp/no-this
  return Object.assign(this, {
    subscribe: zen.subscribe.bind(zen),
    // eslint-disable-next-line fp/no-this
    [Symbol_observable]: () => this
  });
};

// eslint-disable-next-line fp/no-mutation
ObservableProxy.of = Observable.of;
// eslint-disable-next-line fp/no-mutation
ObservableProxy.from = Observable.from;

export default ObservableProxy;
