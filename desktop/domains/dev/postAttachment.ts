import * as Sentry from "@sentry/electron";

import { postSentryLogAttachment } from "@aca/shared/debug/addSentryAttachment";
import { LogAttachment } from "@aca/shared/debug/logAttachment.types";

export async function addElectronLogAttachment(eventId: string, attachments: LogAttachment[]) {
  if (!attachments || attachments.length === 0) {
    return;
  }

  const dsn = Sentry.getCurrentHub().getClient()?.getDsn();
  if (!dsn) {
    return;
  }

  postSentryLogAttachment(eventId, dsn, attachments);
}
