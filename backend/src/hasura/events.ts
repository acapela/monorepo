import { Request, Response } from "express";
import logger from "~shared/logger";
import { mapGetOrCreate } from "~shared/map";
import { convertMaybeArrayToArray } from "~shared/array";
import { AuthenticationError } from "../errors";
import { HasuraSessionVariables } from "./session";

type EntitiesEventsMapBase = Record<string, unknown>;

type OperationType = "INSERT" | "UPDATE" | "DELETE" | "MANUAL";

type OperationTypeHandler<T> = (item: T, userId: string) => void;

type SingleTriggerHandlers = Map<OperationType, OperationTypeHandler<any>[]>;

export function createHasuraEventsHandler<T extends EntitiesEventsMapBase>() {
  const triggerHandlersMap = new Map<string, SingleTriggerHandlers>();
  type TriggerName = keyof T & string;

  function getTriggerOperationTypeHandlers(triggerName: string, operationType: OperationType) {
    const triggerHandlers = mapGetOrCreate(triggerHandlersMap, triggerName, () => new Map());
    const operationTypeHandlers = mapGetOrCreate(triggerHandlers, operationType, () => []);

    return operationTypeHandlers;
  }

  2;

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

  async function handleHasuraEvent(event: HasuraEvent<unknown>, userId: string) {
    const triggerName = event.trigger.name;
    const operationType = event.event.op;

    const operationTypeHandlers = getTriggerOperationTypeHandlers(triggerName, operationType);
    console.log({ triggerName, operationType, operationTypeHandlers });

    for (const handler of operationTypeHandlers) {
      await handler(event.event.data.new, userId);
    }
  }

  async function requestHandler(req: Request, res: Response) {
    const hasuraEvent = req.body as HasuraEvent<unknown>;
    const userId = hasuraEvent.event.session_variables["x-hasura-user-id"];
    if (!userId) {
      throw new AuthenticationError("No user id provided with a hasura event");
    }

    logger.info("Handling event", {
      eventId: hasuraEvent.id,
      triggerName: hasuraEvent.trigger.name,
      userId,
    });

    console.log("okidoki");

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

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const handlers: EventHandler<any>[] = [handleRoomCreated, handleInviteCreated, handleMessageCreated];

export type HasuraEvent<DataT> = InsertEvent<DataT> | UpdateEvent<DataT> | DeleteEvent<DataT> | ManualEvent<DataT>;

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
