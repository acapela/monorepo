import { Request, Response } from "express";

import { convertMaybeArrayToArray } from "~shared/array";
import { IS_DEV } from "~shared/dev";
import { logger } from "~shared/logger";
import { mapGetOrCreate } from "~shared/map";

import { HasuraEvent, RawHasuraEvent, getUserIdFromRawHasuraEvent, normalizeHasuraEvent } from "./eventUtils";

type EntitiesEventsMapBase = Record<string, unknown>;

type OperationType = "INSERT" | "UPDATE" | "DELETE" | "MANUAL";

type OperationTypeHandler<T> = (event: HasuraEvent<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SingleTriggerHandlers = Map<OperationType, OperationTypeHandler<any>[]>;

export function createHasuraEventsHandler<T extends EntitiesEventsMapBase>() {
  const triggerHandlersMap = new Map<string, SingleTriggerHandlers>();
  const anyEventHandlers = new Set<OperationTypeHandler<unknown>>();
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

  function addAnyEventHandler(handler: OperationTypeHandler<unknown>) {
    anyEventHandlers.add(handler);
  }

  async function handleHasuraEvent<T>(event: RawHasuraEvent<T>) {
    const triggerName = event.trigger.name;
    const operationType = event.event.op;

    const operationTypeHandlers = getTriggerOperationTypeHandlers(triggerName, operationType);

    const normalizedEvent = normalizeHasuraEvent(event);

    if (!normalizedEvent) {
      logger.warn({ event }, `Failed to normalize hasura event`);
      return;
    }

    anyEventHandlers.forEach((anyEventHandler) => {
      anyEventHandler(normalizedEvent);
    });

    for (const handler of operationTypeHandlers) {
      await handler(normalizedEvent);
    }
  }

  async function requestHandler(req: Request, res: Response) {
    const hasuraEvent = req.body as RawHasuraEvent<unknown>;
    const userId = getUserIdFromRawHasuraEvent(hasuraEvent);

    if (IS_DEV) {
      logger.info(`Handling event (${hasuraEvent.trigger.name})`);
    } else {
      logger.info(
        {
          eventId: hasuraEvent.id,
          triggerName: hasuraEvent.trigger.name,
          userId,
        },
        "Handling event"
      );
    }

    await handleHasuraEvent(hasuraEvent);

    if (IS_DEV) {
      logger.info(`Handled event (${hasuraEvent.trigger.name})`);
    } else {
      logger.info("Handled event", {
        eventId: hasuraEvent.id,
        triggerName: hasuraEvent.trigger.name,
        userId,
      });
    }

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
    addAnyEventHandler,
  };
}
