const CHARACTER_MIN_BOUND = 32;
const CHARACTER_UPPER_BOUND = 126;

export function createNextIndex(lastTopicIndex?: string): string {
  // TODO: write full algorithm for this
  if (!lastTopicIndex) {
    return String.fromCharCode(CHARACTER_MIN_BOUND);
  }
  if (lastTopicIndex[0].charCodeAt(0) >= CHARACTER_UPPER_BOUND) {
    throw new Error("Algorithm not implemented for higher indexes");
  }
  return String.fromCharCode(lastTopicIndex[0].charCodeAt(0) + 1);
}
