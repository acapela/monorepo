import { Message_Type_Enum } from "@aca/gql";

import { RequestType } from "../requests";
import { Maybe } from "../types";

export type Origin =
  | "slack-modal-slash-command"
  | "slack-quick-slash-command"
  | "slack-global-shortcut"
  | "slack-live-message"
  | "slack-quick-message-action"
  | "slack-modal-message-action"
  | "slack-home-tab"
  | "slack-view-request-modal"
  | "web-app"
  | "landing-page"
  | "unknown";

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
  "Signed Up": void;
  "Signed In": void;
  "Signed Out": void;
  // invited a new team mate
  "Invite Sent": { email: string; teamId: string; origin: "webapp" | "slack" };
  "Deleted Invite": { email: string; teamId: string };
  "Resent Team Invitation": { teamId: string; email: string };
  // invitation accepted
  "Account Added User": { teamId: string };
  // delete a team member from team management space
  "Account Removed User": { teamId: string; userId: string };
  // should be called simultanously with Account Created for now
  "Trial Started": { teamName: string };
  // can be ignored for now
  "Trial Ended": { teamName: string };

  // Topic related events

  "Created Request": {
    origin: Origin;
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
    origin: Origin;
  };
  "Marked Task As Not Done": {
    taskType: RequestType;
    topicId: string;
    origin: Origin;
  };

  "Added Due Date": { topicId: string; messageId: string; origin: Origin };

  "Opened App": { currentTeamId: string; loadingTime: number };

  // Slack
  "Added Team Slack Integration": { slackTeamId: string; teamId: string };
  "Removed Team Slack Integration": { teamId: string };
  "Added User Slack Integration": { slackTeamId: string; teamId: string };
  "Used Slack Global Shortcut": { slackUserName: string };
  "Used Slack Message Action": { slackUserName: string };
  "Used Slack Self Request Message Action": { slackUserName: string };
  "Used Slack Slash Command": { slackUserName: string; commandName: string };
  "Used Slack Home Tab New Request": { slackUserName: string };
  "Opened Webapp From Slack Home Tab": void;
  "Opened Gallery From Slack Onboarding": void;
  "Opened Home Tab From Slack Onboarding": void;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    // reserved group traits: https://segment.com/docs/connections/spec/group/#traits
    id: string;
    name: string;
    slug: string;
    plan: "trial" | "free" | "premium";
    createdAt: Date;
    isSlackInstalled: boolean;
  };
};

export type AnalyticsUserProfile = {
  // reserved user traits: https://segment.com/docs/connections/spec/identify/#traits
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  avatar?: Maybe<string>; // url to a publicly hosted avatar
  isSlackInstalled: boolean;
};
