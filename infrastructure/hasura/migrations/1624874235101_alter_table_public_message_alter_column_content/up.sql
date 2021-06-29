ALTER TABLE ONLY "public"."message" ALTER COLUMN "content" SET DEFAULT jsonb_build_object();
