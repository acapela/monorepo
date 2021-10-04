DROP TRIGGER IF EXISTS "set_public_attachment_updated_at" ON "public"."attachment";
ALTER TABLE "public"."attachment" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_message_updated_at" ON "public"."message";
ALTER TABLE "public"."message" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_room_updated_at" ON "public"."room";
ALTER TABLE "public"."room" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_space_updated_at" ON "public"."space";
ALTER TABLE "public"."space" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_team_updated_at" ON "public"."team";
ALTER TABLE "public"."team" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_topic_updated_at" ON "public"."topic";
ALTER TABLE "public"."topic" DROP COLUMN "updated_at";

DROP TRIGGER IF EXISTS "set_public_user_updated_at" ON "public"."user";
ALTER TABLE "public"."user" DROP COLUMN "updated_at";

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
