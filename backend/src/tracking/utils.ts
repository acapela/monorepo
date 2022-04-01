import Airtable from "airtable";

import { User } from "@aca/db";
import { identifyBackendUser } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";

export async function updateUserOnboardingStatus(user: User) {
  if (process.env.AIRTABLE_API_KEY) {
    const airtableCRMBaseId = "app9VeGJyHLZ7M5j4";
    const airtableCRMTableId = "tblVcS7p390GbQbC0";
    const funnelStageFieldName = "Funnel stage";
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(airtableCRMBaseId);
    const fetchedResults = await base(airtableCRMTableId)
      .select({
        filterByFormula: `email = "${user.email}"`,
        maxRecords: 1,
        sort: [{ field: "Funnel Stage Modified Time", direction: "desc" }],
      })
      .all();
    if (fetchedResults.length < 1) {
      // user never filled in typeform
      identifyBackendUser(user.id, { onboarding: "self_serve" });
      return;
    }
    const record = fetchedResults[0];
    const funnelStage = record.get(funnelStageFieldName) as undefined | string;
    if (
      funnelStage &&
      ["Booked in Product Demo Call", "Attended Product Demo Call", "Onboarded", "Booked in Onboarding Call"].includes(
        funnelStage
      )
    ) {
      // assume user had an onboarding call in all of those cases
      identifyBackendUser(user.id, { onboarding: "white_glove" });
    } else {
      identifyBackendUser(user.id, { onboarding: "self_serve" });
    }

    await base(airtableCRMTableId).update(record.id, { "Funnel stage": "Onboarded" });
    logger.info("Updated user onboarding info", {
      userId: user.id,
    });
  }
}
