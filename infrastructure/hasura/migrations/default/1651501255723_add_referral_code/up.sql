

alter table "public"."user" add column "used_referral_code" text
 null;

alter table "public"."user" add column "referral_code" text
 null;

alter table "public"."user" add constraint "user_referral_code_key" unique ("referral_code");
