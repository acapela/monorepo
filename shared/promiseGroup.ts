export function createPromisesGroup() {
  const runningPromisesSet = new Set<Promise<unknown>>();

  async function run<R>(callback: () => Promise<R>): Promise<R> {
    const callbackPromise = callback();
    try {
      runningPromisesSet.add(callbackPromise);
      return await callbackPromise;
    } finally {
      runningPromisesSet.delete(callbackPromise);
    }
  }

  async function waitForAllRunningPromises() {
    if (runningPromisesSet.size === 0) return;

    await Promise.all(
      Array.from(runningPromisesSet).map(async (promise) => {
        try {
          await promise;
        } catch (error) {
          //
        }
      })
    );

    if (runningPromisesSet.size > 0) {
      await waitForAllRunningPromises();
    }
  }

  return {
    run,
    waitForAllRunningPromises,
  };
}
