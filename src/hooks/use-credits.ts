import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("credits_remaining, subscription_plan")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setCredits(data.credits_remaining);
      setPlan(data.subscription_plan);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCredits();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchCredits();
      }
      if (event === "SIGNED_OUT") {
        setCredits(null);
        setPlan("free");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchCredits]);

  const deductCredit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("user_id", user.id)
      .single();

    if (!data || data.credits_remaining <= 0) return false;

    const { error } = await supabase
      .from("profiles")
      .update({ credits_remaining: data.credits_remaining - 1 })
      .eq("user_id", user.id);

    if (error) return false;
    
    setCredits(data.credits_remaining - 1);
    return true;
  };

  const hasCredits = credits !== null && credits > 0;

  return { credits, plan, loading, hasCredits, deductCredit, refetch: fetchCredits };
}
