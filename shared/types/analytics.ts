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
  // team created
  "Account Created": void;
  "Account Deleted": void;
  "Signed Up": void;
  "Signed In": void;
  "Signed Out": void;
  // invited a new team mate
  "Invite Sent": void;
  // invitation accepted
  "Account Added User": void;
  // delete a team member from team management space
  "Account Removed User": void;
  // should be called simultanously with Account Created for now
  "Trial Started": void;
  // can be ignored for now
  "Trial Ended": void;
  "Created Space": { spaceName: string; teamId: string };
  // current user or when current user adds someone else
  "Joined Space": { spaceId: string; userId: string };
  "Left Space": { spaceId: string; userId: string };
  "Deleted Space": { spaceId: string };
  "Renamed Space": { spaceId: string; newSpaceName: string; oldSpaceName: string };
  // current user or when current user adds someone else
  "Created Room": {
    roomId: string;
    roomName: string;
    roomDeadline: Date;
    spaceId: string;
    numberOfInitialMembers: number;
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
  "Created Topic": void;
  "Reopened Topic": void;
  "Closed Topic": void;
  "Deleted Topic": void;
  "Renamed Topic": { topicId: string; newTopicName: string; oldTopicName: string };
  // should track type of message (video, text, audio, files)
  "Sent Message": void;
  "Edited Message": void;
  "Deleted Message": void;
  "Reacted To Message": void;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    teamName: string;
    teamId: string;
  };
};
