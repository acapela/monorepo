interface PermutationResult<R> {
  readonly text: string;
  // Data is lazily resolved to save performance for large amount of permutations if data is not instantly (or never) needed.
  readonly data: R;
}

type PermutationInterpolation = ReadonlyArray<InterpolationVariantType>;

type PermutationInterpolations = Array<PermutationInterpolation>;

type ArraysItems<T extends PermutationInterpolations> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof T]: T[key] extends ReadonlyArray<any> ? T[key][number] : never;
};

type InterpolationVariantType = string | number;

type TwoDimentionalArray<T> = ReadonlyArray<ReadonlyArray<T>>;

/**
 * Input
 * [[1,2], [3,4]]
 * Output
 * [[1,3],[1,4],[2,3],[2,4]]
 */
function get2dArrayCombinations<T>(input: TwoDimentionalArray<T>) {
  if (input.length === 0) return [[]];
  const res: T[][] = [];
  const [first, ...rest] = input;
  const remaining = get2dArrayCombinations(rest);
  first.forEach((e) => {
    remaining.forEach((smaller) => {
      res.push([e].concat(smaller));
    });
  });
  return res;
}

export function permutation<T extends PermutationInterpolations>(parts: TemplateStringsArray, ...interpolations: T) {
  for (const interpolation of interpolations) {
    if (!Array.isArray(interpolation)) {
      throw new Error(
        `Each interpolation passed to permutation must be an array. Provided "${interpolation}" instead.`
      );
    }
  }
  function getWithData<R>(dataBuilder: (...args: ArraysItems<T>) => R): PermutationResult<R>[] {
    const combinations = get2dArrayCombinations(interpolations);

    return combinations.map((combination) => {
      return {
        get text() {
          return joinArrayWithCallback(parts, (index) => combination[index].toString())
            .replace(/ +/g, " ")
            .trim();
        },
        get data() {
          return dataBuilder(...(combination as ArraysItems<T>));
        },
      };
    });
  }

  function getAll() {
    const combinations = get2dArrayCombinations(interpolations);

    return combinations.map((combination) => {
      return joinArrayWithCallback(parts, (index) => combination[index].toString())
        .replace(/ +/g, " ")
        .trim();
    });
  }

  return { getWithData, getAll };
}

function joinArrayWithCallback(input: ReadonlyArray<string>, joinCallback: (index: number) => string) {
  return input.reduce((output, elem, index) => {
    // always join the next element
    output += elem;

    // add next separator, if we're not at the final element in the array
    if (index < input.length - 1) output += joinCallback(index) ?? "";

    // return the current edits
    return output;
  }, "");
}
