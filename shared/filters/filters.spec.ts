import { getIsItemMatchingFilters } from ".";

export const foo = 42;

interface Item {
  kind: string;
  name: string;
}

describe("filters", () => {
  it("matches $or", () => {
    const item: Item = { kind: "dog", name: "Rex" };

    expect(getIsItemMatchingFilters(item, { $or: [{ kind: "dog" }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ kind: "foo" }, { kind: "dog" }] })).toBe(true);

    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: "dog" }] }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: "dog" }] }], name: "nope" })).toBe(false);
    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: "dog" }] }], name: "Rex" })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: { $in: ["dog", "cow"] } }] }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: { $in: ["cow", "dog"] } }] }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ $or: [{ kind: { $not: "cow" } }] }] })).toBe(true);
  });

  it("works with $not", () => {
    const item: Item = { kind: "dog", name: "Rex" };

    expect(getIsItemMatchingFilters(item, { kind: { $not: "cow" } })).toBe(true);
    expect(getIsItemMatchingFilters(item, { kind: { $not: "dog" } })).toBe(false);

    expect(getIsItemMatchingFilters(item, { $or: [{ kind: { $not: "cow" } }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ kind: { $not: "dog" } }] })).toBe(false);
  });

  it("works with $in", () => {
    const item: Item = { kind: "dog", name: "Rex" };

    expect(getIsItemMatchingFilters(item, { kind: { $in: ["dog", "cow"] } })).toBe(true);
    expect(getIsItemMatchingFilters(item, { kind: { $in: ["cow", "duck"] } })).toBe(false);
    expect(getIsItemMatchingFilters(item, { kind: { $in: [] } })).toBe(false);
  });

  it("works with multiple fields", () => {
    const item: Item = { kind: "dog", name: "Rex" };

    expect(getIsItemMatchingFilters(item, { kind: "dog", name: "Rex" })).toBe(true);
    expect(getIsItemMatchingFilters(item, { kind: "dog", name: "Woo" })).toBe(false);
    expect(getIsItemMatchingFilters(item, { $or: [{ kind: "cow" }, { name: "Rex" }] })).toBe(true);

    expect(getIsItemMatchingFilters(item, { $or: [{ name: "Rex" }, { kind: "cow" }] })).toBe(true);

    expect(getIsItemMatchingFilters(item, { $or: [{ name: { $in: ["Boo", "Rex"] } }, { kind: "cow" }] })).toBe(true);

    expect(getIsItemMatchingFilters(item, { $or: [{ name: "Rex", kind: "dog" }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { $or: [{ name: "Foo" }, { name: "Rex", kind: "dog" }] })).toBe(true);
    expect(getIsItemMatchingFilters(item, { name: "Rex", $or: [{ kind: "cow" }, { kind: "dog" }] })).toBe(true);
  });

  it("works with $notIn", () => {
    const item: Item = { kind: "dog", name: "Rex" };

    expect(getIsItemMatchingFilters(item, { kind: { $notIn: ["lolo", "bolo"] } })).toBe(true);
    expect(getIsItemMatchingFilters(item, { kind: { $notIn: ["dog", "bolo"] } })).toBe(false);
    expect(getIsItemMatchingFilters(item, { $or: [{ kind: { $notIn: ["aaa", "bbb"] } }] })).toBe(true);

    expect(getIsItemMatchingFilters(item, { $or: [{ name: { $in: ["Rex", "Dex"] }, kind: { $notIn: [] } }] })).toBe(
      true
    );
  });
});
