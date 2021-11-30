import _ from "lodash";

import manifest from "./manifest.json";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

const compareArrays = (a: unknown[], b: unknown[]) => _.intersection(a, b).length === b.length;
export const checkHasAllSlackUserScopes = (scopes: string[]) => compareArrays(scopes, userScopes);
export const checkHasAllSlackBotScopes = (scopes: string[]) => compareArrays(scopes, botScopes);

export const SLACK_INSTALL_ERROR_KEY = "slack_install_error";
export const SLACK_WORKSPACE_ALREADY_USED_ERROR = "slack_workspace_already_used";
