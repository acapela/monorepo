
ALTER TABLE "public"."user" ADD COLUMN "last_active_at" timestamptz;
ALTER TABLE "public"."user" ALTER COLUMN "last_active_at" DROP NOT NULL;
ALTER TABLE "public"."user" ALTER COLUMN "last_active_at" SET DEFAULT now();

ALTER TABLE "public"."room" DROP COLUMN "is_finished";

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete no action;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete restrict;


DROP TABLE "public"."room_participants";

alter table "public"."message" drop constraint "message_type_fkey";

DROP TABLE "public"."message_type";

DROP TABLE "public"."message";

DROP TABLE "public"."thread";

DROP TABLE "public"."room";

ALTER TABLE "public"."user" DROP COLUMN "last_active_at";

ALTER TABLE "public"."user" DROP COLUMN "created_at";

ALTER TABLE "public"."user" DROP COLUMN "avatar_url";

ALTER TABLE ONLY "public"."user" ALTER COLUMN "name" SET DEFAULT '' '::text';

ALTER TABLE "public"."user" DROP COLUMN "name";
