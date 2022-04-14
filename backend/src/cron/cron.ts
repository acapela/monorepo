import { Request, Response, Router } from "express";

import { middlewareAuthenticateHasura } from "@aca/backend/src/actions/actions";
import { UnprocessableEntityError, isHttpError } from "@aca/backend/src/errors/errorTypes";
import { logger } from "@aca/shared/logger";

import { refreshExpiringAtlassianProperties } from "../atlassian/utils";
import { renewGmailWatchers } from "../gmail/capture";
import { HttpStatus } from "../http";
import { markSlackConversationsAsRead } from "../slack/events";

export const router = Router();

const handlers: Record<string, Function> = {
  "renew-gmail-watchers": renewGmailWatchers,
  "mark-slack-conversations-as-read": markSlackConversationsAsRead,
  "update-atlassian-refresh-token": refreshExpiringAtlassianProperties,
};

interface CronPayload {
  scheduled_time: string;
  payload: CronPayloadInfo;
  name: string;
  id: string;
}

interface CronPayloadInfo {
  handler: string;
}

router.post("/v1/cron", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
  const cronPayload = req.body as CronPayload;
  const cronName = cronPayload.payload.handler;

  logger.info(`Handling cron (${cronName})`);

  const cronHandler = handlers[cronName];
  if (!cronHandler) {
    throw new UnprocessableEntityError(`Unknown cron handler ${cronName}`);
  }

  try {
    const response = await cronHandler();
    res.status(HttpStatus.OK).json(response);
    logger.info(`Cron handled (${cronName})`);
  } catch (error) {
    isHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyError = error as any;
    const status = anyError.status || HttpStatus.BAD_REQUEST;
    res.status(status).json({
      message: anyError.message || "Something went wrong",
      code: `${status}`,
    });
    logger.error(anyError, `Failed handling cron (${cronName})`);
  }
});
