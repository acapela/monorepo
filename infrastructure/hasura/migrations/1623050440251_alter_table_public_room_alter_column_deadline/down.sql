ALTER TABLE ONLY "public"."room" ALTER COLUMN "deadline" SET DEFAULT (now() + '7 days'::interval);
