BEGIN TRANSACTION;
ALTER TABLE "public"."github_account" DROP CONSTRAINT "github_account_pkey";

ALTER TABLE "public"."github_account"
    ADD CONSTRAINT "github_account_pkey" PRIMARY KEY ("github_installation_id");
COMMIT TRANSACTION;
