import { Router, Request, Response } from "express";
import config from "../config";
import { extractToken } from "../authentication";
import { AuthenticationError, UnprocessableEntityError } from "../errors";
import { EventHandler, handlers } from "./eventHandlers";
import logger from "../logger";

export const router = Router();
const eventHandlers = groupHandlersByTriggerName(handlers);

router.post("/v1/events", authenticateHasura, async (req: Request, res: Response) => {
  const hasuraEvent = req.body as HasuraEvent<unknown>;
  logger.info(`Handling event ${hasuraEvent.id} of type ${hasuraEvent.trigger.name}`);
  if (!hasuraEvent.event.session_variables["x-hasura-user-id"]) {
    throw new AuthenticationError("No user id provided with a hasura event");
  }
  const userId = hasuraEvent.event.session_variables["x-hasura-user-id"];
  const handler = eventHandlers.get(hasuraEvent.trigger.name);
  if (!handler) {
    throw new UnprocessableEntityError(`Unknown trigger ${hasuraEvent.trigger.name}`);
  }

  await handleEvent(handler, hasuraEvent, userId);

  res.status(200).json({
    id: hasuraEvent.id,
    trigger: {
      name: hasuraEvent.trigger.name,
    },
  });
  logger.info(`Handled event ${hasuraEvent.id} of type ${hasuraEvent.trigger.name}`);
});

function authenticateHasura(req: Request, res: Response, next: () => any) {
  const token = extractToken(req.get("Authorization") || "");
  if (token !== config.get("hasura.eventSecret")) {
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
  const map = new Map();
  handlers.forEach((handler) => {
    if (map.has(handler.triggerName)) {
      throw new Error(`Duplicate event handler found for trigger ${handler.triggerName}`);
    }
    map.set(handler.triggerName, handler);
  });
  return map;
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
