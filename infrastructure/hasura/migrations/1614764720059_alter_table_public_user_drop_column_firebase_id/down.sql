ALTER TABLE "public"."user" ADD COLUMN "firebase_id" text;
ALTER TABLE "public"."user" ALTER COLUMN "firebase_id" DROP NOT NULL;
ALTER TABLE "public"."user" ADD CONSTRAINT user_firebase_id_key UNIQUE (firebase_id);
