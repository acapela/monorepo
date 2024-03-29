import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { PubSub } from "@google-cloud/pubsub";
import * as Sentry from "@sentry/node";
import { subMinutes } from "date-fns";
import { gmail_v1, google } from "googleapis";
import { uniqWith } from "lodash";
import { Account as NextAuthAccount } from "next-auth";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { Account, GmailAccount, db } from "@aca/db";
import { assertDefined } from "@aca/shared/assert";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";
import { isNotNullish } from "@aca/shared/nullish";

import { createDriveNotification, isDriveEmail } from "./driveCapture";
import { findHeader } from "./utils";

/**
 * This is how the Gmail integrations works at a high level:
 * - Within GCP's PubSub we have created a topic and a related subscription, with publishing rights for Gmail.
 * - When our server starts we set up an event listener for that subscription.
 * There are three types of events which tie into this flow:
 * - When users connect their gmail we add a watch for their inbox, connecting it to the aforementioned topics.
 * - Now, whenever a new email is received by that user, Gmail publishes it to our topic.
 * - After a day we renew all those watches, as that is required by Gmail's API.
 */

const { GMAIL_TOPIC_NAME, GMAIL_SUBSCRIPTION_NAME } = process.env as Record<string, string>;

export const createGmailClientForAccount = (account: Account) => {
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ access_token: account.access_token, refresh_token: account.refresh_token });
  return google.gmail({ version: "v1", auth });
};

/**
 * Adds the given account's gmail inbox to the PubSub topic we are subscribed to, thus triggering a message event
 * when a new email is received for that account.
 */
async function addGmailInboxWatcher(account: Account) {
  const gmail = createGmailClientForAccount(account);
  const { data } = await gmail.users.watch({
    userId: account.provider_account_id,
    requestBody: {
      topicName: GMAIL_TOPIC_NAME,
      labelIds: ["INBOX"],
    },
  });
  const { historyId } = data;
  return db.gmail_account.upsert({
    where: { account_id: account.id },
    create: { account_id: account.id, last_history_id: historyId ? Number(historyId) : null },
    update: {},
  });
}

async function createNotificationFromMessage(gmailAccountId: string, account: Account, gmailMessageId: string) {
  const gmail = createGmailClientForAccount(account);
  const { data: message } = await gmail.users.messages
    .get({ id: gmailMessageId, userId: account.provider_account_id, format: "metadata" })
    .catch(() => ({ data: null }));
  if (!message?.id) {
    return;
  }
  const headers = message.payload?.headers ?? [];
  const from = findHeader(headers, "From");
  const subject = findHeader(headers, "Subject");
  const date = findHeader(headers, "Date");
  if (!from || !subject) {
    logger.error(
      new Error(`Missing from or subject for message ${message.id} with headers ${JSON.stringify(headers)}`)
    );
    return;
  }

  if (isDriveEmail(from)) {
    const { data: fullEmailData } = await gmail.users.messages
      .get({ id: gmailMessageId, userId: account.provider_account_id, format: "full" })
      .catch(() => ({ data: null }));

    if (fullEmailData) {
      const driveNotificationCreationResult = await createDriveNotification({
        email: fullEmailData,
        gmailMessageId,
        gmailAccountId: gmailAccountId,
        account,
      });
      if (driveNotificationCreationResult.isSuccessful) {
        return;
      }
    }
  }

  const [fromName, emailWithClosingAngle] = from.split(" <");
  const email = emailWithClosingAngle ? emailWithClosingAngle.slice(0, -1) : fromName;
  if (email.toLowerCase() == account.email?.toLowerCase()) {
    return;
  }
  let createdAt;
  if (date) {
    try {
      createdAt = new Date(date).toISOString();
    } catch (error) {
      logger.error(error, `failed to parse date ${date}`);
    }
  }
  await db.notification_gmail.upsert({
    where: { gmail_message_id: message.id },
    create: {
      notification: {
        create: {
          user_id: account.user_id,
          // this assumes only one account being logged in
          url: "https://mail.google.com/mail/u/0/#inbox/" + message.id,
          from: fromName,
          text_preview: subject,
          created_at: createdAt,
          last_seen_at: message.labelIds?.includes("UNREAD") ? null : new Date(),
        },
      },
      gmail_account: { connect: { id: gmailAccountId } },
      gmail_message_id: message.id,
      gmail_thread_id: message.threadId,
    },
    update: {},
  });
}

