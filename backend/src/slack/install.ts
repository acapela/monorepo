import { getDevPublicTunnelURL } from "~backend/src/localtunnel";
import { assertDefined } from "~shared/assert";
import { IS_DEV } from "~shared/dev";
import { botScopes, userScopes } from "~shared/slack";

import { slackReceiver } from "./app";
import { InstallMetadata } from "./installMetadata";

export const getUserSlackInstallURL = async (metadata: InstallMetadata, scopes: string[] = []) => {
  const basePath = IS_DEV ? (await getDevPublicTunnelURL(3000)) + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return assertDefined(slackReceiver.installer, "no installer configured").generateInstallUrl({
    userScopes,
    scopes,
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
};
export const getTeamSlackInstallURL = async (metadata: InstallMetadata) => getUserSlackInstallURL(metadata, botScopes);
