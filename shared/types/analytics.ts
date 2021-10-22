import { Message_Type_Enum } from "~gql";
import { Maybe } from "~shared/types";

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
  "Deleted Team Invitation": { teamId: string; invitationId: string };
  // invitation accepted
  "Account Added User": { teamId: string; userEmail: string };
  // delete a team member from team management space
  "Account Removed User": { teamId: string; userId: string };
  // should be called simultanously with Account Created for now
  "Trial Started": { teamName: string };
  // can be ignored for now
  "Trial Ended": { teamName: string };

  // Calendar related events

  "Selected Calendar Date": { newDate: Date };

  // Topic related events

  "Created Topic": {
    origin: "slack-command" | "slack-shortcut" | "slack-message-action";
    topicName: string;
  };
  "Reopened Topic": { topicId: string };
  "Closed Topic": { topicId: string };
  "Updated Topic Summary": { topicId: string };
  "Deleted Topic": { topicId: string };
  "Renamed Topic": { topicId: string; newTopicName: string; oldTopicName: string };

  // Message related events

  "Sent Message": { messageType: Message_Type_Enum; isReply: boolean; hasAttachments: boolean };
  "Edited Message": { messageId: string };
  "Deleted Message": { messageId: string };
  "Reacted To Message": { messageId: string; reactionEmoji: string };

  // Mention and task related events

  "Created Mention": { isToSelf: boolean; messageId: string; mentionedUserId: string };
  "Created Task": { taskType: string; mentionedUserId: string | null; taskId: string; messageId: string };
  "Marked Task As Seen": { taskType: string; taskId: string; messageId: string; seenAt: Date };
  "Marked Task As Unseen": { taskType: string; taskId: string; messageId: string };
  "Completed Task": { taskType: string; taskId: string; messageId: string; doneAt: Date };

  // Slack
  "Used Slack Global Shortcut": { slackUserName: string };
  "Used Slack Message Action": { slackUserName: string };
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    teamName: string;
    teamId: string;
  };
};
