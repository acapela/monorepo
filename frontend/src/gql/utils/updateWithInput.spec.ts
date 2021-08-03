import { getUpdatedDataWithInput } from "./updateWithInput";

describe("getUpdatedDataWithInput", () => {
  it("should not update non existing fields", () => {
    const data = {
      foo: 1,
      bar: 2,
    };

    // @ts-expect-error
    const result = getUpdatedDataWithInput(data, { baz: 1 });

    expect(data).toEqual(result);
  });

  it("should update field", () => {
    const data = {
      foo: 1,
      bar: 2,
    };

    const result = getUpdatedDataWithInput(data, { foo: 3 });

    expect(result).toEqual({ foo: 3, bar: 2 });
  });

  it("should update field if its null", () => {
    const data = {
      foo: 1,
      bar: 2,
    };

    const result = getUpdatedDataWithInput(data, { foo: null });

    expect(result).toEqual({ foo: null, bar: 2 });
  });

  it("should not update field if its explicit undefined", () => {
    const data = {
      foo: 1,
    };

    const result = getUpdatedDataWithInput(data, { foo: undefined });

    expect(result).toEqual(data);
  });

  it("should return the same object if no updates are made", () => {
    const data = {
      foo: 1,
    };

    const result = getUpdatedDataWithInput(data, {});

    expect(result).toBe(data);
  });

  it("should throw if trying to change non-nullish type of data", () => {
    expect(() => {
      getUpdatedDataWithInput({ foo: 1 }, { foo: "1" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot update data with input for property \\"foo\\" with different data type than existing data. Old: 1, New: \\"1\\""`
    );

    expect(() => {
      getUpdatedDataWithInput({ foo: [1] }, { foo: "1" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot update data with input for property \\"foo\\" with different data type than existing data. Old: [1], New: \\"1\\""`
    );

    expect(() => {
      getUpdatedDataWithInput({ foo: [1] }, { foo: { bar: 2 } });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot update data with input for property \\"foo\\" with different data type than existing data. Old: [1], New: {\\"bar\\":2}"`
    );

    expect(() => {
      getUpdatedDataWithInput({ foo: [0] }, { foo: [1] });
    }).not.toThrow();
  });

  it("should not throw if changing value between nullish<>not-nullish", () => {
    expect(() => {
      getUpdatedDataWithInput({ foo: null }, { foo: "1" });
    }).not.toThrow();
  });
});
