import { autorun, observable, runInAction } from "mobx";

import { cachedComputedWithoutArgs } from "~clientdb/entity/utils/cachedComputedWithoutArgs";

import { runObserved } from "./utils";

describe("lazyComputed", () => {
  it("returns proper value", () => {
    const getter = jest.fn(() => 42);
    const value = cachedComputedWithoutArgs(getter);

    expect(value.get()).toBe(42);
  });

  it("is not computing value until requested", () => {
    const getter = jest.fn(() => 42);
    cachedComputedWithoutArgs(getter);

    expect(getter).toBeCalledTimes(0);
  });

  it("is will keep value in cache, if is observed", () => {
    runObserved(() => {
      const getter = jest.fn(() => 42);
      const value = cachedComputedWithoutArgs(getter);

      value.get();

      expect(getter).toBeCalledTimes(1);

      expect(value.get()).toBe(42);
      expect(getter).toBeCalledTimes(1);
    });
  });

  it("will not call getter 2nd time if value changes, but is not requested", () => {
    const finalValue = observable.box(1);

    const getter = jest.fn(() => finalValue.get());
    const value = cachedComputedWithoutArgs(getter);

    expect(value.get()).toBe(1);

    expect(getter).toBeCalledTimes(1);

    runInAction(() => {
      finalValue.set(2);
    });

    expect(getter).toBeCalledTimes(1);

    expect(value.get()).toBe(2);

    expect(getter).toBeCalledTimes(2);
  });

  it("will properly inform observer about updates", () => {
    const finalValue = observable.box(1);

    const getter = jest.fn(() => finalValue.get());
    const value = cachedComputedWithoutArgs(getter);

    const watcher = jest.fn(() => {
      return value.get();
    });

    const dispose = autorun(watcher);

    expect(watcher).toBeCalledTimes(1);

    runInAction(() => {
      finalValue.set(2);
    });

    expect(watcher).toBeCalledTimes(2);
    dispose();
  });

  it("will keep cache in autorun if other value is updated", () => {
    const finalValue = observable.box(1);
    const otherValue = observable.box(1);

    const getter = jest.fn(() => finalValue.get());
    const value = cachedComputedWithoutArgs(getter);

    const watcher = jest.fn(() => {
      return otherValue.get() + value.get();
    });

    const dispose = autorun(watcher);

    expect(watcher).toBeCalledTimes(1);
    expect(getter).toBeCalledTimes(1);

    runInAction(() => {
      otherValue.set(2);
    });

    expect(watcher).toBeCalledTimes(2);
    expect(getter).toBeCalledTimes(1);

    runInAction(() => {
      finalValue.set(2);
    });

    expect(watcher).toBeCalledTimes(3);
    expect(getter).toBeCalledTimes(2);

    dispose();
  });
});
