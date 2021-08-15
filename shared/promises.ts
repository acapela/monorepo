export function makePromiseVoidable(input: Promise<unknown>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    input.then(() => resolve()).catch(reject);
  });
}

export function createResolvablePromise<T>() {
  let pickedResolve: (value: T) => void;
  let didResolve = false;

  const promise = new Promise<T>((resolve) => {
    pickedResolve = (value) => {
      if (didResolve) return;
      didResolve = true;
      resolve(value);
    };
  });

  return [promise, pickedResolve!] as const;
}
