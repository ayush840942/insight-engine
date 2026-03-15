import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LastApp {
  id: string;
  app_id: string;
  app_name: string | null;
  description: string | null;
}

export function useLastApp() {
  const [app, setApp] = useState<LastApp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("apps")
        .select("id, app_id, app_name, description")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      setApp(data || null);
      setLoading(false);
    };
    fetch();
  }, []);

  return { app, loading };
}
