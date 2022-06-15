import { createDeepMap } from "./deepMap";

describe("deepMap", () => {
  it("does not re-run when not needed", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    map.getOrCreate([1, 2, 3], fn);
    map.getOrCreate([1, 2, 3], fn);

    expect(fn).toBeCalledTimes(1);

    map.getOrCreate([1, 2, 4], fn);

    expect(fn).toBeCalledTimes(2);
  });

  it("works with object path", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    const a = {};
    const b = {};
    const c = {};
    const d = {};

    map.getOrCreate([a, b, c], fn);
    map.getOrCreate([a, b, c], fn);

    expect(fn).toBeCalledTimes(1);

    map.getOrCreate([a, b, d], fn);
    map.getOrCreate([a, b, c], fn);

    expect(fn).toBeCalledTimes(2);
  });

  it("works with undefined", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    const a = {};
    const b = {};

    map.getOrCreate([a, b, undefined], fn);
    map.getOrCreate([a, b, undefined], fn);

    expect(fn).toBeCalledTimes(1);
  });

  it("properly return has result", () => {
    const map = createDeepMap<number>();

    const a = {};
    const b = {};
    const c = {};

    map.getOrCreate([a, b], () => 42);
    expect(map.has([a, b])).toBeTruthy();
    expect(map.has([a, c])).toBeFalsy();
  });

  it("works with equality", () => {
    const map = createDeepMap<number>({ checkEquality: true });

    const a = { foo: 2 };
    const b = { foo: 2 };

    const fn = jest.fn(() => 42);

    const resultA = map.getOrCreate([a], fn);
    const resultB = map.getOrCreate([b], fn);

    expect(fn).toBeCalledTimes(1);
    expect(resultA).toBe(42);
    expect(resultB).toBe(42);
  });
});
