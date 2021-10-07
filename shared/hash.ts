/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 * Source: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 */
function getHashFnv32a(input: string, seed?: number) {
  /*jshint bitwise:false */
  let i: number;
  let length: number;

  let buffer = seed ?? 0x811c9dc5;

  for (i = 0, length = input.length; i < length; i++) {
    buffer ^= input.charCodeAt(i);
    buffer += (buffer << 1) + (buffer << 4) + (buffer << 7) + (buffer << 8) + (buffer << 24);
  }

  // Convert to 8 digit hex string
  return ("0000000" + (buffer >>> 0).toString(16)).substr(-8);
}

export function getHash(input: string) {
  // As recommended in https://security.stackexchange.com/questions/209882/can-a-32-bit-hash-be-made-into-a-64-bit-hash-by-calling-it-twice-with-different/210049#210049
  // - 2 rounds of hashing.
  const firstRound = getHashFnv32a(input);
  return firstRound + getHashFnv32a(input + firstRound);
}
