alter table "public"."notification_jira_issue" drop constraint "notification_jira_issue_notification_id_fkey",
  add constraint "notification_jira_issue_notification_id_fkey"
  foreign key ("notification_id")
  references "public"."notification"
  ("id") on update no action on delete no action;
