
DELETE from notification_jira_issue_type where value IN ('issue_updated', 'comment_updated', 'issue_created');

INSERT INTO notification_jira_issue_type (value) VALUES ('issue_assigned');
INSERT INTO notification_jira_issue_type (value) VALUES ('issue_status_updated');

alter table "public"."notification_jira_issue" add column "from" text
 null;

alter table "public"."notification_jira_issue" add column "to" text
 null;
