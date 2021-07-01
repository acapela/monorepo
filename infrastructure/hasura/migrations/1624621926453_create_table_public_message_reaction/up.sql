CREATE TABLE "public"."message_reaction"("message_id" uuid NOT NULL, "user_id" uuid NOT NULL, "emoji" text NOT NULL, PRIMARY KEY ("message_id","user_id","emoji") , FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE cascade);
