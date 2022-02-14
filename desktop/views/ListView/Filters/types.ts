import { EntityDataByDefinition } from "@aca/clientdb/entity/definition";
import { innerEntities } from "@aca/desktop/clientdb/notification/inner";

type FiltersData<T> = {
  [Key in keyof T]?: FilterValue<T[Key]>;
};

type FilterValue<T> = T | { $in: T[] } | { $not: T | { $in: T[] } };

type NotificationInnerDataUnion = EntityDataByDefinition<typeof innerEntities[number]>;

type FiltersUnion<U> = U extends infer T
  ? T extends { __typename: infer TN }
    ? {
        __typename: TN;
      } & FiltersData<Omit<T, "__typename">>
    : never
  : never;

export type NotificationFilter = FiltersUnion<NotificationInnerDataUnion>;

export type FilterKindName = NotificationFilter["__typename"];

export type NotificationFilterKind<K extends FilterKindName> = NotificationFilter & { __typename: K };

export function narrowFilterType<T extends FilterKindName>(
  filter: NotificationFilter,
  kind: T
): NotificationFilterKind<T> | null {
  if (getIsFilterOfType(filter, kind)) {
    return filter;
  }

  return null;
}

export function getIsFilterOfType<T extends FilterKindName>(
  filter: NotificationFilter,
  kind: T
): filter is NotificationFilterKind<T> {
  if (filter.__typename === kind) {
    return true;
  }

  return false;
}

export function assertFilterType<T extends FilterKindName>(
  filter: NotificationFilter,
  kind: T
): asserts filter is NotificationFilterKind<T> {
  if (getIsFilterOfType(filter, kind)) return;

  throw new Error("Nope");
}
