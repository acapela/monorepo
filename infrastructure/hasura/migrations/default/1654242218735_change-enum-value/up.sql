UPDATE public.subscription_plan SET value = 'ultimate' WHERE value = 'business';
UPDATE public.user SET subscription_plan = 'ultimate' WHERE subscription_plan = 'business';
