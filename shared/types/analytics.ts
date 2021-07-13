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
  "Account Removed User": void;
  // same as team created, will be changed later
  "Trial Started": void;
  "Trial Ended": void;
  "Created Space": void;
  "Joined Space": void;
  "Left Space": void;
  "Deleted Space": void;
  "Created Room": void;
  "Joined Room": void;
  "Left Room": void;
  "Closed Room": void;
  "Deleted Room": void;
  "Made Room Public": void;
  "Made Room Private": void;
  "Created Topic": void;
  "Closed Topic": void;
  // should track type of message (video, text, audio, files)
  "Added New Message": void;
  "Edited Message": void;
  "Deleted Message": void;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    teamName: string;
    teamId: string;
  };
};
