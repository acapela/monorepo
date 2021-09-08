import * as crypto from "crypto";

import axios from "axios";

import { assertDefined } from "~shared/assert";

const mailchimpApiKey = assertDefined(process.env.MAILCHIMP_API_KEY, "MAILCHIMP_API_KEY is required");

type MembersApiPutRequestBody = {
  email_address: string;
  status_if_new: "subscribed";
  merge_fields?: Record<string, string>;
};
export async function addUserToMailchimp(email: string, firstName?: string) {
  const membersApiQueryBody: MembersApiPutRequestBody = {
    email_address: email.toLowerCase().trim(),
    status_if_new: "subscribed",
  };
  if (firstName) {
    membersApiQueryBody.merge_fields = { FNAME: firstName };
  }
  const emailMd5Hash = crypto.createHash("md5").update(email).digest("hex").toString();
  await axios.put(
    `https://us17.api.mailchimp.com/3.0/lists/b989557221/members/${emailMd5Hash}`,
    JSON.stringify(membersApiQueryBody),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`user:${mailchimpApiKey}`).toString("base64")}`,
      },
      params: {
        skip_merge_validation: true,
      },
    }
  );
}
