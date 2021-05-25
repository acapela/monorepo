import { generateId } from "./id";

export type AnyObject = Record<keyof unknown, unknown>;

export function objectMap<O extends AnyObject, NV>(
  input: O,
  mapper: (value: O[keyof O], key: keyof O) => NV
): Record<keyof O, NV> {
  const mappedObject = {} as Record<keyof O, NV>;
  typedKeys(input).forEach((key) => {
    const oldValue = input[key];
    const newValue = mapper(oldValue, key);

    mappedObject[key] = newValue;
  });

  return mappedObject;
}

export function typedKeys<O>(input: O): Array<keyof O> {
  return Object.keys(input) as Array<keyof O>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectKeys = new Map<any, string>();

export function getObjectKey(input: unknown) {
  const existingKey = objectKeys.get(input);

  if (existingKey) return existingKey;

  const newKey = generateId();

  objectKeys.set(input, newKey);

  return newKey;
}
