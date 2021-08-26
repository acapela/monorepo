import { Request, Response, Router } from "express";

import { middlewareAuthenticateHasura } from "~backend/src/actions/actions";
import { recurringMeetingCronHandler } from "~backend/src/cron/recurring-meetings";
import { UnprocessableEntityError, isHttpError } from "~backend/src/errors/errorTypes";
import logger from "~shared/logger";

export const router = Router();

const handlers: Record<string, Function> = {
  "recurring-meetings": recurringMeetingCronHandler,
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
    res.status(200).json(response);
    logger.info(`Cron handled (${cronName})`);
  } catch (error) {
    isHttpError(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyError = error as any;
    const status = anyError.status || 400;
    res.status(status).json({
      message: anyError.message || "Something went wrong",
      code: `${status}`,
    });
    logger.info(`Failed handling cron (${cronName})`, {
      failureReason: anyError.message,
      status: status,
    });
  }
});
