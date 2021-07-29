import { HasuraSessionVariables } from "./session";

type OperationType = "INSERT" | "UPDATE" | "DELETE" | "MANUAL";

type CommonHasuraEventData = {
  userId: string | null;
};

export type CrateHasuraEvent<T> = {
  type: "create";
  item: T;
  itemBefore: null;
} & CommonHasuraEventData;

export type DeleteHasuraEvent<T> = {
  type: "delete";
  item: T;
  itemBefore: null;
} & CommonHasuraEventData;

export type UpdateHasuraEvent<T> = {
  type: "update";
  item: T;
  itemBefore: T;
} & CommonHasuraEventData;

export type HasuraEvent<T> = CrateHasuraEvent<T> | DeleteHasuraEvent<T> | UpdateHasuraEvent<T>;

export function getUserIdFromRawHasuraEvent<T>(rawEvent: RawHasuraEvent<T>) {
  return rawEvent.event.session_variables?.["x-hasura-user-id"] ?? null;
}

export function normalizeHasuraEvent<T>(rawEvent: RawHasuraEvent<T>): HasuraEvent<T> | null {
  const item = rawEvent.event.data.new;
  const itemBefore = rawEvent.event.data.old ?? null;

  const eventType = rawEvent.event.op;

  if (eventType === "INSERT") {
    return {
      type: "create",
      item: item!,
      itemBefore: null,
      userId: getUserIdFromRawHasuraEvent(rawEvent),
    };
  }

  if (eventType === "UPDATE") {
    return {
      type: "update",
      item: item!,
      itemBefore: itemBefore!,
      userId: getUserIdFromRawHasuraEvent(rawEvent),
    };
  }

  if (eventType === "DELETE") {
    return {
      type: "delete",
      item: itemBefore!,
      itemBefore: null,
      userId: getUserIdFromRawHasuraEvent(rawEvent),
    };
  }

  return null;
}

export interface BaseHasuraEvent<Type extends OperationType, OldDataT, NewDataT> {
  id: string;
  created_at: string;
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
  event: {
    session_variables: HasuraSessionVariables;
    op: Type;
    data: {
      old: OldDataT;
      new: NewDataT;
    };
  };
}

export type RawHasuraEvent<DataT> = InsertEvent<DataT> | UpdateEvent<DataT> | DeleteEvent<DataT> | ManualEvent<DataT>;

export type InsertEvent<DataT> = BaseHasuraEvent<"INSERT", null, DataT>;
export type UpdateEvent<DataT> = BaseHasuraEvent<"UPDATE", DataT, DataT>;
export type DeleteEvent<DataT> = BaseHasuraEvent<"DELETE", DataT, null>;
export type ManualEvent<DataT> = BaseHasuraEvent<"MANUAL", null, DataT>;
