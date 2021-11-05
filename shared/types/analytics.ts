import { Message_Type_Enum } from "~gql";
import { Maybe } from "~shared/types";

import { RequestType } from "./mention";

export type AnalyticsUserProfile = {
  id: Maybe<string>;
  name: Maybe<string>;
  email: Maybe<string>;
  avatarUrl?: Maybe<string>;
};

/**
 * Map of tracking event types with their required payload.
 */
export type AnalyticsEventsMap = {
  // Account related events

  // team created
  "Account Created": { teamName: string };
  // unused for now - would be in case a team gets deleted
  "Account Deleted": { teamName: string };
  "Signed Up": { userEmail: string };
  "Signed In": { userEmail: string };
  "Signed Out": void;
  // invited a new team mate
  "Invite Sent": { inviteEmail: string; teamId: string };
  "Resent Team Invitation": { teamId: string; userEmail: string };
  // invitation accepted
  // TODO: to be implemented once team invitations works again
  "Account Added User": { teamId: string; userEmail: string };
  // delete a team member from team management space
  "Account Removed User": { teamId: string; userId: string };
  // should be called simultanously with Account Created for now
  "Trial Started": { teamName: string };
  // can be ignored for now
  "Trial Ended": { teamName: string };

  // Topic related events

  "Created Topic": {
    origin: "slack-command" | "slack-shortcut" | "slack-message-action" | "slack-home-tab" | "web-app" | "unknown";
    topicName: string;
  };
  "Reopened Topic": { topicId: string };
  "Closed Topic": { topicId: string };
  // TODO: implement once we add delete functionality back
  "Deleted Topic": { topicId: string };
  // we are not tracking automatic archives
  "Archived Topic": { topicId: string };
  "Unarchived Topic": { topicId: string };
  "Renamed Topic": { topicId: string };

  // Message related events

  "Sent Message": { messageType: Message_Type_Enum; isReply: boolean; hasAttachments: boolean };
  "Edited Message": { messageId: string };
  "Deleted Message": { messageId: string };
  "Reacted To Message": { messageId: string; reactionEmoji: string };

  // Mention and task related events

  "Created Task": { taskType: RequestType; topicId: string; mentionedUserId: string };
  "Mark Task As Done": {
    taskType: RequestType;
    topicId: string;
    origin: "webapp" | "slack-home" | "slack-live-message" | "unknown";
  };
  "Added Due Date": { topicId: string; messageId: string };

  // Slack
  "Used Slack Global Shortcut": { slackUserName: string };
  "Used Slack Message Action": { slackUserName: string };
  "Used Slack Slash Command": { slackUserName: string; commandName: string };
  "Used Slack Home Tab New Request": { slackUserName: string };
  "Open from Slack Home Tab": void;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    teamName: string;
    teamId: string;
  };
};
