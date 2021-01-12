import { AxiosResponse } from "axios";
import logger from "../logger";
import config from "../config";

import Hasura, { ScheduleRequestResponse } from "../hasura";
import { NotificationName } from "./UserNotification";

export async function scheduleNotifications(roomId: string): Promise<ScheduleRequestResponse> {
  logger.info(`Scheduling notification cron task`, { roomId });
  // TODO: should we somehow authenticate the request coming from the web app?
  const rootUrl: string = config.get("backend.rootUrl");

  const notificationsToSchedule: Array<NotificationName> = ["Invite", "RoomExpired", "UnseenMessages", "RoomUnchecked"];

  const hasuraResponse: AxiosResponse<ScheduleRequestResponse> = await Hasura.scheduleJob({
    name: roomId,
    webhook: `${rootUrl}/api/v1/notifications`,
    schedule: "*/10 * * * *",
    payload: {
      roomId: roomId,
      notifications: notificationsToSchedule,
    },
    include_in_metadata: false,
    comment: `Notification cron job for room with id ${roomId}`,
    headers: {
      Authorization: `Bearer ${config.get("hasura.notificationSecret")}`,
    },
  });

  return hasuraResponse.data;
}
