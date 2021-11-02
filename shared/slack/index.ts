import _ from "lodash";

import manifest from "./manifest.json";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

export const checkHasAllSlackUserScopes = (scopes: string[]) =>
  _.intersection(scopes, userScopes).length === userScopes.length;
