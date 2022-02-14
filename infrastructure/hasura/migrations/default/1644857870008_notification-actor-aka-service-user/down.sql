
DROP TABLE "public"."service_user";

DROP TABLE "public"."service";

alter table "public"."notification" drop constraint "notification_actor_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification" add column "actor_user_id" uuid
--  null;
