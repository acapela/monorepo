import { anyBase, commonBase } from "./anyBase";

/**
 * Returns string 'in the middle' of provided strings
 * https://stackoverflow.com/a/38927158/2446799
 */
export function midString(prev: string, next: string) {
  let p: number | undefined, n: number | undefined, pos: number, str: string;
  for (pos = 0; p == n; pos++) {
    // find leftmost non-matching character
    p = pos < prev.length ? prev.charCodeAt(pos) : 96;
    n = pos < next.length ? next.charCodeAt(pos) : 123;
  }
  str = prev.slice(0, pos - 1); // copy identical part of string
  if (p == 96) {
    // prev string equals beginning of next
    while (n == 97) {
      // next character is 'a'
      n = pos < next.length ? next.charCodeAt(pos++) : 123; // get char from next
      str += "a"; // insert an 'a' to match the 'a'
    }
    if (n == 98) {
      // next character is 'b'
      str += "a"; // insert an 'a' to match the 'b'
      n = 123; // set to end of alphabet
    }
  } else if (p! + 1 == n) {
    // found consecutive characters
    str += String.fromCharCode(p!); // insert character from prev
    n = 123; // set to end of alphabet
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) == 122) {
      // p='z'
      str += "z"; // insert 'z' to match 'z'
    }
  }
  return str + String.fromCharCode(Math.ceil((p! + n!) / 2)); // append middle character
}

function compressIndex(index: number) {
  return indexCompressor.convert(`${index}`);
}

function unpackIndex(packedIndex: string) {
  return parseInt(indexCompressor.revert(packedIndex), 10);
}

function modifyStringIndex(index: string, offset: number) {
  return compressIndex(unpackIndex(index) + offset);
}

const START_SORT_OFFSET = "aaaaaaa";
const INDEX_SPACE = 1000;

function createInitialIndexList(count: number) {
  const start = START_SORT_OFFSET;
  const end = modifyStringIndex(start, count * INDEX_SPACE);

  return midStrings(start, end, count);
}

function getPreviousIndex(index: string) {
  return modifyStringIndex(index, -INDEX_SPACE);
}

const indexCompressor = anyBase(commonBase.DEC, commonBase.ALPHA);

interface ItemWithNewSort<T> {
  item: T;
  sort: string;
}

function addMidStringToIndexArray(strings: string[]) {
  const randomPosition = Math.floor(Math.random() * (strings.length - 1));
  strings.splice(randomPosition + 1, 0, midString(strings[randomPosition], strings[randomPosition + 1]));
}

function midStrings(start: string, end: string, count: number): string[] {
  const allStrings = [start, end];

  for (let i = 0; i <= count; i++) {
    addMidStringToIndexArray(allStrings);
  }

  allStrings.pop();
  allStrings.shift();

  return allStrings;
}

function createNewSorts<T>(items: T[], sortGetter: (item: T) => string | undefined): ItemWithNewSort<T>[] {
  const currentSorts = items.map(sortGetter);

  const firstSortIndex = currentSorts.findIndex((sort) => !!sort);

  if (firstSortIndex === -1) {
    const initialIndexList = createInitialIndexList(items.length);

    return initialIndexList.map((stringIndex, arrayIndex) => {
      return {
        item: items[arrayIndex],
        sort: stringIndex,
      };
    });
  }

  const firstSortString = currentSorts[firstSortIndex]!;

  currentSorts.map((currentSort, index, currentSorts) => {
    const nextSort = currentSorts[index + 1];
  });

  return [];
}

function fillGaps<I, R>(
  items: I[],
  getter: (item: I) => R | undefined,
  filler: (previousKnown: R | undefined, nextKnown: R | undefined, count: number) => R
) {}
