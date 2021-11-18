import { APIClient, RegionEU, SendEmailRequest } from "customerio-node";

import { NotificationMessage } from "~backend/src/notifications/sendNotification";

import { assertDefined } from "./assert";

const customerioApiKey = assertDefined(
  process.env.CUSTOMERIO_API_KEY,
  "Cannot use mailer if there is no CUSTOMERIO_API_KEY env variable."
);

const customerioClient = new APIClient(customerioApiKey, { region: RegionEU });

const DEFAULT_FROM_ADDRESS = "Acapela <hello@acapela.com>";

export async function sendEmail(message: Partial<NotificationMessage>, to: string): Promise<void> {
  try {
    let request;
    if (message.email) {
      request = new SendEmailRequest({
        to,
        identifiers: {
          email: to,
        },
        from: DEFAULT_FROM_ADDRESS,
        subject: message.email.subject,
        body: message.email.html,
      });
    } else if (message.template) {
      request = new SendEmailRequest({
        to,
        transactional_message_id: message.template.transactionalMessageId,
        message_data: message.template.messageData,
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
