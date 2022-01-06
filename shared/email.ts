import { APIClient, RegionEU, SendEmailRequest } from "customerio-node";

import { assertDefined } from "./assert";

const customerioApiKey = assertDefined(
  process.env.CUSTOMERIO_APP_API_KEY,
  "Cannot use mailer if there is no CUSTOMERIO_APP_API_KEY env variable."
);

const customerioClient = new APIClient(customerioApiKey, { region: RegionEU });

const DEFAULT_FROM_ADDRESS = "Acapela <hello@acapela.com>";

export type EmailData =
  | {
      subject: string;
      html: string;
    }
  | { transactionalMessageId: number; messageData: { [key: string]: string } };

export async function sendEmail(message: EmailData, to: string): Promise<void> {
  try {
    let request;
    if ("html" in message) {
      request = new SendEmailRequest({
        to,
        identifiers: {
          email: to,
        },
        from: DEFAULT_FROM_ADDRESS,
        subject: message.subject,
        body: message.html,
      });
    } else if ("transactionalMessageId" in message) {
      request = new SendEmailRequest({
        to,
        transactional_message_id: message.transactionalMessageId,
        message_data: message.messageData,
        identifiers: {
          email: to,
        },
      });
    }
    await customerioClient.sendEmail(request as SendEmailRequest);
  } catch (e) {
    console.error(e);
    throw new Error("Sending email failed");
  }
}
