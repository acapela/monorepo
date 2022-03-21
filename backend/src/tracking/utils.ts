import Airtable from "airtable";

import { User } from "@aca/db";
import { identifyBackendUser } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";

export async function updateUserOnboardingStatus(user: User) {
  if (process.env.AIRTABLE_API_KEY) {
    const airtableCRMBaseId = "app9VeGJyHLZ7M5j4";
    const airtableCRMTableId = "tblVcS7p390GbQbC0";
    const funnelStageField = "Funnel stage";
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(airtableCRMBaseId);
    const fetchedResults = await base(airtableCRMTableId)
      .select({
        filterByFormula: `email = "${user.email}"`,
        maxRecords: 1,
        sort: [{ field: "Funnel Stage Modified Time", direction: "desc" }],
      })
      .all();
    if (fetchedResults.length < 1) {
      return; // user most likely had self-serve onboarding
    }
    const record = fetchedResults[0];
    const funnelStage = record.get(funnelStageField);
    if (!funnelStage) {
      return;
    }
    if (
      ["Booked in Product Demo Call", "Attended Product Demo Call", "Onboarded", "Booked in Onboarding Call"].includes(
        funnelStage as string
      )
    ) {
      // assume user had an onboarding call in all of those cases
      identifyBackendUser(user.id, { onboarding: "white_glove" });
      logger.info("Updated user onboarding info", {
        userId: user.id,
      });
    }
  }
}
