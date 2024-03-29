import { PickByValue } from "utility-types";

import { AppTheme } from "@aca/desktop/bridge/ui";
import { Maybe } from "@aca/shared/types";

import { PreloadInstrumentationReportResult, PreloadURLLoadState } from "../debug/electronInstrumentation.types";

export type PlanType = "free" | "premium" | "ultimate";

export type Integration = "linear" | "figma" | "slack" | "notion" | "jira" | "gmail" | "asana" | "github" | "clickup";

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
    origin: "organic" | "referred";
    email: string;
    first_name?: Maybe<string>;
    last_name?: Maybe<string>;
    name: string; // Full name of a user
  };
  // unused for now?
  "Logged In": void;
  // unused for now?
  "Logged Out": void;
  // to be implemented on the settings page soon
  "Invite Sent": { invitee_email: string };
  "Referral Code Copied": void;
  "Invite Friend Button Clicked": void;
  // to be implemented later
  "Account Added User": { role: "owner" | "admin" | "member" };
  // delete a team member from team management space
  "Account Removed User": void;
  // Adds at least one integration and presses continue
  "Onboarding Completed": void;
  // to be implemented later
  "Trial Started": { trial_start_date: Date; trial_end_date: Date; plan_name: PlanType };
  // to be implemented later
  "Trial Ended": { trial_start_date: Date; trial_end_date: Date; plan_name: PlanType };
  // after successful stripe flow
  "Plan Upgraded": { plan_start_date: Date; plan_name: PlanType };
  // after successful downgrade
  "Plan Downgraded": { plan_end_date: Date; plan_name: PlanType };

  // Feature related events

  "Notification Resolved": { notification_id: string };
  "All Notifications Resolved": { list_id: string; readOnly?: boolean };
  "Notification Reminder Added": { notification_id: string };
  "Notification Saved": { notification_id: string };
  "Notification Unsaved": { notification_id: string };
  "Notification Unresolved": { notification_id: string };
  "Custom List Created": void;
  "Custom List Deleted": void;
  "New Message Composed": { integration: string };
  "Desktop Notifications Settings Updated": { interval: number | null };

  // Navigation related events

  "App Opened": { app_version: string | undefined };
  "App Restarted": void;
  "App Updated": void;
  "App Theme Changed": { theme: AppTheme };
  "Settings Opened": void;
  "Saved Notifications Opened": void;
  "Resolved Notifications Opened": void;
  "Notification Deeplink Opened": { service_name: string | undefined };
  "Notification Group Toggled": void;
  "Feedback Button Clicked": void;
  "Feedback Call Booked": void;
  // TODO: to be tracked, I was not able to attach an event logger to the tray without crashing the app
  "Tray Icon Clicked": void;

  // Subscription flow events

  "Upgrade Button Clicked": void;
  "Upgrade Flow Cancelled": void;

  // Integration related events
  "Linear Integration Added": void;
  "Figma Integration Added": void;
  "Slack Integration Added": void;
  "Notion Integration Added": void;
  "Jira Integration Added": void;
  "Gmail Integration Added": void;
  "Asana Integration Added": void;
  "GitHub Integration Added": void;
  "ClickUp Integration Added": void;
  "New Integration Added": { integration: Integration };

  // Preview Loading instrumentation
  "Partially Loaded BrowserView Attached": PreloadURLLoadState & Partial<PreloadInstrumentationReportResult>;
  "Fully Loaded BrowserView Attached": PreloadURLLoadState & Partial<PreloadInstrumentationReportResult>;
  "BrowserView Never Attached": PreloadURLLoadState & Partial<PreloadInstrumentationReportResult>;
};

export type AnalyticsEventName = keyof AnalyticsEventsMap;

type AnalyticsEventsWithoutData = PickByValue<AnalyticsEventsMap, void>;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> = AnalyticsEventsMap[Name];

export type AnalyticsEvent<Name extends AnalyticsEventName> = {
  type: Name;
} & { payload: AnalyticsEventPayload<Name> };

export type AnyAnalyticsEvent = AnalyticsEvent<AnalyticsEventName>;

export type AnalyticsEventInput = keyof AnalyticsEventsWithoutData | AnalyticsEvent<AnalyticsEventName>;

export function resolveAnalyticsEventInput(input: AnalyticsEventInput): AnalyticsEvent<AnalyticsEventName> {
  if (typeof input === "string") {
    return { type: input } as AnalyticsEvent<AnalyticsEventName>;
  }

  return input;
}

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
  name: string; // reserved
  email: string; // reserved
  created_at: Date;
  avatar?: Maybe<string>;
  slack_installed_at?: Date;
  notion_installed_at?: Date;
  figma_installed_at?: Date;
  linear_installed_at?: Date;
  jira_installed_at?: Date;
  github_installed_at?: Date;
  gmail_installed_at?: Date;
  asana_installed_at?: Date;
  clickup_installed_at?: Date;
  onboarding: "self_serve" | "white_glove";
  subscription_plan: PlanType;
  // reserved user traits: https://segment.com/docs/connections/spec/identify/#traits
  // can also use snake_case for reserved traits: https://segment.com/docs/connections/spec/identify/#:~:text=You%20can%20pass%20these%20reserved%20traits%20using%20camelCase%20or%20snake_case
  first_name?: Maybe<string>;
  last_name?: Maybe<string>;
  color_mode: AppTheme;
};
