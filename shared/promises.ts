export function makePromiseVoidable(input: Promise<unknown>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    input.then(() => resolve()).catch(reject);
  });
}

/**
 * Simple utility that allows creating a promise that can be resolved from outside of itself.
 *
 * Example:
 *
 * ```tsx
 * const [promise, resolve] = createResolvablePromise<string>();
 *
 * async function foo() {
 *   console.info('foo start');
 *   const value = await promise;
 *   console.info(`foo ended with ${value}`)
 * }
 *
 * foo(); // Logs 'foo start'
 *
 * resolve('bar');
 *
 */
export function createResolvablePromise<T>() {
  let resolve: (data: T) => void;

  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve;
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [promise, resolve!] as const;
}
