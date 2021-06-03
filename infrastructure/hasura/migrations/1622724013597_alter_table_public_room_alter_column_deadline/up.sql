ALTER TABLE ONLY "public"."room" ALTER COLUMN "deadline" SET DEFAULT now() + interval '7 days';
