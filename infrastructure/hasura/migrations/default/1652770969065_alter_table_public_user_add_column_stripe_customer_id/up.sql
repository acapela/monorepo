alter table "public"."user"
    add column "stripe_customer_id" text null unique,
    add column "stripe_subscription_id" text null unique;
