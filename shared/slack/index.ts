import _ from "lodash";

import manifest from "./manifest.json";

export const USER_SCOPES = manifest.oauth_config.scopes.user;

export const isSubsetOf = (a: unknown[], b: unknown[]) => _.intersection(a, b).length === a.length;

export const SLACK_INSTALL_ERROR_KEY = "slack_install_error";
export const SLACK_WORKSPACE_ALREADY_USED_ERROR = "slack_workspace_already_used";

// Indicator that user.slack_included_channels has been migrated to user_slack_channels_by_team
export const USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER = "**MIGRATED**";

export const USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER = "*****";
