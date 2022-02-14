insert into "slack_conversation_type" (value) VALUES ('channel');

alter table "public"."notification"
    add column "actor_id" uuid
        null;

alter table "public"."notification"
    add constraint "notification_actor_id_fkey"
        foreign key ("actor_id")
            references "public"."user"
                ("id") on update cascade on delete cascade;

CREATE TABLE "public"."service"
(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

INSERT INTO "service" (value)
VALUES ('slack'),
       ('notion'),
       ('figma'),
       ('linear');
CREATE TABLE "public"."service_user"
(
    "id"              uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"      timestamptz NOT NULL DEFAULT now(),
    "updated_at"      timestamptz NOT NULL DEFAULT now(),
    "user_id"         uuid        NOT NULL,
    "service"         text        NOT NULL,
    "service_user_id" text        NOT NULL,
    "display_name"    text        NOT NULL,
    "avatar_url"      text,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("service") REFERENCES "public"."service" ("value") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("service", "service_user_id")
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_service_user_updated_at"
    BEFORE UPDATE
    ON "public"."service_user"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_service_user_updated_at" ON "public"."service_user"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
