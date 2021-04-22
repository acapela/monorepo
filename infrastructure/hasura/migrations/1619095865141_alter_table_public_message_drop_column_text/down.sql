ALTER TABLE "public"."message" ADD COLUMN "text" text;
ALTER TABLE "public"."message" ALTER COLUMN "text" DROP NOT NULL;
