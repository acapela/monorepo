type AnyMap = Map<unknown, unknown>;

type MapKey<M extends AnyMap> = M extends Map<infer K, unknown> ? K : never;
type MapValue<M extends AnyMap> = M extends Map<unknown, infer V> ? V : never;

export function mapGetOrCreate<M extends Map<unknown, unknown>>(
  map: M,
  key: MapKey<M>,
  getter: () => MapValue<M>
): MapValue<M> {
  const existingValue = map.get(key);

  if (existingValue !== undefined) {
    return existingValue as MapValue<M>;
  }

  const newValue = getter();

  map.set(key, newValue);

  return newValue;
}

export function mapRemoveValue<K, V>(map: Map<K, V>, value: V) {
  for (const [key, existingValue] of map) {
    if (existingValue === value) {
      map.delete(key);
      return true;
    }
  }

  return false;
}
