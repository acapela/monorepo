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
  "Created Space": void;
  // current user or when current user adds someone else
  "Joined Space": void;
  "Left Space": void;
  "Deleted Space": void;
  "Created Room": void;
  "Joined Room": void;
  "Left Room": void;
  "Reopened Room": void;
  "Closed Room": void;
  "Deleted Room": void;
  "Renamed Room": void;
  "Made Room Public": void;
  "Made Room Private": void;
  "Created Topic": void;
  "Reopened Topic": void;
  "Closed Topic": void;
  "Deleted Topic": void;
  "Renamed Topic": void;
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
