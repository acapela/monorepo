ALTER TABLE ONLY "public"."room" ALTER COLUMN "deadline" SET DEFAULT date_trunc('hour', now() + '7 days'::interval);
