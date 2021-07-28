import { Request, Response } from "express";
import logger from "~shared/logger";
import { mapGetOrCreate } from "~shared/map";
import { convertMaybeArrayToArray } from "~shared/array";
import { HasuraSessionVariables } from "./session";

type EntitiesEventsMapBase = Record<string, unknown>;

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

type OperationTypeHandler<T> = (event: HasuraEvent<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SingleTriggerHandlers = Map<OperationType, OperationTypeHandler<any>[]>;

function getUserIdFromRawHasuraEvent<T>(rawEvent: RawHasuraEvent<T>) {
  return rawEvent.event.session_variables?.["x-hasura-user-id"] ?? null;
}

function normalizeHasuraEvent<T>(rawEvent: RawHasuraEvent<T>): HasuraEvent<T> | null {
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

export function createHasuraEventsHandler<T extends EntitiesEventsMapBase>() {
  const triggerHandlersMap = new Map<string, SingleTriggerHandlers>();
  type TriggerName = keyof T & string;

  function getTriggerOperationTypeHandlers(triggerName: string, operationType: OperationType) {
    const triggerHandlers = mapGetOrCreate(triggerHandlersMap, triggerName, () => new Map());
    const operationTypeHandlers = mapGetOrCreate(triggerHandlers, operationType, () => []);

    return operationTypeHandlers;
  }

  function addHandler<TN extends TriggerName>(
    triggerName: TN,
    operationType: OperationType | OperationType[],
    handler: OperationTypeHandler<T[TN]>
  ) {
    const operationTypes = convertMaybeArrayToArray(operationType);

    for (const operationType of operationTypes) {
      const operationTypeHandlers = getTriggerOperationTypeHandlers(triggerName, operationType);

      operationTypeHandlers.push(handler);
    }
  }

  async function handleHasuraEvent<T>(event: RawHasuraEvent<T>, userId: string | null) {
    const triggerName = event.trigger.name;
    const operationType = event.event.op;

    const operationTypeHandlers = getTriggerOperationTypeHandlers(triggerName, operationType);

    const normalizedEvent = normalizeHasuraEvent(event);

    if (!normalizedEvent) {
      logger.warn(`Failed to normalize hasura event`, { event });
      return;
    }

    for (const handler of operationTypeHandlers) {
      await handler(normalizedEvent);
    }
  }

  async function requestHandler(req: Request, res: Response) {
    const hasuraEvent = req.body as RawHasuraEvent<unknown>;
    const userId = hasuraEvent.event.session_variables?.["x-hasura-user-id"] ?? null;

    logger.info("Handling event", {
      eventId: hasuraEvent.id,
      triggerName: hasuraEvent.trigger.name,
      userId,
    });

    await handleHasuraEvent(hasuraEvent, userId);

    logger.info("Handled event", {
      eventId: hasuraEvent.id,
      triggerName: hasuraEvent.trigger.name,
      userId,
    });
    res.status(200).json({
      id: hasuraEvent.id,
      trigger: {
        name: hasuraEvent.trigger.name,
      },
    });
  }

  return {
    addHandler,
    requestHandler,
  };
}

export type RawHasuraEvent<DataT> = InsertEvent<DataT> | UpdateEvent<DataT> | DeleteEvent<DataT> | ManualEvent<DataT>;

export type InsertEvent<DataT> = BaseHasuraEvent<"INSERT", null, DataT>;
export type UpdateEvent<DataT> = BaseHasuraEvent<"UPDATE", DataT, DataT>;
export type DeleteEvent<DataT> = BaseHasuraEvent<"DELETE", DataT, null>;
export type ManualEvent<DataT> = BaseHasuraEvent<"MANUAL", null, DataT>;

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
