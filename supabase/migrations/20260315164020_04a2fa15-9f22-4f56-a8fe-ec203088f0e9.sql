
-- Add billing_cycle_start to profiles for monthly credit reset tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS billing_cycle_start timestamp with time zone DEFAULT now();

-- Create function to reset credits for users whose billing cycle has renewed
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  plan_credits RECORD;
BEGIN
  -- Reset credits for users whose billing cycle started more than 30 days ago
  UPDATE public.profiles
  SET 
    credits_remaining = CASE subscription_plan
      WHEN 'free' THEN 2
      WHEN 'starter' THEN 25
      WHEN 'pro' THEN 100
      WHEN 'agency' THEN 500
      ELSE 2
    END,
    billing_cycle_start = now(),
    updated_at = now()
  WHERE billing_cycle_start <= now() - interval '30 days';
END;
$$;
