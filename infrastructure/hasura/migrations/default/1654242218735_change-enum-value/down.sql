ALTER TABLE
    public.user DROP CONSTRAINT user_subscription_plan_fkey;

UPDATE
    public.subscription_plan
SET
    value = 'business'
WHERE
    value = 'ultimate';

UPDATE
    public.user
SET
    subscription_plan = 'business'
WHERE
    subscription_plan = 'ultimate';

ALTER TABLE
    "public"."user"
ADD
    CONSTRAINT "user_subscription_plan_fkey" FOREIGN KEY ("subscription_plan") REFERENCES "public"."subscription_plan" ("value") ON UPDATE RESTRICT ON DELETE
SET
    NULL;
