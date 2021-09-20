CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS $$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;


alter table "public"."message_reaction" add column "updated_at" timestamptz
 null default now();
CREATE TRIGGER "set_public_message_reaction_updated_at"
BEFORE UPDATE ON "public"."message_reaction"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_message_reaction_updated_at" ON "public"."message_reaction" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."room_invitation" add column "updated_at" timestamptz
 null default now();
CREATE TRIGGER "set_public_room_invitation_updated_at"
BEFORE UPDATE ON "public"."room_invitation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_room_invitation_updated_at" ON "public"."room_invitation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."task" add column "updated_at" timestamptz
 null default now();
CREATE TRIGGER "set_public_task_updated_at"
BEFORE UPDATE ON "public"."task"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_task_updated_at" ON "public"."task" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."team_invitation" add column "updated_at" timestamptz
 null default now();
CREATE TRIGGER "set_public_team_invitation_updated_at"
BEFORE UPDATE ON "public"."team_invitation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_invitation_updated_at" ON "public"."team_invitation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."team" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_team_updated_at"
    BEFORE UPDATE ON "public"."team"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_updated_at" ON "public"."team"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."space" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_space_updated_at"
    BEFORE UPDATE ON "public"."space"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_space_updated_at" ON "public"."space"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."topic" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_topic_updated_at"
    BEFORE UPDATE ON "public"."topic"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_topic_updated_at" ON "public"."topic"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."room" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_room_updated_at"
    BEFORE UPDATE ON "public"."room"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_room_updated_at" ON "public"."room"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."attachment" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_attachment_updated_at"
    BEFORE UPDATE ON "public"."attachment"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_attachment_updated_at" ON "public"."attachment"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."user" add column "updated_at" timestamptz
    null default now();
CREATE TRIGGER "set_public_user_updated_at"
    BEFORE UPDATE ON "public"."user"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_updated_at" ON "public"."user"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
