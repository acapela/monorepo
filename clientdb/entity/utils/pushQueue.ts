import { assert } from "~shared/assert";
import { ResolvablePromise, createResolvablePromise } from "~shared/promises";

type Task<T> = () => T;

/**
 * Will create queue of async tasks.
 *
 * Assumptions:
 * They're guaranteed to be executed in order of being added.
 * Next task will never get executed before previous was successfully executed.
 */
export function createPushQueue() {
  const queue = new Set<Task<unknown>>();
  /**
   * ".add" returns a promise of 'when will this task being executed'. As it is different promise to task itself, we need to keep track of it.
   */
  const taskFlushedPromisesMap = new WeakMap<Task<unknown>, ResolvablePromise<any>>();

  // TODO: Let's discuss scenario of failed attempts - should we replay?

  // Make sure we never have multiple flushing at once.
  let isFlushing = false;

  async function flushNext() {
    if (isFlushing) return;
    const [nextTask] = Array.from(queue);

    if (!nextTask) return;

    isFlushing = true;

    // Get resolvable promise of original call waiting for this task to be resolved.
    const flushPromise = taskFlushedPromisesMap.get(nextTask);

    assert(flushPromise, "No flush promise for task added");

    try {
      // Try to execute
      const result = await nextTask();
      // Only if successful - delete task for queue to allow next tasks to be executed.
      queue.delete(nextTask);
      flushPromise.resolve(result);
      scheduleNext();
    } catch (error) {
      // Note: at this point entire queue is stopped. Next attempt will happen next time something is added to the queue.
      flushPromise.reject(error);
    } finally {
      isFlushing = false;
    }
  }

  function scheduleNext() {
    setTimeout(() => flushNext(), 0);
  }

  async function add<T>(task: () => T) {
    queue.add(task);
    const flushPromise = createResolvablePromise<T>();
    taskFlushedPromisesMap.set(task, flushPromise);

    scheduleNext();

    return flushPromise.promise;
  }

  return {
    add,
  };
}
