
alter table "public"."notification_drive" add constraint "notification_drive_google_drive_file_id_key" unique ("google_drive_file_id");

alter table "public"."notification_drive" alter column "type" set not null;

alter table "public"."notification_drive" drop constraint "notification_drive_type_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- INSERT INTO "public"."google_drive_activity_type" (value)
-- VALUES ('invitation'),
--        ('mention'),
--        ('comment'),
--        ('suggestion');

DROP TABLE "public"."google_drive_activity_type";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_drive" add column "type" text
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."google_drive_file" add column "source" text
--  not null;

alter table "public"."notification_drive" drop constraint "notification_drive_google_drive_file_id_fkey";

DROP TABLE "public"."google_drive_file";

DROP TABLE "public"."notification_drive";
