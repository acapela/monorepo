import { RegionEU, TrackClient } from "customerio-node";

import { assertDefined } from "~shared/assert";

const customerioApiKey = assertDefined(process.env.CUSTOMERIO_API_KEY, "CUSTOMERIO_API_KEY is required");
const customerioSiteId = assertDefined(process.env.CUSTOMERIO_SITE_ID, "CUSTOMERIO_SITE_ID is required");

export async function addUserToCustomerio(email: string): Promise<void> {
  const cio = new TrackClient(customerioSiteId, customerioApiKey, { region: RegionEU });
  cio.identify(email, {
    created_at: Date.now(),
    origin: "landing-page",
  });
}
