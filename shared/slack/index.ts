import _ from "lodash";

import manifest from "./manifest.json";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

export const checkHasAllSlackUserScopes = (scopes: string[]) =>
  _.intersection(scopes, userScopes).length === userScopes.length;

export const SLACK_INSTALL_ERROR_KEY = "slack_install_error";
export const SLACK_WORKSPACE_ALREADY_USED_ERROR = "slack_workspace_already_used";
