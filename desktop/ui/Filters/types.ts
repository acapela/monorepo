import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { FunctionUpdater } from "@aca/shared/updateValue";

export type FilterKindName = NotificationFilter["__typename"];

export type NotificationFilterKind<K extends FilterKindName> = NotificationFilter & { __typename: K };

export interface NotificationFilterOption<F extends NotificationFilter> {
  label: string;
  updater: FunctionUpdater<F>;
  isActive: (filter: F) => boolean;
}

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

export function pickFilterOfTypeFromFilters<T extends FilterKindName>(
  filters: NotificationFilter[],
  kind: T
): NotificationFilterKind<T> | null {
  for (const filter of filters) {
    if (getIsFilterOfType(filter, kind)) {
      return filter;
    }
  }

  return null;
}

export function pickFilterByClient(filters: NotificationFilter[], client: IntegrationClient) {
  for (const filter of filters) {
    if (getIsFilterOfType(filter, client.notificationTypename)) {
      return filter;
    }
  }

  return null;
}

export function assertFilterType<T extends FilterKindName>(
  filter: NotificationFilter,
  kind: T
): asserts filter is NotificationFilterKind<T> {
  if (getIsFilterOfType(filter, kind)) return;

  throw new Error("Nope");
}

export function unsafeAssertFilterType<T extends FilterKindName>(
  filter: NotificationFilter,
  kind: T
): asserts filter is NotificationFilterKind<T> {
  kind;
}

export interface FilterKindEditorProps {
  filter: NotificationFilter | null;
  onChange: (newValue: NotificationFilter) => void;
  onRemoveRequest: (filter: NotificationFilter) => void;
}
