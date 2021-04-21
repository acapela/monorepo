ALTER TABLE "public"."message" ADD COLUMN "content" jsonb NOT NULL DEFAULT jsonb_build_array();
