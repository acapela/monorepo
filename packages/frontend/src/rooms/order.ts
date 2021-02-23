const CHARACTER_MIN_BOUND = 32;
const CHARACTER_UPPER_BOUND = 126;

export function createNextIndex(lastThreadIndex?: string): string {
  // TODO: write full algorithm for this
  if (!lastThreadIndex) {
    return String.fromCharCode(CHARACTER_MIN_BOUND);
  }
  if (lastThreadIndex[0].charCodeAt(0) >= CHARACTER_UPPER_BOUND) {
    throw new Error("Algorithm not implemented for higher indexes");
  }
  return String.fromCharCode(lastThreadIndex[0].charCodeAt(0) + 1);
}
