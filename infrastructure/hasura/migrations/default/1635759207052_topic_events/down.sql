
alter table "public"."topic_event" rename column "actor_id" to "user_id";

DROP TABLE "public"."topic_event_topic";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."topic_event_topic_unarchived";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."topic_event_topic_reopened";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."topic_event_topic_closed";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."topic_event_topic_archived";

alter table "public"."topic_event" alter column "type" drop not null;
alter table "public"."topic_event" add column "type" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."topic_event" add column "user_id" uuid
--  null;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."topic_event" add column "type" text
--  not null;

alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_topic_event_id_fkey",
  add constraint "topic_event_topic_unarchived_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_reopened" drop constraint "topic_event_topic_reopened_topic_event_id_fkey",
  add constraint "topic_event_topic_reopened_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_topic_event_id_fkey",
  add constraint "topic_event_topic_closed_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_archived" drop constraint "topic_event_topic_archived_topic_event_id_fkey",
  add constraint "topic_event_topic_archived_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_unarchived" alter column "unarchived_by_user_id" set not null;

alter table "public"."topic_event_topic_archived" alter column "archived_by_user_id" set not null;

alter table "public"."topic_event_topic_archived" drop constraint "topic_event_topic_archived_archived_by_user_id_fkey",
  add constraint "topic_event_topic_archived_archived_by_user_id_fkey"
  foreign key ("archived_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_closed_by_user_id_fkey",
  add constraint "topic_event_topic_closed_closed_by_user_id_fkey"
  foreign key ("closed_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;

alter table "public"."topic_event_topic_reopened" drop constraint "topic_event_topic_reopened_reopened_by_user_id_fkey",
  add constraint "topic_event_topic_reopened_reopened_by_user_id_fkey"
  foreign key ("reopened_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;

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
  ("id") on update restrict on delete restrict;

DROP TABLE "public"."topic_event_topic_unarchived";

DROP TABLE "public"."topic_event_topic_archived";

DROP TABLE "public"."topic_event_topic_reopened";

DROP TABLE "public"."topic_event_topic_closed";

DROP TABLE "public"."topic_event";
