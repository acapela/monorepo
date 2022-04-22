import { gmail_v1 } from "googleapis/build/src/apis/gmail/v1";
import { parse } from "node-html-parser";

import { logger } from "@aca/shared/logger";

const DRIVE_FILE_INVITATION_EMAIL = "drive-shares-dm-noreply@google.com";
const DRIVE_NEW_COMMENT_EMAIL = "comments-noreply@docs.google.com";

export function isDriveEmail(from: string): boolean {
  return from.includes(DRIVE_NEW_COMMENT_EMAIL) || from.includes(DRIVE_FILE_INVITATION_EMAIL);
}

interface DriveNotificationCreationResult {
  isSuccessful: boolean;
}

export function createDriveNotification(email: gmail_v1.Schema$Message): DriveNotificationCreationResult {
  const { parts } = email.payload ?? {};

  const bodyAsBase64 = parts?.find((p) => p.mimeType === "text/html")?.body?.data;

  if (!bodyAsBase64) {
    logger.error("retreived email email without body");
    return { isSuccessful: false };
  }

  const bodyAsPlainText = Buffer.from(bodyAsBase64, "base64").toString("utf-8");

  const bodyAsHtml = parse(bodyAsPlainText);

  console.info({ bodyAsHtml });

  return { isSuccessful: false };
}

// Get type of document
// Get url

// <<-----!        ------->

// Folders => https://drive.google.com/drive/folders/0B7sIBQ4ZLO0KQ1FKYVhUTm4wdms?usp=sharing_eil_se_dm&resourcekey=0-6nC5n6F-1KPBYit_HIK6Fw&ts=62618e52
// Jamboard: https://jamboard.google.com/d/1toOWbf1kxW4Ibfm6bI644FRUMltRLB8cy8Vjag6RMT0/viewer
// Script: https://script.google.com/home/projects/1c8O3WzY4IkCJ03Yk8YaM4Sp392eCKUSV7cdA7vSOSZgjU12-b0nbmKGd/edit

// interface NotificationPayload {
//   source: "spreadsheets" | "document" | "presentation" | "forms" | "jamboard" | "folders" | "drawings" | "script";
//   url: string;
//   type: "invitation" | "mention" | "comment";
//   from: string;
// }

// function extractNotificationFromInvitation(body: HTMLElement): NotificationPayload | undefined {
//   const button = body.querySelector("a[role=button]");
// }
