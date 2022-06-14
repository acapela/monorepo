import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { createGmailClientForAccount } from "./capture";

export async function revertGmailMessageToUnread(innerNotificationId: string, userId?: string) {
  console.info("Reverting gmail read for", innerNotificationId);

  const gmailNotification = await db.notification_gmail.findUnique({
    where: {
      id: innerNotificationId,
    },
    include: {
      notification: true,
      gmail_account: { include: { account: { include: { user: true } } } },
    },
  });

  console.info(`Subject ${gmailNotification?.notification.text_preview}`);

  assert(gmailNotification, `No gmail notification found for ${innerNotificationId}`);
  assert(
    gmailNotification.notification.user_id === userId,
    `Security error userId ${userId} attempting to access ${innerNotificationId}`
  );

  // The gmail message has already been seen. No need to the toUnread
  if (gmailNotification.notification.last_seen_at) {
    return;
  }

  const { gmail_account, gmail_message_id } = gmailNotification;
  const { account } = gmail_account;

  const gmail = createGmailClientForAccount(account);
  try {
    await gmail.users.messages.modify({
      userId: account.provider_account_id,
      id: gmail_message_id,
      requestBody: { addLabelIds: ["UNREAD"] },
    });
    logger.info("Mark gmail message as unread: " + gmail_message_id);
  } catch (error) {
    logger.error(error);
  }
}
