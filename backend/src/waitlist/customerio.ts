import { RegionEU, TrackClient } from "customerio-node";

import { assertDefined } from "~shared/assert";
import { Origin } from "~shared/types/analytics";

const customerioClientApiKey = assertDefined(
  process.env.CUSTOMERIO_CLIENT_API_KEY,
  "CUSTOMERIO_CLIENT_API_KEY is required"
);
const customerioClientSiteId = assertDefined(
  process.env.CUSTOMERIO_CLIENT_SITE_ID,
  "CUSTOMERIO_CLIENT_SITE_ID is required"
);

export async function addUserToCustomerio(email: string): Promise<void> {
  const cio = new TrackClient(customerioClientSiteId, customerioClientApiKey, { region: RegionEU });
  cio.identify(email, {
    created_at: Date.now(),
    origin: "landing-page" as Origin,
  });
}
