import { Request, Response } from "express";

import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";

import { createOnboardingTopicsWithBot } from "../bot/createOnboardingTopics";
import { HttpStatus } from "../http";

/**
 * This endpoint handles user signup calls from the landing page
 */
export const createOnboardingHandler = async (req: Request, res: Response) => {
  assert(IS_DEV, "Not in dev mode");

  const userId = req.params.userId;

  const user = await db.user.findUnique({ where: { id: userId } });

  assert(user, "No user for onboarding");

  assert(user.current_team_id, "No current team, cannot create onboarding");

  await createOnboardingTopicsWithBot(userId, user.current_team_id);

  res.json({ status: "Created onboarding" }).status(HttpStatus.OK).end();
};
