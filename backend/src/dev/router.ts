import { Router } from "express";

import { createOnboardingHandler } from "./onboarding";
import { slackBlocksPreviewHandler } from "./slackPreview";

export const router = Router();

/**
 * This endpoint handles user signup calls from the landing page
 */
router.get("/v1/dev/onboarding/:userId", createOnboardingHandler);

router.post("/v1/dev/slack-blocks", slackBlocksPreviewHandler);
