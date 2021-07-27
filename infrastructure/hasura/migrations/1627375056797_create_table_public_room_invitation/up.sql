CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."room_invitation"("id" uuid NOT NULL, "email" text NOT NULL, "used_at" date, "token" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "inviting_user_id" uuid NOT NULL, "used_by_user_id" uuid, "room_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("inviting_user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("used_by_user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"), UNIQUE ("token"));
