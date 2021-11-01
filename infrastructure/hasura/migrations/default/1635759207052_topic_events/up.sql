

CREATE TABLE "public"."topic_event" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "topic_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."topic_event_topic_closed" ("topic_event_id" uuid NOT NULL, "closed_by_user_id" uuid, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("closed_by_user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("topic_event_id"));

CREATE TABLE "public"."topic_event_topic_reopened" ("topic_event_id" uuid NOT NULL, "reopened_by_user_id" uuid, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("reopened_by_user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("topic_event_id"));

CREATE TABLE "public"."topic_event_topic_archived" ("topic_event_id" uuid NOT NULL, "archived_by_user_id" uuid NOT NULL, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("archived_by_user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("topic_event_id"));

CREATE TABLE "public"."topic_event_topic_unarchived" ("topic_event_id" uuid NOT NULL, "unarchived_by_user_id" uuid NOT NULL, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("unarchived_by_user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("topic_event_id"));

alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey",
  add constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey"
  foreign key ("unarchived_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey",
  add constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey"
  foreign key ("unarchived_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey",
  add constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey"
  foreign key ("unarchived_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_reopened" drop constraint "topic_event_topic_reopened_reopened_by_user_id_fkey",
  add constraint "topic_event_topic_reopened_reopened_by_user_id_fkey"
  foreign key ("reopened_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_closed_by_user_id_fkey",
  add constraint "topic_event_topic_closed_closed_by_user_id_fkey"
  foreign key ("closed_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_archived" drop constraint "topic_event_topic_archived_archived_by_user_id_fkey",
  add constraint "topic_event_topic_archived_archived_by_user_id_fkey"
  foreign key ("archived_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;

alter table "public"."topic_event_topic_archived" alter column "archived_by_user_id" drop not null;

alter table "public"."topic_event_topic_unarchived" alter column "unarchived_by_user_id" drop not null;

alter table "public"."topic_event_topic_archived" drop constraint "topic_event_topic_archived_topic_event_id_fkey",
  add constraint "topic_event_topic_archived_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update cascade on delete cascade;

alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_topic_event_id_fkey",
  add constraint "topic_event_topic_closed_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update cascade on delete cascade;

alter table "public"."topic_event_topic_reopened" drop constraint "topic_event_topic_reopened_topic_event_id_fkey",
  add constraint "topic_event_topic_reopened_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update cascade on delete cascade;

alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_topic_event_id_fkey",
  add constraint "topic_event_topic_unarchived_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update cascade on delete cascade;

alter table "public"."topic_event" add column "type" text
 not null;

alter table "public"."topic_event" add column "user_id" uuid
 null;

alter table "public"."topic_event" drop column "type" cascade;

DROP table "public"."topic_event_topic_archived";

DROP table "public"."topic_event_topic_closed";

DROP table "public"."topic_event_topic_reopened";

DROP table "public"."topic_event_topic_unarchived";

CREATE TABLE "public"."topic_event_topic" ("topic_event_id" uuid NOT NULL, "from_closed_at" timestamptz, "to_closed_at" timestamptz, "from_name" text, "to_name" text, "from_archived_at" timestamptz, "to_archived_at" timestamptz, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("topic_event_id"));

alter table "public"."topic_event" rename column "user_id" to "actor_id";
