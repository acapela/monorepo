CREATE OR REPLACE FUNCTION public.count_user_referrals(user_row "user")
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*) FROM public.user WHERE used_referral_code = user_row.referral_code;
$function$;
