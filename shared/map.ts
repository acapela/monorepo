type AnyMap = Map<any, any>;

type MapKey<M extends AnyMap> = M extends Map<infer K, any> ? K : never;
type MapValue<M extends AnyMap> = M extends Map<any, infer V> ? V : never;

export function mapGetOrCreate<M extends Map<any, any>>(
  map: M,
  key: MapKey<M>,
  getter: () => MapValue<M>
): MapValue<M> {
  const existingValue = map.get(key);

  if (existingValue !== undefined) {
    return existingValue;
  }

  const newValue = getter();

  map.set(key, newValue);

  return newValue;
}
