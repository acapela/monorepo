import { Request, Response, Router } from "express";

import { db } from "~db";
import { assert } from "~shared/assert";
import { IS_DEV } from "~shared/dev";

import { createOnboardingTopicsWithBot } from "../bot/createOnboardingTopics";
import { HttpStatus } from "../http";

export const router = Router();

/**
 * This endpoint handles user signup calls from the landing page
 */
router.get("/v1/dev/onboarding/:userId", async (req: Request, res: Response) => {
  assert(IS_DEV, "Not in dev mode");

  const userId = req.params.userId;

  const user = await db.user.findUnique({ where: { id: userId } });

  assert(user, "No user for onboarding");

  assert(user.current_team_id, "No current team, cannot create onboarding");

  await createOnboardingTopicsWithBot(userId, user.current_team_id);

  res.json({ status: "Created onboarding" }).status(HttpStatus.OK).end();
});
