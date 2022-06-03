-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
UPDATE public.subscription_plan SET value = 'business' WHERE value = 'ultimate';
UPDATE public.user SET subscription_plan = 'business' WHERE subscription_plan = 'ultimate';
