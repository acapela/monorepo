export function makePromiseVoidable(input: Promise<unknown>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    input.then(() => resolve()).catch(reject);
  });
}

export interface ResolvablePromise<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  getIsComplete(): boolean;
}

export function createResolvablePromise<T = void>(): ResolvablePromise<T> {
  let resolve: (value: T) => void;
  let reject: (error: unknown) => void;
  let didResolve = false;
  let didReject = false;

  function getIsComplete() {
    return didResolve || didReject;
  }

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = (value) => {
      if (getIsComplete()) return;
      didResolve = true;
      resolvePromise(value);
    };
    reject = (error) => {
      if (getIsComplete()) return;
      didReject = true;
      rejectPromise(error);
    };
  });

  return {
    promise,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve: resolve!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reject: reject!,
    getIsComplete,
  };
}
