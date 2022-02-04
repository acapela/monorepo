import { permutation } from "./permutations";

it("works", () => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

  permutation`${weekdays} in ${[2, 3, 4, 5]} weeks`.getAll();
});

describe("permutations", () => {
  it("works with basic example", () => {
    expect(permutation`I have ${[2, 3, 4]} dogs`.getAll()).toEqual([
      //
      `I have 2 dogs`,
      `I have 3 dogs`,
      `I have 4 dogs`,
    ]);
  });

  it("works with multiple permutations", () => {
    expect(permutation`I have ${[2, 3]} ${["white", "brown"]} dogs`.getAll()).toEqual([
      `I have 2 white dogs`,
      `I have 2 brown dogs`,
      `I have 3 white dogs`,
      `I have 3 brown dogs`,
    ]);
  });

  it("works throw if some permutation is not array", () => {
    expect(() => {
      // @ts-expect-error
      permutation`I have ${3} dogs`;
    }).toThrow();
  });

  it("works if no permutations are provided", () => {
    expect(permutation`I have 3 dogs`.getAll()).toEqual(["I have 3 dogs"]);
  });

  it("works if permutation is provided at start or end", () => {
    expect(permutation`I like ${[2, 3]}`.getAll()).toEqual(["I like 2", "I like 3"]);
    expect(permutation`${[2, 3]} I like`.getAll()).toEqual(["2 I like", "3 I like"]);
  });

  it("clean ups white spaces", () => {
    expect(permutation`January ${["", "1st"]} next year`.getAll()).toEqual([
      `January next year`,
      `January 1st next year`,
    ]);
  });

  it("passes data properly", () => {
    const numbers = [2, 3];
    const colors = ["white", "brown"];
    const results = permutation`I have ${numbers} ${colors} dogs`.getWithData((count, color) => {
      return { count, color };
    });

    expect(results).toEqual([
      {
        text: "I have 2 white dogs",
        data: { color: "white", count: 2 },
      },
      {
        text: "I have 2 brown dogs",
        data: { color: "brown", count: 2 },
      },
      {
        text: "I have 3 white dogs",
        data: { color: "white", count: 3 },
      },
      {
        text: "I have 3 brown dogs",
        data: { color: "brown", count: 3 },
      },
    ]);
  });
});
