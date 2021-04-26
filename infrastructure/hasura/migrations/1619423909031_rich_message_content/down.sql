
ALTER TABLE "public"."message" ADD COLUMN "text" text;
ALTER TABLE "public"."message" ALTER COLUMN "text" DROP NOT NULL;

alter table "public"."message" add constraint "check_text_message_text_not_null" check (CHECK (type <> 'TEXT'::text OR text IS NOT NULL));

ALTER TABLE "public"."message" DROP COLUMN "content";
