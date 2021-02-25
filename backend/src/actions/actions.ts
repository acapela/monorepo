import { Router, Request, Response } from "express";
import { extractToken } from "../authentication";
import { AuthenticationError, UnprocessableEntityError } from "../errors";
import { ActionHandler, handlers } from "./actionHandlers";
import logger from "../logger";
import { HasuraSessionVariables } from "../events/events";

export const router = Router();

const actionHandlers = groupHandlersByActionName(handlers);

router.post("/v1/actions", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
  const hasuraAction = req.body as HasuraAction<string, unknown>;
  const userId = hasuraAction.session_variables["x-hasura-user-id"];
  if (!userId) {
    throw new AuthenticationError("No user id provided with a hasura action");
  }

  logger.info("Handling action", {
    actionName: hasuraAction.action.name,
    userId,
  });

  const handler = actionHandlers.get(hasuraAction.action.name);
  if (!handler) {
    throw new UnprocessableEntityError(`Unknown action ${hasuraAction.action.name}`);
  }

  try {
    const response = await handler.handle(userId, hasuraAction.input);
    res.status(200).json(response);
    logger.info("Action handled", {
      actionName: hasuraAction.action.name,
      userId,
    });
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({
      message: error.message || "Something went wrong",
      code: `${status}`,
    });
    logger.info("Failed handling action", {
      actionName: hasuraAction.action.name,
      userId,
      failureReason: error.message,
      status: status,
    });
  }
});

function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractToken(req.get("Authorization") || "");

  if (!token) {
    throw new AuthenticationError("Hasura action call done with invalid secret");
  }

  if (token !== process.env.HASURA_ACTION_SECRET) {
    throw new AuthenticationError("Hasura action call done with invalid secret");
  }
  next();
}

function groupHandlersByActionName(
  handlers: ActionHandler<unknown, unknown>[]
): Map<string, ActionHandler<unknown, unknown>> {
  return handlers.reduce((map, handler) => {
    if (map.has(handler.actionName)) {
      throw new Error(`Duplicate action handler found for action ${handler.actionName}`);
    }
    return map.set(handler.actionName, handler);
  }, new Map());
}

export interface HasuraAction<Name extends string, ArgumentT> {
  action: {
    name: Name;
  };
  input: ArgumentT;
  session_variables: HasuraSessionVariables;
}
