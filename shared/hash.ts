import fnv1a from "@sindresorhus/fnv1a";

export function getHash(input: string) {
  const hash = fnv1a(input, { size: 128 }).toString();

  return hash;
}
