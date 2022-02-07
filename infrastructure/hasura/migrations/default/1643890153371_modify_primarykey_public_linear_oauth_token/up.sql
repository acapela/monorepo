BEGIN TRANSACTION;
ALTER TABLE "public"."linear_oauth_token" DROP CONSTRAINT "linear_oauth_token_pkey";

ALTER TABLE "public"."linear_oauth_token"
    ADD CONSTRAINT "linear_oauth_token_pkey" PRIMARY KEY ("user_id", "linear_user_id", "linear_organization_id");
COMMIT TRANSACTION;
