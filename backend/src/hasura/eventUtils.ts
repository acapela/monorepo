import { HasuraSessionVariables } from "./session";

type OperationType = "INSERT" | "UPDATE" | "DELETE" | "MANUAL";

type CommonHasuraEventData = {
  date: Date;
  userId: string | null;
  tableName: string;
};

export type CreateHasuraEvent<T> = {
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

export type HasuraEvent<T> = CreateHasuraEvent<T> | DeleteHasuraEvent<T> | UpdateHasuraEvent<T>;

export function getUserIdFromRawHasuraEvent<T>(rawEvent: RawHasuraEvent<T>) {
  return rawEvent.event.session_variables?.["x-hasura-user-id"] ?? null;
}

export function normalizeHasuraEvent<T>(rawEvent: RawHasuraEvent<T>): HasuraEvent<T> | null {
  const item = rawEvent.event.data.new;
  const itemBefore = rawEvent.event.data.old ?? null;

  const date = new Date(rawEvent.created_at);

  const eventType = rawEvent.event.op;

  const commonEventData: CommonHasuraEventData = {
    userId: getUserIdFromRawHasuraEvent(rawEvent),
    tableName: rawEvent.table.name,
    date,
  };

  if (eventType === "INSERT") {
    return {
      type: "create",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      item: item!,
      itemBefore: null,
      ...commonEventData,
    };
  }

  if (eventType === "UPDATE") {
    return {
      type: "update",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      item: item!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      itemBefore: itemBefore!,
      ...commonEventData,
    };
  }

  if (eventType === "DELETE") {
    return {
      type: "delete",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      item: itemBefore!,
      itemBefore: null,
      ...commonEventData,
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
