import { Request, Response, Router } from "express";

import { logger } from "~backend/src/logger";

import { extractAndAssertBearerToken } from "../authentication";
import { AuthenticationError, UnprocessableEntityError, isHttpError } from "../errors/errorTypes";
import { HasuraSessionVariables } from "../hasura/session";
import { HttpStatus } from "../http";
import { ActionHandler, handlers } from "./actionHandlers";

export const router = Router();

const actionHandlers = groupHandlersByActionName(handlers);

router.post("/v1/actions", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
  const hasuraAction = req.body as HasuraAction<string, unknown>;
  const userId = hasuraAction.session_variables["x-hasura-user-id"];

  logger.info(`Handling action (${hasuraAction.action.name})`, {
    userId,
  });

  const handler = actionHandlers.get(hasuraAction.action.name);
  if (!handler) {
    throw new UnprocessableEntityError(`Unknown action ${hasuraAction.action.name}`);
  }

  try {
    const response = await handler.handle(userId, hasuraAction.input);
    res.status(HttpStatus.OK).json(response);
    logger.info(`Action handled (${hasuraAction.action.name})`, {
      userId,
    });
  } catch (error) {
    isHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyError = error as any;
    const status = anyError.status || HttpStatus.BAD_REQUEST;
    res.status(status).json({
      message: anyError.message || "Something went wrong",
      code: `${status}`,
    });
    logger.info("Failed handling action", {
      actionName: hasuraAction.action.name,
      userId,
      failureReason: anyError.message,
      status: status,
    });
  }
});

export function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractAndAssertBearerToken(req.get("Authorization") || "");

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
