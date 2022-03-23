import { createDeepMap } from "./deepMap";

describe("deepMap", () => {
  it("does not re-run when not needed", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    map.get([1, 2, 3], fn);
    map.get([1, 2, 3], fn);

    expect(fn).toBeCalledTimes(1);

    map.get([1, 2, 4], fn);

    expect(fn).toBeCalledTimes(2);
  });

  it("works with object path", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    const a = {};
    const b = {};
    const c = {};
    const d = {};

    map.get([a, b, c], fn);
    map.get([a, b, c], fn);

    expect(fn).toBeCalledTimes(1);

    map.get([a, b, d], fn);
    map.get([a, b, c], fn);

    expect(fn).toBeCalledTimes(2);
  });

  it("works with undefined", () => {
    const map = createDeepMap<number>();

    const fn = jest.fn(() => 42);

    const a = {};
    const b = {};

    map.get([a, b, undefined], fn);
    map.get([a, b, undefined], fn);

    expect(fn).toBeCalledTimes(1);
  });

  it("properly return has result", () => {
    const map = createDeepMap<number>();

    const a = {};
    const b = {};
    const c = {};

    map.get([a, b], () => 42);
    expect(map.has([a, b])).toBeTruthy();
    expect(map.has([a, c])).toBeFalsy();
  });

  it("works with equality", () => {
    const map = createDeepMap<number>({ checkEquality: true });

    const a = { foo: 2 };
    const b = { foo: 2 };

    const fn = jest.fn(() => 42);

    const resultA = map.get([a], fn);
    const resultB = map.get([b], fn);

    expect(fn).toBeCalledTimes(1);
    expect(resultA).toBe(42);
    expect(resultB).toBe(42);
  });
});
