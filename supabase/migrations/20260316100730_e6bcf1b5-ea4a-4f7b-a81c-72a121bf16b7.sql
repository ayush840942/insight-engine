UPDATE public.profiles SET credits_remaining = 5 WHERE subscription_plan = 'free' AND credits_remaining <= 2;

CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    credits_remaining = CASE subscription_plan
      WHEN 'free' THEN 5
      WHEN 'starter' THEN 25
      WHEN 'pro' THEN 100
      WHEN 'agency' THEN 500
      ELSE 5
    END,
    billing_cycle_start = now(),
    updated_at = now()
  WHERE billing_cycle_start <= now() - interval '30 days';
END;
$function$;

ALTER TABLE public.profiles ALTER COLUMN credits_remaining SET DEFAULT 5;