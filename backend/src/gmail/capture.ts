import { PubSub } from "@google-cloud/pubsub";
import * as Sentry from "@sentry/node";
import { google } from "googleapis";
import { Account as NextAuthAccount } from "next-auth";

import { Account, db } from "@aca/db";
import { logger } from "@aca/shared/logger";
import { Maybe } from "@aca/shared/types";

const PROJECT_ID = "meetnomoreapp";
const { GMAIL_TOPIC_NAME, GMAIL_SUBSCRIPTION_NAME } = process.env as Record<string, string>;

const createGmailClientForAccount = (account: Account) => {
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ access_token: account.access_token, refresh_token: account.refresh_token });
  return google.gmail({ version: "v1", auth });
};

async function watchGmailAccount(account: Account) {
  const gmail = createGmailClientForAccount(account);
  await gmail.users.watch({
    userId: account.provider_account_id,
    requestBody: {
      topicName: GMAIL_TOPIC_NAME,
      labelIds: ["INBOX"],
    },
  });
}

export async function setupGmailWatcher(authAccount: NextAuthAccount) {
  const account = await db.account.findFirst({
    where: { provider_id: "google", provider_account_id: authAccount.providerAccountId },
  });
  if (!account) {
    return;
  }
  await db.gmail_account.upsert({ where: { account_id: account.id }, create: { account_id: account.id }, update: {} });

  await watchGmailAccount(account);
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
      await watchGmailAccount(account);
    } catch (error) {
      logger.error(error, `Failed to maintain gmail watcher for account ${account.id}`);
    }
  }
}

const findHeader = (headers: { name?: Maybe<string>; value?: Maybe<string> }[], name: string) =>
  headers.find((h) => h.name === name)?.value;

export function listenToGmailSubscription() {
  const pubsub = new PubSub({ projectId: PROJECT_ID });
  const topic = pubsub.topic(GMAIL_TOPIC_NAME);
  const subscription = topic.subscription(GMAIL_SUBSCRIPTION_NAME);
  subscription.on("message", async (event) => {
    const eventData = JSON.parse(event.data.toString());
    const gmailAccount = await db.gmail_account.findFirst({
      where: { account: { provider_id: "google", email: eventData.emailAddress } },
      include: { account: true },
    });
    if (!gmailAccount) {
      throw new Error("Missing gmail account for email " + eventData.emailAddress);
    }
    const { account } = gmailAccount;
    await db.gmail_account.update({
      where: { id: gmailAccount.id },
      data: { last_history_id: eventData.historyId },
    });

    const lastHistoryId = gmailAccount.last_history_id;
    if (!lastHistoryId) {
      return;
    }
    const gmail = createGmailClientForAccount(account);
    const historyResponse = await gmail.users.history.list({
      userId: account.provider_account_id,
      startHistoryId: lastHistoryId.toString(),
    });
    for (const { message } of (historyResponse.data.history ?? []).flatMap((h) => h.messagesAdded ?? [])) {
      if (!message?.id || (await db.notification_gmail.findUnique({ where: { gmail_message_id: message.id } }))) {
        continue;
      }
      const { data } = await gmail.users.messages
        .get({
          id: message.id,
          userId: account.provider_account_id,
          format: "metadata",
        })
        .catch(() => ({ data: null }));
      if (!data) {
        continue;
      }
      const headers = data.payload?.headers ?? [];
      const from = findHeader(headers, "From");
      const subject = findHeader(headers, "Subject");
      const date = findHeader(headers, "Date");
      if (from && subject) {
        await db.notification_gmail.upsert({
          where: { gmail_message_id: message.id },
          create: {
            notification: {
              create: {
                user_id: account.user_id,
                url: "https://mail.google.com/mail/u/0/#inbox/" + message.id,
                from,
                text_preview: subject,
                created_at: date ? new Date(date).toISOString() : undefined,
              },
            },
            gmail_account: { connect: { id: gmailAccount.id } },
            gmail_message_id: message.id,
          },
          update: {},
        });
      }
    }
  });

  subscription.on("error", (error) => {
    Sentry.captureException(error);
  });
}
