import { TeamInvitationEntity } from "~frontend/clientdb/teamInvitation";

export const getTeamInvitationDisplayName = (item: TeamInvitationEntity) =>
  "Invited user" + (item.slack_user_id ? ` (slack:${item.slack_user_id})` : "");
