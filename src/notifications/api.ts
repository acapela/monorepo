import { Router, Request, Response } from "express";

import { sendNotifcations } from "./sendNotification";
import { scheduleNotifications } from "./scheduleNotifications";
import { ScheduleRequestResponse } from "../hasura";
import { HttpStatus } from "../http";
import logger from "../logger";
import { AxiosError } from "axios";
import { NotificationName } from "./UserNotification";
import { validateSecret } from "../utils";

export const router = Router();

export interface ScheduleRequest {
  roomId: string;
}

/**
 * Endpoint to schedule a Hasura cron job for sending notifications
 *
 * @remarks
 * The function will be called by the old webapp when creating a new room.
 *
 * @param body - The body has to include roomId as a parameter.
 * @returns Status code 200 when successful, otherwise 500
 */

router.post(
  "/v1/notifications/schedule",
  validateSecret("backend.authToken", "Invalid secret provided for scheduling notifications"),
  async (req: Request, res: Response) => {
    const scheduleReq: ScheduleRequest = req.body as ScheduleRequest;

    try {
      const resData: ScheduleRequestResponse = await scheduleNotifications(scheduleReq.roomId);

      if (resData.message === "success") {
        res.sendStatus(HttpStatus.OK);
        logger.info(`Handled notification cron job for room ${scheduleReq.roomId}`);
      }
    } catch (e) {
      if ((e as AxiosError).response?.status === HttpStatus.BAD_REQUEST) {
        res.sendStatus(HttpStatus.BAD_REQUEST);
        logger.info(`Room with id ${scheduleReq.roomId} already exists`, {
          roomId: scheduleReq.roomId,
          error: e,
        });
      } else {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        logger.info(`Failed to create notification job for room ${scheduleReq.roomId}`, {
          roomId: scheduleReq.roomId,
          error: e,
        });
      }
    }
  }
);

type HasuraWebhook<T> = {
  payload: {
    payload: T;
  };
};

type SendNotificationTriggerPayload = {
  roomId: string;
  notifications: Array<NotificationName>;
};

router.post(
  "/v1/notifications",
  validateSecret("hasura.notificationSecret", "Invalid secret provided for sending notifications"),
  async (req: Request, res: Response) => {
    const triggerRequest = req.body as HasuraWebhook<SendNotificationTriggerPayload>;
    const trigger: SendNotificationTriggerPayload = triggerRequest.payload.payload;

    // check which kind of notifications the trigger wants to run
    const namesOfNotificationsToProcess: Array<NotificationName> = trigger.notifications;

    try {
      await sendNotifcations(namesOfNotificationsToProcess, trigger.roomId);

      res.status(HttpStatus.OK);
      res.send(namesOfNotificationsToProcess);
    } catch (e) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      logger.error(`Failed to process notifications for room ${trigger.roomId}`, {
        error: e,
      });
    }
  }
);
