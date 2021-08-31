/**
 * This simple function allows creating objects of some type that extends some 'root type'.
 *
 * Might sound confusing, but the goal is rather simple:
 *
 * Let's say we have:
 *
 * const dict = {
 *   foo: 1,
 *   bar: 2
 * }
 *
 * it works nice and typescript is guarding us:
 * dict.foo // number
 * dict.baz // ts-error - no baz
 *
 * All good.
 *
 * But what if we want to enforce `dict` to have shape of Record<string,number>, so we can avoid situation like
 *
 * const dict = {
 *   foo: 1,
 *   bar: 2,
 *   baz: '3', // <-- we want ts error here
 * }
 *
 * We can do
 *
 * const dict: Record<string, number> = {
 *   foo: 1,
 *   bar: 2,
 *   baz: '3', // <-- TS error, good!
 * }
 *
 * but now we lost details of `dict` type,
 *
 * we can do dict.nonExisting, but ts will tell us it is a number.
 *
 * To avoid that we can use this function below like:
 *
 * const dict = createTypeGuard<Record<string, number>>()({
 *   foo: 1,
 *   bar: 2,
 *   baz: '3' <-- will show ts error
 * });
 *
 * dict.nonExisting <-- TS error, we keep full info about exact shape of the object
 */
export function createTypeGuard<T>() {
  return function <E extends T>(input: E): E {
    return input;
  };
}
