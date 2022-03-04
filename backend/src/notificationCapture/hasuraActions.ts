import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { GetSlackInstallationUrlInput, GetSlackInstallationUrlOutput } from "@aca/gql";
import { assert } from "@aca/shared/assert";

export const getIndividualSlackInstallationURLHandler: ActionHandler<
  { input: GetSlackInstallationUrlInput },
  GetSlackInstallationUrlOutput
> = {
  actionName: "get_slack_installation_url",

  async handle(userId, { input: { teamId, redirectURL } }) {
    assert(userId, "must have userId");
    return { url: await getIndividualSlackInstallURL({ userId, teamId, redirectURL }) };
  },
};
