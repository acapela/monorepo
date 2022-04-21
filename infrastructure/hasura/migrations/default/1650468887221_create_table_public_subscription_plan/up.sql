CREATE TABLE "public"."subscription_plan"
(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

insert into "public"."subscription_plan" values ('free'), ('premium'), ('business');

alter table "public"."user"
    add column "subscription_plan" text not null references "public"."subscription_plan" default 'premium';