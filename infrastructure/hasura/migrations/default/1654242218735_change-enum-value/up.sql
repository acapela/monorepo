ALTER TABLE
    public.user DROP CONSTRAINT user_subscription_plan_fkey;

UPDATE
    public.user
SET
    subscription_plan = 'ultimate'
WHERE
    subscription_plan = 'business';

UPDATE
    public.subscription_plan
SET
    value = 'ultimate'
WHERE
    value = 'business';

ALTER TABLE
    "public"."user"
ADD
    CONSTRAINT "user_subscription_plan_fkey" FOREIGN KEY ("subscription_plan") REFERENCES "public"."subscription_plan" ("value") ON UPDATE RESTRICT ON DELETE
SET
    NULL;
