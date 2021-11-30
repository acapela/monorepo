import _ from "lodash";

import manifest from "./manifest.json";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

const isSubsetOf = (a: unknown[], b: unknown[]) => _.intersection(a, b).length === a.length;
export const checkHasAllSlackUserScopes = (scopes: string[]) => isSubsetOf(userScopes, scopes);
export const checkHasAllSlackBotScopes = (scopes: string[]) => isSubsetOf(botScopes, scopes);

export const SLACK_INSTALL_ERROR_KEY = "slack_install_error";
export const SLACK_WORKSPACE_ALREADY_USED_ERROR = "slack_workspace_already_used";
