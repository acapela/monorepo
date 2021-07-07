export type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type trackingEvent =
  | "Account Created" // team created
  | "Account Deleted"
  | "Signed Up"
  | "Signed In"
  | "Signed Out"
  | "Invite Sent" // invited a new team mate
  | "Account Added User" // invitation accepted
  | "Account Removed User"
  | "Trial Started" // same as team created, will be changed later
  | "Trial Ended"
  | "Created Space"
  | "Joined Space"
  | "Left Space"
  | "Deleted Space"
  | "Created Room"
  | "Joined Room"
  | "Left Room"
  | "Closed Room"
  | "Deleted Room"
  | "Made Room Public"
  | "Made Room Private"
  | "Created Topic"
  | "Closed Topic"
  | "Added New Message" // should track type of message (video, text, audio, files)
  | "Edited Message"
  | "Deleted Message";

export function identifyUser(userId: string, userProfile: UserProfile) {
  if (window.analytics) {
    window.analytics.identify(userId, userProfile);
  }
}

export function trackEvent(eventName: trackingEvent, eventProperties: unknown) {
  if (window.analytics) {
    window.analytics.track(eventName, eventProperties);
  }
}

export function groupUser(groupName: string, groupProperties: unknown) {
  if (window.analytics) {
    window.analytics.group(groupName, groupProperties);
  }
}
