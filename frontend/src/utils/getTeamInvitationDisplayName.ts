import { Maybe } from "~shared/types";

export const getTeamInvitationDisplayName = (item: { slack_user_id?: Maybe<string> }) =>
  "Invited user" + (item.slack_user_id ? ` (slack:${item.slack_user_id})` : "");
