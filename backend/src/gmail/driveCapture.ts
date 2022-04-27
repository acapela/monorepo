import { gmail_v1 } from "googleapis/build/src/apis/gmail/v1";
import { filter, find, map, some } from "lodash";
import { unescape } from "lodash";
import { parse } from "node-html-parser";
import HTMLElement from "node-html-parser/dist/nodes/html";

import { Account, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { findHeader } from "./utils";

const DRIVE_FILE_INVITATION_EMAIL = "drive-shares-dm-noreply@google.com";
const DRIVE_NEW_COMMENT_EMAIL = "comments-noreply@docs.google.com";

export function isDriveEmail(from: string): boolean {
  return from.includes(DRIVE_NEW_COMMENT_EMAIL) || from.includes(DRIVE_FILE_INVITATION_EMAIL);
}

interface DriveNotificationCreationResult {
  isSuccessful: boolean;
}

const supportedDriveSources = [
  "spreadsheets",
  "document",
  "presentation",
  "forms",
  "jamboard", // https://jamboard.google.com/d/1toOWbf1kxW4Ibfm6bI644FRUMltRLB8cy8Vjag6RMT0/viewer
  "folders", // https://drive.google.com/drive/folders/0B7sIBQ4ZLO0KQ1FKYVhUTm4wdms?usp=sharing_eil_se_dm&resourcekey=0-6nC5n6F-1KPBYit_HIK6Fw&ts=62618e52
  "drawings",
  "script", //https://script.google.com/home/projects/1c8O3WzY4IkCJ03Yk8YaM4Sp392eCKUSV7cdA7vSOSZgjU12-b0nbmKGd/edit
] as const;
type SupportedDriveSource = typeof supportedDriveSources[number];

interface NotificationPayload {
  from?: string;
  comment?: string;
  source: SupportedDriveSource;
  url: string;
  name: string;
  type: "invitation" | "mention" | "comment" | "suggestion";
}

// Some emails contain an image explaining what type of activity took place. This is used to find out which activity happened
type Activity = "comment" | "suggestion";

interface ActivityContainer {
  element: HTMLElement;
  activity: Activity;
}

const FAILURE_RESPONSE = { isSuccessful: false };

interface Props {
  email: gmail_v1.Schema$Message;
  gmailMessageId: string;
  gmailAccountId: string;
  account: Account;
}

export async function createDriveNotification({
  email,
  gmailMessageId,
  gmailAccountId,
  account,
}: Props): Promise<DriveNotificationCreationResult> {
  const { parts } = email.payload ?? {};
  const headers = email.payload?.headers ?? [];
  const from = findHeader(headers, "From");
  const date = findHeader(headers, "Date");

  if (!from) {
    logger.error(new Error(`Missing from or subject for message ${email.id} with headers ${JSON.stringify(headers)}`));
    return FAILURE_RESPONSE;
  }

  const bodyAsBase64 = parts?.find((p) => p.mimeType === "text/html")?.body?.data;

  if (!bodyAsBase64) {
    logger.error(new Error("[GoogleDrive] Retrieved email without body"));
    return FAILURE_RESPONSE;
  }

  const bodyAsPlainText = Buffer.from(bodyAsBase64, "base64").toString("utf-8");

  try {
    const notifications = extractNotificationPayloadData(bodyAsPlainText, from);
    if (notifications.length === 0) {
      logger.error(new Error(`[GoogleDrive] Notifications not extracted > ${from} : ${bodyAsBase64}`));
      return FAILURE_RESPONSE;
    }

    const { source, name, url: fileUrl } = notifications[0];

    const fileIdMatcher = /\/(d\/e|d|folders)\/(?<fileId>[a-zA-Z0-9_-]+)/gm;
    const fileId = fileIdMatcher.exec(fileUrl)?.groups?.["fileId"];
    assert(fileId, "Unable to get file id from url " + fileUrl);

    const googleDriveFile = await db.google_drive_file.upsert({
      where: {
        google_drive_original_file_id: fileId,
      },
      create: {
        name,
        source,
        google_drive_original_file_id: fileId,
      },
      update: {},
    });

    for (const notification of notifications) {
      await db.notification_drive.upsert({
        where: {
          gmail_message_id: gmailMessageId,
        },
        create: {
          notification: {
            create: {
              from: notification.from!,
              url: notification.url,
              text_preview: notification.comment,
              user_id: account.user_id,
              created_at: date ? new Date(date).toISOString() : undefined,
            },
          },
          google_drive_activity_type: {
            connect: { value: getUpdatedNotificationType(notification.type, account.email, notification.comment) },
          },
          google_drive_file: {
            connect: {
              id: googleDriveFile.id,
            },
          },
          gmail_message_id: gmailMessageId,
          gmail_thread_id: email.threadId,
          gmail_account: { connect: { id: gmailAccountId } },
        },

        update: {},
      });

      return { isSuccessful: true };
    }
  } catch (e) {
    logger.error(new Error(`[GoogleDrive] ${e} >>\n ${from} : ${bodyAsBase64}`));
  }
  return FAILURE_RESPONSE;
}

function getUpdatedNotificationType(
  activity: NotificationPayload["type"],
  accountEmail?: string | null,
  text?: string
): NotificationPayload["type"] {
  if (accountEmail && text && activity === "comment") {
    return text.includes(`@${accountEmail}`) || text.includes(`+${accountEmail}`) ? "mention" : "comment";
  }

  return activity;
}

export function extractNotificationPayloadData(emailBody: string, from: string): NotificationPayload[] {
  const bodyAsHtml = parse(emailBody);

  // Invitation emails come from a different email address
  if (from.includes(DRIVE_FILE_INVITATION_EMAIL)) {
    const invitationNotification = extractNotificationFromInvitation(bodyAsHtml);

    // We use the email from field as it's the easiest way to figure out the sender
    // This will break with weird names with parens `(`. I hope there aren't many of these
    // "Omar Duarte (via Google Drive) <drive-shares-dm-noreply@google.com>" => Omar Duarte
    const nameOfSenderExcludingDriveSource = from.split(" (")[0].replace(`"`, "");
    return [{ ...invitationNotification, from: nameOfSenderExcludingDriveSource }];
  }

  // There's an exception with Google Presentation comment emails when the author is not the receiver of the email
  // e.g. you got mentioned in a file that belonged to someone else
  // They include a slight variations to their email format. This different format doesn't include "activity image"
  if (!isShowingActivityImage(bodyAsHtml)) {
    return extractNotificationFromPresentationBodyFormat(bodyAsHtml);
  }

  return extractCommentsAndSuggestions(bodyAsHtml);
}

function extractNotificationFromInvitation(body: HTMLElement): NotificationPayload {
  const documentBaseProperties = getDocumentBaseProperties(body);

  return {
    ...documentBaseProperties,
    type: "invitation",
  };
}

function getDocumentBaseProperties(body: HTMLElement): {
  name: string;
  source: NotificationPayload["source"];
  url: string;
} {
  // This is the pill shaped link that includes a drive document icon and the file name.
  // This link points directly at the document
  const $link = body.querySelector("a > div > span")?.closest("a") as HTMLElement | undefined;
  assert($link, "Unable to find link that points to the document");

  const url = $link.getAttribute("href");
  assert(url, "Unable to extract url from link");

  const source = getSource(url);
  assert(source, "Unable to extract source from link");

  const escapedName = $link.childNodes?.[0].childNodes?.[1]?.innerText;
  assert(escapedName, "Unable to extract name from link");

  return {
    source,
    name: unescape(escapedName),
    url,
  };
}

function extractCommentsAndSuggestions(body: HTMLElement): NotificationPayload[] {
  const $activityImages = body.querySelectorAll("td > div > img");

  /* 
    There's going to be different containers depending on activity type.

    This will happen every time one document is having several edits, comments, suggestions at the same time.
    Google will have some sort of throttle mechanism that will accumulate all of the notifications in a single email.

    The email will have different "containers" depending on the type of "activity" that occurred. So far, I've only
    identified "comment" and "suggestion", but there may be others!
  */
  const activityContainers: ActivityContainer[] = map($activityImages, ($img) => {
    assert($img, "Unable to find activity image");

    const activity = getActivityTypeFromImage($img);
    assert(activity, "Unable to get activity type from activity image");

    const element = $img.closest("tr > td > table") as HTMLElement;
    assert(element, "Unable to get parent element relative to activity image");

    return {
      activity,
      element,
    };
  });

  const result: NotificationPayload[] = [];

  const documentBaseProperties = getDocumentBaseProperties(body);

  for (const { element: $activityContainer, activity } of activityContainers) {
    const commentsOrSuggestions = getCommentsFromActivity($activityContainer as HTMLElement);

    for (const commentOrSuggestion of commentsOrSuggestions) {
      result.push({
        ...documentBaseProperties,
        ...commentOrSuggestion,
        type: activity,
      });
    }
  }

  return result;
}

function getSource(url: string): SupportedDriveSource | undefined {
  return supportedDriveSources.find((source) => url.includes(`/${source}/`) || url.includes(`${source}.google.com`));
}

function isShowingActivityImage(body: HTMLElement): boolean {
  const activityImages = body.querySelectorAll("td > div > img");
  return some(activityImages, (activityImage) => activityImage && getActivityTypeFromImage(activityImage));
}

function getActivityTypeFromImage($activityImage: HTMLElement): Activity | undefined {
  if ($activityImage.getAttribute("src")?.includes("/comment/")) {
    return "comment";
  }
  if ($activityImage.getAttribute("src")?.includes("/rate_review/")) {
    return "suggestion";
  }
}

function extractNotificationFromPresentationBodyFormat(body: HTMLElement): NotificationPayload[] {
  const allLinksInFile = body.querySelectorAll("a");

  const $link = find(allLinksInFile, (link) => {
    const url = link.getAttribute("href");
    return !!url && !!getSource(url);
  });
  assert($link, "Unable to find link that holds that points to the document");

  const escapedName = $link.childNodes?.[0].childNodes?.[1]?.textContent;
  assert(escapedName, "Unable to get the name of the file");

  return getCommentsFromActivity(body).map((commentData) => ({
    ...commentData,
    name: unescape(escapedName),
    source: "presentation",
    type: "comment",
  }));
}

function getCommentsFromActivity($parentElement: HTMLElement): { from: string; comment: string; url: string }[] {
  const $allButtons = $parentElement.querySelectorAll("a[role=button]");

  const $openButtons = filter($allButtons, ($btn) => {
    const href = $btn.getAttribute("href");
    return href && getSource(href);
  });

  const comments: { from: string; comment: string; url: string }[] = [];

  for (const $openButton of $openButtons as HTMLElement[]) {
    const commentData = getCommentBesidesOpenButton($openButton);

    const url = $openButton.getAttribute("href");
    assert(url, "Unable to get open button url");

    comments.push({ ...commentData, url });
  }

  return comments;
}

function getCommentBesidesOpenButton($openButton: HTMLElement): { from: string; comment: string } {
  const $buttonContainer = $openButton.closest("div") as HTMLElement;
  assert($buttonContainer, "Unable to get the open button container");

  const $lastCommentRow = $buttonContainer.previousElementSibling;
  assert($lastCommentRow, "Unable to get the last comment row");

  const $commentAuthor = $lastCommentRow.querySelector("h3");
  assert($commentAuthor, "Unable to get the comment author");

  const $commentTextContainer = (<HTMLElement>$lastCommentRow).querySelector("div.notranslate");
  assert($commentTextContainer, "Unable to get the comment section");

  let comment = "";

  for (const node of $commentTextContainer.childNodes) {
    comment += node.textContent;
  }

  return {
    from: unescape($commentAuthor.textContent) || "Unknown",
    comment,
  };
}
