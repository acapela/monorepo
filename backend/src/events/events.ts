import { Request, Response, Router } from "express";
import logger from "~shared/logger";
import { extractToken } from "../authentication";
import { AuthenticationError, UnprocessableEntityError } from "../errors";
import { EventHandler, handlers } from "./eventHandlers";

export const router = Router();
const eventHandlers = groupHandlersByTriggerName(handlers);

router.post("/v1/events", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
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

  const handler = eventHandlers.get(hasuraEvent.trigger.name);
  if (!handler) {
    throw new UnprocessableEntityError(`Unknown trigger ${hasuraEvent.trigger.name}`);
  }

  await handleEvent(handler, hasuraEvent, userId);

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
});

function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractToken(req.get("Authorization") || "");

  if (!token) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }

  if (token !== process.env.HASURA_EVENT_SECRET) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }
  next();
}

async function handleEvent(handler: EventHandler<unknown>, event: HasuraEvent<unknown>, userId: string): Promise<void> {
  const failBecauseOfMissingOperationHandler = (operation: HasuraEventOperation) => {
    throw new UnprocessableEntityError(`No ${operation} handler for trigger ${event.trigger.name} is defined`);
  };

  switch (event.event.op) {
    case HasuraEventOperation.INSERT:
      if (handler.handleInsert) {
        await handler.handleInsert(userId, event.event.data.new);
      } else {
        failBecauseOfMissingOperationHandler(HasuraEventOperation.INSERT);
      }
      break;
    case HasuraEventOperation.UPDATE:
      if (handler.handleUpdate) {
        await handler.handleUpdate(userId, event.event.data.old, event.event.data.new);
      } else {
        failBecauseOfMissingOperationHandler(HasuraEventOperation.UPDATE);
      }
      break;
    case HasuraEventOperation.DELETE:
      if (handler.handleDelete) {
        await handler.handleDelete(userId, event.event.data.old);
      } else {
        failBecauseOfMissingOperationHandler(HasuraEventOperation.DELETE);
      }
      break;
    case HasuraEventOperation.MANUAL:
      if (handler.handleManual) {
        await handler.handleManual(userId, event.event.data.new);
      } else {
        failBecauseOfMissingOperationHandler(HasuraEventOperation.UPDATE);
      }
      break;
  }
}

function groupHandlersByTriggerName(handlers: EventHandler<unknown>[]): Map<string, EventHandler<unknown>> {
  return handlers.reduce((map, handler) => {
    if (map.has(handler.triggerName)) {
      throw new Error(`Duplicate event handler found for trigger ${handler.triggerName}`);
    }
    return map.set(handler.triggerName, handler);
  }, new Map());
}

export type HasuraEvent<DataT> = InsertEvent<DataT> | UpdateEvent<DataT> | DeleteEvent<DataT> | ManualEvent<DataT>;

export type InsertEvent<DataT> = BaseHasuraEvent<HasuraEventOperation.INSERT, null, DataT>;
export type UpdateEvent<DataT> = BaseHasuraEvent<HasuraEventOperation.UPDATE, DataT, DataT>;
export type DeleteEvent<DataT> = BaseHasuraEvent<HasuraEventOperation.DELETE, DataT, null>;
export type ManualEvent<DataT> = BaseHasuraEvent<HasuraEventOperation.MANUAL, null, DataT>;

export interface BaseHasuraEvent<OperationT extends HasuraEventOperation, OldDataT, NewDataT> {
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
    op: OperationT;
    data: {
      old: OldDataT;
      new: NewDataT;
    };
  };
}

export interface HasuraSessionVariables {
  "x-hasura-user-id"?: string;
  "x-hasura-role"?: string;
  "x-hasura-allowed-roles"?: string[];
}

export enum HasuraEventOperation {
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MANUAL = "MANUAL",
}
