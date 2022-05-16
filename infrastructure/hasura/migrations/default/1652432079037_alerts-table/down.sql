
DROP TABLE "public"."alert_read_receipt";

alter table "public"."alert" rename to "alerts";

alter table "public"."alerts" alter column "received_at" drop not null;
alter table "public"."alerts" add column "received_at" timestamptz;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."alerts" add column "expires_at" timestamptz
--  null;

DROP TABLE "public"."alerts";
