# Observable extensions

This package provides a few additional extensions to the upcoming [Observable TC39 proposal].

In order to use this library, first get it with `npm install observable-extensions`.

then use it this way:

```js
const extensions = require('observable-extensions');
const Observable = require('zen-observable');

const {merge, reduce} = extensions(Observable);
```

Each extension takes one or more Observable as its input and returns a new Observable.

The library is currently tested with [zen-observable] but should work with any Observable implementation complying with the [Observable TC39 proposal].

## debounce: number => Observable => Observable

`debounce` takes a delay in milliseconds as its first input and returns a function which will debounce an Observable.

The debounced Observable will only emit the latest value emitted up to now by the original Observable if no other value was emitted during the provided delay.

## last: Observable => Observable

The Observable returned by `last` will only emit the last value emitted by the original Observable.
The original Observable has to complete in order for the new Observable to emit this latest value and also complete.

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

[Observable TC39 proposal]: https://github.com/tc39/proposal-observable