export async function setupGmailWatcher(authAccount: NextAuthAccount) {
  try {
    const account = await db.account.findFirst({
      where: { provider_id: "google", provider_account_id: authAccount.providerAccountId },
    });
    if (!account) {
      return;
    }

    const gmailAccount = await addGmailInboxWatcher(account);

    const gmail = createGmailClientForAccount(account);
    const { data } = await gmail.users.messages.list({ userId: account.provider_account_id, labelIds: ["INBOX"] });
    for (const messageId of (data.messages ?? []).map((m) => m.id).filter(isNotNullish)) {
      await createNotificationFromMessage(gmailAccount.id, account, messageId);
    }

    trackBackendUserEvent(account.user_id, "Gmail Integration Added");
    trackBackendUserEvent(account.user_id, "New Integration Added", { integration: "gmail" });
  } catch (error) {
    logger.error(error, "Error setting up Gmail watcher");
  }
}

/**
 * Mailbox watches need to be renewed every 7 days, though Google recommends every day. Thus, we call this function
 * with a Hasura cron every day.
 * https://developers.google.com/gmail/api/guides/push#renewing_mailbox_watch
 */
export async function renewGmailWatchers() {
  const gmailAccounts = await db.gmail_account.findMany({ include: { account: true } });
  for (const { account } of gmailAccounts) {
    try {
      await addGmailInboxWatcher(account);
    } catch (error) {
      logger.error(error, `Failed to maintain gmail watcher for account ${account.id}`);
    }
  }
}

export async function handleGmailAccountUpdates(event: HasuraEvent<GmailAccount>) {
  if (event.type !== "delete") {
    return;
  }
  const id = event.item.account_id;
  const account = assertDefined(await db.account.findUnique({ where: { id } }), `Missing account for id ${id}`);
  const gmail = createGmailClientForAccount(account);
  await gmail.users.stop({ userId: account.provider_account_id });
}

async function resolveArchivedMessageNotifications(history: gmail_v1.Schema$History[]) {
  const archivedMessageIds = (history ?? [])
    .flatMap((h) => h.labelsRemoved ?? [])
    .filter((r) => r.labelIds?.includes("INBOX"))
    .map((r) => r.message?.id)
    .filter(isNotNullish);
  await db.notification.updateMany({
    where: { notification_gmail: { some: { gmail_message_id: { in: archivedMessageIds } } } },
    data: { resolved_at: new Date().toISOString() },
  });
}

