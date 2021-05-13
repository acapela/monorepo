CREATE TABLE "public"."space_participants"("space_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("space_id","user_id") , UNIQUE ("space_id", "user_id"));
