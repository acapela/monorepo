import { getDevPublicTunnelURL } from "~backend/src/localtunnel";
import { assertDefined } from "~shared/assert";
import { IS_DEV } from "~shared/dev";
import { botScopes, userScopes } from "~shared/slack";

import { slackReceiver } from "./app";
import { InstallMetadata } from "./installMetadata";

export const getSlackInstallURL = async (mode: "full" | "user-only", metadata: InstallMetadata) => {
  const basePath = IS_DEV ? (await getDevPublicTunnelURL(3000)) + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return assertDefined(slackReceiver.installer, "must have installer").generateInstallUrl({
    userScopes,
    scopes: mode == "full" ? botScopes : [],
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
};
