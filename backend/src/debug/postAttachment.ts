import * as Sentry from "@sentry/node";

import { postSentryLogAttachment } from "@aca/shared/debug/addSentryAttachment";
import { LogAttachment } from "@aca/shared/debug/logAttachment.types";

export async function addBackendLogAttachment(eventId: string, attachments: LogAttachment[]) {
  if (!attachments || attachments.length === 0) {
    return;
  }

  const dsn = Sentry.getCurrentHub().getClient()?.getDsn();
  if (!dsn) {
    return;
  }

  postSentryLogAttachment(eventId, dsn, attachments);
}
