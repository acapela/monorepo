import { unwrapQueryData } from "./unwrapQueryData";

describe("unwrapQueryData", () => {
  it("unwraps single key object", () => {
    const obj = {
      foo: {
        bar: 2,
      },
    };
    const unwrapped = unwrapQueryData(obj);

    expect(unwrapped).toBe(obj.foo);
  });

  it("will not unwrap object with multiple properties", () => {
    const obj = {
      foo: {
        bar: 2,
      },
      baz: 2,
    };
    const unwrapped = unwrapQueryData(obj);

    expect(unwrapped).toBe(obj);
  });

  it("will ignore __typename property and still assume object has one prop unwrapping correctly", () => {
    const obj = {
      foo: {
        bar: 2,
      },
      __typename: "obj",
    };
    const unwrapped = unwrapQueryData(obj);

    expect(unwrapped).toBe(obj.foo);
  });
});