async function handleReadStateInNotifications(history: gmail_v1.Schema$History[]) {
  // [{historyIndex: 5, id: 3}, {historyIndex:4, id:3},{historyIndex:3, id:2}]
  const markedAsReadMessageIds = (history ?? [])
    .flatMap((h) => (h.labelsRemoved ? h.labelsRemoved.map((la) => ({ id: h.id, ...la })) : []))
    .filter((r) => r.labelIds?.includes("UNREAD"))
    .map((r) => ({ historyIndex: r.id, id: r.message?.id }))
    .filter((props) => props.historyIndex && props.id)
    .reverse() as { historyIndex: string; id: string }[];

  const dedupedMarkedAsReadMessageIds = uniqWith(markedAsReadMessageIds, function comparator(a, b) {
    return a.id === b.id;
  });

  // [{historyIndex: 5, id: 3}, {historyIndex:4, id:3},{historyIndex:3, id:2}]
  const markedAsUnreadMessageIds = (history ?? [])
    .flatMap((h) => (h.labelsAdded ? h.labelsAdded.map((la) => ({ id: h.id, ...la })) : []))
    .filter((r) => r.labelIds?.includes("UNREAD"))
    .map((r) => ({ historyIndex: r.id, id: r.message?.id }))
    .filter((props) => !!props.historyIndex && !!props.id)
    .reverse() as { historyIndex: string; id: string }[];

  const dedupedMarkedAsUnreadMessageIds = uniqWith(markedAsUnreadMessageIds, function comparator(a, b) {
    return a.id === b.id;
  });

  /*
   We can have multiple opposite updates in a single history batch.
   This algo works for cases in which a single gmailMessageId was markedAsRead and markedAsUnread more than once in a 
   single batch.

   We're doing this by finding the "last update" that happened in the batch, based on the historyIndex (largest number means
    it happened later).
  */
  for (let i = 0; i < dedupedMarkedAsReadMessageIds.length; i++) {
    const markedAsRead = dedupedMarkedAsReadMessageIds[i];
    const sameMessageMarkedAsUnreadIndex = dedupedMarkedAsUnreadMessageIds.findIndex((m) => m.id === markedAsRead.id);

    if (sameMessageMarkedAsUnreadIndex < 0) {
      continue;
    }

    const sameMessageMarkedAsUnread = dedupedMarkedAsUnreadMessageIds[sameMessageMarkedAsUnreadIndex];

    if (sameMessageMarkedAsUnread) {
      const wasMarkedAsUnreadAfterMarkedAsRead =
        Number(sameMessageMarkedAsUnread.historyIndex) >= Number(markedAsRead.historyIndex);
      if (wasMarkedAsUnreadAfterMarkedAsRead) {
        dedupedMarkedAsReadMessageIds.splice(i, 1);
      } else {
        dedupedMarkedAsUnreadMessageIds.splice(sameMessageMarkedAsUnreadIndex, 1);
      }
    }
  }

  /*
   We need to actually account for the times in which the "Preload" actually triggers a read event for gmail.
   What we've done is created a buffer where "READ" events are ignored. That buffer is "5 minutes after the last preload
   as requested". During that buffer, people won't be able to sync read state from Gmail -> Acapela.
  */

  if (dedupedMarkedAsReadMessageIds.length > 0) {
    await db.notification.updateMany({
      where: {
        AND: [
          {
            notification_gmail: {
              some: { gmail_message_id: { in: dedupedMarkedAsReadMessageIds.map(({ id }) => id) } },
            },
          },
          {
            OR: [
              {
                last_preloaded_at: null,
              },
              {
                // Was last preloaded at least 5 minutes ago
                last_preloaded_at: {
                  lte: subMinutes(new Date(), 5),
                },
              },
            ],
          },
        ],
      },
      data: { last_seen_at: new Date().toISOString() },
    });
  }

  if (dedupedMarkedAsUnreadMessageIds.length > 0) {
    await db.notification.updateMany({
      where: {
        notification_gmail: { some: { gmail_message_id: { in: dedupedMarkedAsUnreadMessageIds.map(({ id }) => id) } } },
      },
      data: { last_seen_at: null },
    });
  }
}

export async function upsertNotificationsGivenGmailHistory(
  { id: gmailAccountId, account }: GmailAccount & { account: Account },
  startHistoryId: string
) {
  const gmail = createGmailClientForAccount(account);
  const historyResponse = await gmail.users.history
    .list({
      userId: account.provider_account_id,
      startHistoryId,
    })
    .catch((error) => {
      if (error.message.includes("Insufficient Permission")) {
        return null;
      }
      throw error;
    });

  if (!historyResponse) {
    // We ignore messages for users for whom we lost permission to access their inbox
    return;
  }

  const addedMessageIds = (historyResponse.data.history ?? [])
    .flatMap((h) => h.messagesAdded ?? [])
    .filter(({ message }) => message?.labelIds?.includes("INBOX"))
    .map(({ message }) => message?.id)
    .filter(isNotNullish);

  const existingMessageNotifications = await db.notification_gmail.findMany({
    where: { gmail_message_id: { in: addedMessageIds } },
  });
  const existingMessageIds = new Set(existingMessageNotifications.map((n) => n.gmail_message_id));
  const newMessageIds = addedMessageIds.filter((id) => !existingMessageIds.has(id));

  for (const gmailMessageId of newMessageIds) {
    await createNotificationFromMessage(gmailAccountId, account, gmailMessageId);
  }

  await resolveArchivedMessageNotifications(historyResponse.data.history ?? []);
  await handleReadStateInNotifications(historyResponse.data.history ?? []);
}

