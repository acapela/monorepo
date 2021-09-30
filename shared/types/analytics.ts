import { Message_Type_Enum } from "~gql";

export type AnalyticsUserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
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

  // General events

  "Toggled Notifications Center": { isOpen: boolean };
  "Clicked Notification Link": void;
  "Marked Notification As Read": void;
  "Marked Notification As Unread": void;
  "Opened Search Bar": void;
  "Used Search Bar": { searchTerm: string };

  // Calendar related events

  "Selected Calendar Date": { newDate: Date };

  // Space related events

  "Created Space": { spaceName: string };
  // current user or when current user adds someone else
  "Joined Space": { spaceId: string; userId: string };
  "Left Space": { spaceId: string; userId: string };
  "Deleted Space": { spaceId: string };
  "Renamed Space": { spaceId: string; newSpaceName: string; oldSpaceName: string };

  // Room related events

  "Toggled Closed Rooms": { isShowingClosedRooms: boolean };
  // current user or when current user adds someone else
  "Created Room": {
    origin: "create-modal" | "calendar" | "slack-command" | "slack-shortcut" | "slack-message-action";
    roomId: string;
    roomName: string;
    roomDeadline: Date;
    spaceId: string;
    numberOfInitialMembers: number;
    isRecurring: boolean;
  };
  "Joined Room": { roomId: string; userId: string };
  "Left Room": { roomId: string; userId: string };
  "Invited To Room": { roomId: string; userEmail: string };
  "Deleted Room Invitation": { roomId: string; invitationId: string };
  "Updated Room Deadline": { roomId: string; newDeadline: Date; oldDeadline: Date };
  "Reopened Room": { roomId: string };
  "Closed Room": { roomId: string; hasRoomOpenTopics: boolean };
  "Deleted Room": { roomId: string };
  "Renamed Room": { roomId: string; newRoomName: string; oldRoomName: string };
  "Made Room Public": { roomId: string };
  "Made Room Private": { roomId: string };
  "Made Room Recurring": { roomId: string; intervalInDays: number };
  "Made Room Non-recurring": { roomId: string };

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
