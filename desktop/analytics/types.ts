import { Maybe } from "@aca/shared/types";

export type PlanType = "trial" | "free" | "premium";

/**
 * Map of tracking event types with their required parameters.
 * Use past tense and Title Case event names for new types.
 * https://intercom.help/junedotso/en/articles/3720543-name-an-event
 */
export type AnalyticsEventsMap = {
  // Account related events

  // team created - unused for now
  "Account Created": { account_name: string };
  // team deleted - unused for now
  "Account Deleted": { account_name: string };
  "Signed Up": {
    type: "organic" | "invited";
    email: string;
    first_name: Maybe<string>;
    last_name: Maybe<string>;
    name: string; // Full name of a user
  };
  // unused for now?
  "Logged In": void;
  // unused for now?
  "Logged Out": void;
  // to be implemented on the settings page soon
  "Invite Sent": { invitee_email: string };
  // to be implemented later
  "Account Added User": { role: "owner" | "admin" | "member" };
  // delete a team member from team management space
  "Account Removed User": void;
  // to be implemented later
  "Trial Started": { trial_start_date: Date; trial_end_date: Date; plan_name: PlanType };
  // to be implemented later
  "Trial Ended": { trial_start_date: Date; trial_end_date: Date; plan_name: PlanType };
  // to be implemented later
  "Plan Upgraded": { plan_start_date: Date; plan_name: PlanType };
  // to be implemented later
  "Plan Downgraded": { plan_end_date: Date; plan_name: PlanType };

  // Feature related events

  "Opened App": void;
  "Notification Resolved": { notification_id: string };
  "Notification Snoozed": { notification_id: string };
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsGroupsMap = {
  Team: {
    // reserved group traits: https://segment.com/docs/connections/spec/group/#traits
    id: string;
    name: string;
    slug: string;
    plan: PlanType;
    created_at: Date;
  };
};

export type AnalyticsUserProfile = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  avatar?: Maybe<string>;
  slack_installed_at: Date;
  notion_installed_at: Date;
  figma_installed_at: Date;
  linear_installed_at: Date;
  // reserved user traits: https://segment.com/docs/connections/spec/identify/#traits
  // unfortunately we have to use a different case here
  createdAt: Date;
  firstName: Maybe<string>;
  lastName: Maybe<string>;
};
