drop TRIGGER  "set_public_message_updated_at" ON "public"."message";

alter table "public"."message" drop column "updated_at";
