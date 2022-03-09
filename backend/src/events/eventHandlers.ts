import { Account, LinearIssue, User } from "@aca/db";

import { createHasuraEventsHandler } from "../hasura";

export const hasuraEvents = createHasuraEventsHandler<{
  account_updates: Account;
  user_updates: User;
  linear_issue_updates: LinearIssue;
}>();
