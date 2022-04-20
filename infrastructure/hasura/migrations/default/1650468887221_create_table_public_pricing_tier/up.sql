CREATE TABLE "public"."pricing_tier"
(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

insert into "public"."pricing_tier" values ('free'), ('premium'), ('business');

alter table "public"."user"
    add column "pricing_tier" text not null references "public"."pricing_tier" default 'premium';