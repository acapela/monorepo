export type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type trackingEvent =
  | "Account Created"
  | "Account Deleted"
  | "Signed Up"
  | "Signed In"
  | "Signed Out"
  | "Invite Sent"
  | "Account Added User"
  | "Account Removed User"
  | "Trial Started"
  | "Trial Ended";

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
