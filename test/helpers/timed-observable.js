import Observable from './observable';

export default scenario => new Observable(observer => {
  const timeouts = scenario.map(s => setTimeout(() => s[0] instanceof Error ? observer.error(s[0]) : observer.next(s[0]), s[1]));
  const maxTimeout = scenario.map(s => s[1]).reduce((m, t) => t > m ? t : m, 0);
  const completeTimeout = setTimeout(() => observer.complete(), maxTimeout + 10);
  return () => [...timeouts, completeTimeout].map(t => clearTimeout(t));
});
