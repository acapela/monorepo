import fs from "fs";
import path from "path";

import { extractNotifications } from "./notificationExtractor";
import { Notification, UserInvitedActivityValue } from "./schema";

const recordJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record.json"), "utf8");
const record = JSON.parse(recordJSON);

const AMOUNT_OF_UNSUPPORTED_NOTIFICATIONS_IN_RECORD = 1;

describe("notion worker extraction tests", () => {
  it("extracts as many notifications as in record map", () => {
    const notificationPayloads = extractNotifications(record);
    expect(notificationPayloads).toHaveLength(
      record.notificationIds.length - AMOUNT_OF_UNSUPPORTED_NOTIFICATIONS_IN_RECORD
    );
  });

  it("creates notifications for reminders", () => {
    const reminderNotificationId = "e3f1ee43-0b09-4052-8469-a2b429718a74";
    const notificationPayloads = extractNotifications(record, {
      includeOnlyNotificationIds: [reminderNotificationId],
    });

    expect(record.recordMap.notification[reminderNotificationId].value.type).toBe("reminder");

    expect(notificationPayloads).toHaveLength(1);
    expect(notificationPayloads[0]).toStrictEqual({
      discussion_id: undefined,
      notification: {
        created_at: "2022-03-31T08:00:00.000Z",
        from: "Omar Duarte",
        text_preview: undefined,
        updated_at: "2022-03-31T08:00:00.000Z",
        url: "https://www.notion.so/aaded4aebd5c48aa971c6a46758a28dd",
      },
      notionNotification: {
        author_id: "34f3d0b4-ce31-468a-9cb5-f975bfcc2127",
        notion_original_notification_id: "e3f1ee43-0b09-4052-8469-a2b429718a74",
        page_id: "aaded4ae-bd5c-48aa-971c-6a46758a28dd",
        page_title: "Regular Page",
        synced_spaced_id: "be0e8964-2ea7-4113-9765-852cbee26e79",
      },
      type: "notification_notion_reminder",
    });
  });

  it("does not create notifications for `user-invited` to a `space`", () => {
    const invitationToSpaceNotificationId = "6fa59604-9cb9-41b4-bf33-4dc883c0951f";
    const notificationPayloads = extractNotifications(record, {
      includeOnlyNotificationIds: [invitationToSpaceNotificationId],
    });

    const notification = Notification.parse(record.recordMap.notification?.[invitationToSpaceNotificationId]?.value);

    const userInvitedActivity = UserInvitedActivityValue.parse(
      record.recordMap.activity?.[notification.activity_id]?.value
    );

    expect(userInvitedActivity.parent_table).toEqual("space");

    expect(notificationPayloads).toHaveLength(0);
  });

  it("fixes user-mentioned bug", () => {
    const recordUserMentionedJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record2.json"), "utf8");
    const recordUserMentioned = JSON.parse(recordUserMentionedJSON);
    const result = extractNotifications(recordUserMentioned);

    expect(result).toHaveLength(3);
  });
});
