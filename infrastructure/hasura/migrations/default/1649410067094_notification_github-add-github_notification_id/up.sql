
alter table "public"."notification_github" add column "github_notification_id" text
 null;


alter table "public"."notification_github" add constraint "notification_github_github_notification_id_key" unique ("github_notification_id");
