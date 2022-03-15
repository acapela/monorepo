import { Request, Response, Router } from "express";

import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { handleLinearIssueChanges } from "@aca/backend/src/linear/events";
import { logger } from "@aca/shared/logger";

import { handleAccountUpdates } from "../atlassian";
import { hasuraEvents } from "./eventHandlers";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
hasuraEvents.addAnyEventHandler(handleCreateSyncRequests);

router.post("/v1/events", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
  await hasuraEvents.requestHandler(req, res);
});

function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractAndAssertBearerToken(req.get("Authorization") || "");

  if (!token) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }

  if (token !== process.env.HASURA_EVENT_SECRET) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }
  next();
}
