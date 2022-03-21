import Airtable from "airtable";

import { User } from "@aca/db";
import { identifyBackendUser } from "@aca/shared/backendAnalytics";

export async function updateUserOnboardingStatus(user: User) {
  if (process.env.AIRTABLE_API_KEY) {
    const airtableCRMBaseId = "app9VeGJyHLZ7M5j4";
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(airtableCRMBaseId);
    const record = await base("CRM").find("recsyfsXbyOqg1r9v");
    if (!record) {
      return; // user most likely had self-serve onboarding
    }
    // console.log(record.id);
    const funnelStage = record.get("fldQWyqdHl8v3Z1Ln");
    if (!funnelStage) {
      return;
    }
    // console.log(funnelStage);
    if (
      ["Booked in Product Demo Call", "Attended Product Demo Call", "Onboarded", "Booked in Onboarding Call"].includes(
        funnelStage as string
      )
    ) {
      // assume user had an onboarding call in all of those cases
      identifyBackendUser(user.id, { onboarding: "white_glove" });
    }
  }
}
