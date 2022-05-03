import * as Sentry from "@sentry/electron";
import { DsnComponents } from "@sentry/types";
import axios from "axios";
import FormData from "form-data";

import { LogAttachment } from "./attachment.types";

function getAttachmentUrlFromDsn(dsn: DsnComponents, eventId: string) {
  const { host, path, projectId, port, protocol, user } = dsn;
  return `${protocol}://${host}${port !== "" ? `:${port}` : ""}${
    path !== "" ? `/${path}` : ""
  }/api/${projectId}/events/${eventId}/attachments/?sentry_key=${user}&sentry_version=7&sentry_client=custom-javascript`;
}

export async function addLogAttachment(eventId: string, attachments: LogAttachment[]) {
  if (!attachments || attachments.length === 0) {
    return;
  }

  const dsn = Sentry.getCurrentHub().getClient()?.getDsn();
  if (!dsn) {
    return;
  }
  const endpoint = getAttachmentUrlFromDsn(dsn, eventId);

  const formData = new FormData();

  for (const attachment of attachments) {
    formData.append("my-attachment", attachment.body, {
      filename: attachment.fileName,
      contentType: attachment.type,
    });
  }

  axios
    .request({
      method: "POST",
      url: endpoint,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    })
    .catch((ex) => {
      console.error(ex);
      Sentry.captureException(ex);
    });
}
