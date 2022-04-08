import Asana from "asana";

import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { IS_DEV } from "@aca/shared/dev";

export function createClient() {
  return Asana.Client.create({
    clientId: process.env.ASANA_CLIENT_ID,
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/api/backend/v1/asana/callback`,
  });
}

export async function getWebhookEndpoint(): Promise<string> {
  return `${IS_DEV ? await getDevPublicTunnelURL(3000) : process.env.FRONTEND_URL}/api/backend/v1/asana/webhook/`;
}
