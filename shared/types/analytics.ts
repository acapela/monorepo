import { Message_Type_Enum } from "~gql";

import { RequestType } from "./mention";

export type AnalyticsUserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  avatar?: string;
};

/**
 * Map of tracking event types with their required payload.
 * Use past tense and first letter uppercased for the event type.
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

  "Created Request": {
    origin: "slack-command" | "slack-shortcut" | "slack-message-action" | "slack-home-tab" | "web-app" | "unknown";
    topicName: string;
  };
  "Reopened Request": { topicId: string };
  "Closed Request": { topicId: string };
  // TODO: implement once we add delete functionality back
  "Deleted Request": { topicId: string };
  // we are not tracking automatic archives
  "Archived Request": { topicId: string };
  "Unarchived Request": { topicId: string };
  "Renamed Request": { topicId: string };

  // Message related events

  "Sent Message": { messageType: Message_Type_Enum; isReply: boolean; hasAttachments: boolean };
  "Edited Message": { messageId: string };
  "Deleted Message": { messageId: string };
  "Reacted To Message": { messageId: string; reactionEmoji: string };

  // Mention and task related events

  "Created Task": { taskType: RequestType; topicId: string; mentionedUserId: string };
  "Marked Task As Done": {
    taskType: RequestType;
    topicId: string;
    origin: "webapp" | "slack-home" | "slack-live-message" | "unknown";
  };
  "Added Due Date": { topicId: string; messageId: string };

  "Opened App": void;

  // Slack
  "Used Slack Global Shortcut": { slackUserName: string };
  "Used Slack Message Action": { slackUserName: string };
  "Used Slack Slash Command": { slackUserName: string; commandName: string };
  "Used Slack Home Tab New Request": { slackUserName: string };
  "Opened Webapp From Slack Home Tab": void;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    // reserved traits available here: https://segment.com/docs/connections/spec/group/#traits
    id: string;
    name: string;
    slug: string;
    plan: "trial" | "free" | "premium";
    createdAt: Date;
  };
};
