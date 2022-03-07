import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { assertDefined } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";
import { USER_SCOPES, botScopes, userScopes } from "@aca/shared/slack";
import { Maybe } from "@aca/shared/types";

import { slackReceiver } from "./app";
import { InstallMetadata } from "./installMetadata";

const getRedirectURI = async () =>
  (IS_DEV ? (await getDevPublicTunnelURL(3000)) + "/api/backend" : process.env.BACKEND_API_ENDPOINT) +
  "/slack/oauth_redirect";

/**
 * Called for the new Acapela where slack installations are not tied to teams anymore. It also needs a lot fewer scopes.
 */
export const getIndividualSlackInstallURL = async (metadata: {
  userId: string;
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

export const getUserSlackInstallURL = async (metadata: InstallMetadata, scopes: string[] = []) =>
  assertDefined(slackReceiver.installer, "no installer configured").generateInstallUrl({
    userScopes,
    scopes,
    redirectUri: await getRedirectURI(),
    metadata: JSON.stringify(metadata),
  });
export const getTeamSlackInstallURL = async (metadata: InstallMetadata) => getUserSlackInstallURL(metadata, botScopes);
