alter table "public"."message_reaction" drop column "id" cascade
alter table "public"."message_reaction" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."message_reaction" drop constraint "message_reaction_pkey";
alter table "public"."message_reaction"
    add constraint "message_reaction_pkey"
    primary key ("message_id", "emoji", "user_id");


DROP INDEX IF EXISTS "sync_request_user_id";

DROP INDEX IF EXISTS "sync_request_team_id";

DROP INDEX IF EXISTS "sync_request_entity_name";

DROP INDEX IF EXISTS "sync_request_date";

DROP INDEX IF EXISTS "sync_request_change_type";

DROP INDEX IF EXISTS "sync_request_entity_id";

DROP TABLE "public"."sync_request";
