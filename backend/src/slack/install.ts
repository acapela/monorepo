import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { assertDefined } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";
import { USER_SCOPES } from "@aca/shared/slack";
import { Maybe } from "@aca/shared/types";

import { slackReceiver } from "./app";

const getRedirectURI = async () =>
  (IS_DEV ? (await getDevPublicTunnelURL(3000)) + "/api/backend" : process.env.BACKEND_API_ENDPOINT) +
  "/slack/oauth_redirect";

export const getIndividualSlackInstallURL = async (metadata: {
  userId?: string;
  teamId?: Maybe<string>;
  redirectURL: string;
}) =>
  assertDefined(slackReceiver.installer, "no installer configured").generateInstallUrl({
    userScopes: USER_SCOPES,
    scopes: [],
    redirectUri: await getRedirectURI(),
    metadata: JSON.stringify(metadata),
    teamId: metadata.teamId ?? undefined,
  });