function extractKeyfileFromEnv(): string | undefined {
  // if no keyfile is provided, we'll use the default one provided by kubernetes
  // e.g. on staging the oauth app and the pubsub topics are in the same project
  // so no keyfile is required
  if (!process.env.GMAIL_PUBSUB_KEYFILE) return;
  const keyfileData = Buffer.from(process.env.GMAIL_PUBSUB_KEYFILE, "base64");
  const keyfilePath = join(tmpdir(), "gmail-keyfile.json");
  writeFileSync(keyfilePath, keyfileData);
  return keyfilePath;
}
// Listens to messages posted to the Gmail topic's subscription
export function listenToGmailSubscription() {
  const keyFilename = extractKeyfileFromEnv();
  if (keyFilename) logger.info(`using pubsub keyfile ${keyFilename}`);
  const pubsub = new PubSub({ keyFilename });
  const topic = pubsub.topic(GMAIL_TOPIC_NAME);
  const subscription = topic.subscription(GMAIL_SUBSCRIPTION_NAME);

  subscription.on("message", async (message) => {
    const eventData = JSON.parse(message.data.toString());

    const gmailAccount = await db.gmail_account.findFirst({
      where: { account: { provider_id: "google", email: eventData.emailAddress } },
      include: { account: true },
    });

    if (gmailAccount) {
      const lastHistoryId = gmailAccount.last_history_id;
      if (lastHistoryId) {
        await upsertNotificationsGivenGmailHistory(gmailAccount, lastHistoryId.toString());
      }
      await db.gmail_account.update({
        where: { id: gmailAccount.id },
        data: { last_history_id: eventData.historyId },
      });
    } else {
      console.warn("Missing gmail account for email " + eventData.emailAddress);
    }

    message.ack();
  });

  subscription.on("error", (error) => {
    logger.error(error);
    Sentry.captureException(error);
  });
}

export async function archiveGmailMessageForNotification(notificationId: string) {
  const notificationGmailPromise = db.notification_gmail.findFirst({
    where: { notification_id: notificationId },
    include: { gmail_account: { include: { account: { include: { user: true } } } } },
  });
  const notificationDrivePromise = db.notification_drive.findFirst({
    where: { notification_id: notificationId },
    include: { gmail_account: { include: { account: { include: { user: true } } } } },
  });

  const driveOrGmailNotification = (await Promise.all([notificationGmailPromise, notificationDrivePromise])).find(
    Boolean
  );

  if (!driveOrGmailNotification) {
    return;
  }

  const { gmail_account, gmail_message_id } = driveOrGmailNotification;
  const { account } = gmail_account;

  const gmail = createGmailClientForAccount(account);
  try {
    await gmail.users.messages.modify({
      userId: account.provider_account_id,
      id: gmail_message_id,
      requestBody: { removeLabelIds: ["INBOX"] },
    });
    logger.info("Archived gmail message " + gmail_message_id);
  } catch (error) {
    logger.error(error);
  }
}

export async function markDriveMessageAsReadForNotification(notificationId: string) {
  // No need to do this for normal mails, as they get read on when viewed
  const driveNotification = await db.notification_drive.findFirst({
    where: { notification_id: notificationId },
    include: { gmail_account: { include: { account: { include: { user: true } } } } },
  });

  if (!driveNotification) {
    return;
  }

  const { gmail_account, gmail_message_id } = driveNotification;
  const { account } = gmail_account;

  const gmail = createGmailClientForAccount(account);
  try {
    await gmail.users.messages.modify({
      userId: account.provider_account_id,
      requestBody: { removeLabelIds: ["UNREAD"] },
      id: gmail_message_id,
    });
    logger.info("Marked gmail message as read" + gmail_message_id);
  } catch (error) {
    logger.error(error);
  }
}
