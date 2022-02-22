
CREATE TABLE "public"."slack_conversation_type"
(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

INSERT INTO "public"."slack_conversation_type" (value)
VALUES ('im'),
       ('mpim'),
       ('group'),
       ('chat');
alter table "public"."notification_slack_message" add column "conversation_type" text
 null;

alter table "public"."notification_slack_message"
  add constraint "notification_slack_message_conversation_type_fkey"
  foreign key ("conversation_type")
  references "public"."slack_conversation_type"
  ("value") on update cascade on delete set null;
