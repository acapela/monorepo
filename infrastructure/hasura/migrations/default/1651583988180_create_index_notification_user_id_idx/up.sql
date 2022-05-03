CREATE INDEX "notification_user_id_idx" on
    "public"."notification" using btree ("user_id");

CREATE INDEX "notification_asana_notification_id_idx" on
    "public"."notification_asana" using btree ("notification_id");

CREATE INDEX "notification_clickup_notification_id_idx" on
    "public"."notification_clickup" using btree ("notification_id");

CREATE INDEX "notification_drive_notification_id_idx" on
    "public"."notification_drive" using btree ("notification_id");

CREATE INDEX "notification_figma_comment_notification_id_idx" on
    "public"."notification_figma_comment" using btree ("notification_id");

CREATE INDEX "notification_github_notification_id_idx" on
    "public"."notification_github" using btree ("notification_id");

CREATE INDEX "notification_gmail_notification_id_idx" on
    "public"."notification_gmail" using btree ("notification_id");

CREATE INDEX "notification_jira_issue_notification_id_idx" on
    "public"."notification_jira_issue" using btree ("notification_id");

CREATE INDEX "notification_linear_notification_id_idx" on
    "public"."notification_linear" using btree ("notification_id");

CREATE INDEX "notification_notion_notification_id_idx" on
    "public"."notification_notion" using btree ("notification_id");

CREATE INDEX "notification_slack_message_notification_id_idx" on
    "public"."notification_slack_message" using btree ("notification_id");