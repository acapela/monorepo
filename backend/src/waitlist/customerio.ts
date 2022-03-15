import { RegionEU, TrackClient } from "customerio-node";
import { getUnixTime } from "date-fns";

const customerioClientApiKey = process.env.CUSTOMERIO_CLIENT_API_KEY;
const customerioClientSiteId = process.env.CUSTOMERIO_CLIENT_SITE_ID;

export async function addUserToCustomerio(email: string): Promise<void> {
  const cio = new TrackClient(customerioClientSiteId, customerioClientApiKey, { region: RegionEU });
  cio.identify(email, {
    created_at: getUnixTime(Date.now()),
    origin: "landing-page",
  });
}
