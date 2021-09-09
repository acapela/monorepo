BEGIN TRANSACTION;
ALTER TABLE "public"."message_reaction" DROP CONSTRAINT "message_reaction_pkey";

ALTER TABLE "public"."message_reaction"
    ADD CONSTRAINT "message_reaction_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
