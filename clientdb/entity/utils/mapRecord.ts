import { typedKeys } from "~shared/object";

export function mapRecord<K extends string, IV, OV>(
  input: Record<K, IV>,
  mapper: (value: IV, key: K) => OV
): Record<K, OV> {
  const result = {} as Record<K, OV>;

  for (const key of typedKeys(input)) {
    result[key] = mapper(input[key], key);
  }

  return result;
}
