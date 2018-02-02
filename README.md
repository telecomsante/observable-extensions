# Observable extensions

This package provides a few additional extensions to the upcoming [Observable TC39 proposal].

In order to use this library, first get it with `npm install observable-extensions`.

Then use it this way:

```js
const extensions = require('observable-extensions');
const Observable = require('zen-observable');

const {merge, reduce} = extensions(Observable);
```

Each extension takes one or more Observable as its input and returns a new Observable.

The library is currently [tested with a custom Observable](./test/README.md) based on [zen-observable](https://github.com/zenparsing/zen-observable) but should work with any Observable implementation complying with the [Observable TC39 proposal].

## debounce: number => Observable => Observable

`debounce` takes a delay in milliseconds as its first input and returns a function which will debounce an Observable.

The debounced Observable will only emit the latest value emitted up to now by the original Observable if no other value was emitted during the provided delay.

## filter: predicate => Observable => Observable

`filter` relies on a `predicate` in order to decide which values of the original Observable have to be emitted by the returned Observable.

`predicate` is a function with the following signature: `value => true|false`.
If the predicate returns `true`, the `value` will be emitted by the new Observable.

## forEach: function => Observable => Promise

`forEach` will apply `function` to all values emitted by the Observable.

`forEach` returns a `Promise` that will:

- either resolve to the first argument passed to [Observer.complete](https://github.com/tc39/proposal-observable#observer) which happens to be `undefined`;
- or reject with the error emitted by the Observable.

## last: Observable => Observable

The Observable returned by `last` will only emit the last value emitted by the original Observable.
The original Observable has to complete in order for the new Observable to emit this latest value and also complete.

## map: mapper => Observable => observable

`map` relies on the `mapper` function to transform the values emitted by the original Observable into new values emitted by the returned Observable.

`mapper` is a function with the following signature: `value => value`.

> As for any `map` usually implemented, the types of the original value and the one of the new value can be different.

## merge: [Observable] => Observable

`merge` merges all Observables in input and returns a new Observable that will emit a value whenever one of the Observable in argument emits this value.

## reduce: (reducer, initial) => Observable => Observable

`reduce` takes two arguments:

- reducer: a function `(accumulator, value) => accumulator`
- initial: the initial value of the accumulator

It returns a function able to reduce an Observable to a new Observable which will emit the updated accumulator each time the Observable in argument emits a value.

> **Caution:** this is not the `reduce` you are searching for.
> Reducing functions for Observables are usually implemented to produce a reduced value once the original Observable has completed.
> The Observable produced by this function will emit a reduced value each time the original Observable emits a value.
>
> If you want the general `reduce` behavior, just use `last` on the reduced Observable.
> This implementation of `reduce` can provide the usual behavior but the usual `reduce` cannot provide this behavior.

## repeat: number => Observable => Observable

`repeat` takes a delay in milliseconds and returns a function.

This latter function takes an Observable as its input and returns a new Observable.
This new Observable will emit regularly the last value emitted by the Observable in argument.

## then: boolean => Observable => Observable

An Observable returned by `then` will emit:

- the same value than the one emitted by the Observable in parameter if this value is not a [thenable];
- the value resolved by a [thenable] emitted by the Observable in parameter.

If the [thenable] is rejected, the new Observable will emit an error (and will thus stop emitting).

The `then` extension has to be first configured by passing it a boolean parameter:

- if this boolean is `true`, the new Observable will emit its values in the same order than the original Observable emits its values;
- if this boolean is `false`, the new Observable will emit its values as soon as the underlying [thenable]s are fulfilled.

[Observable TC39 proposal]: https://github.com/tc39/proposal-observable
[thenable]: https://promisesaplus.com/#point-7
