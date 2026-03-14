import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("reports")
        .select("*, apps(app_name, icon_url)")
        .order("created_at", { ascending: false });
      setReports(data || []);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Reports</h1>
        <p className="text-muted-foreground mt-1">View all your analysis reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No reports yet. Analyze an app to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-gradient-card border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold font-display">{r.apps?.app_name || "Unknown App"}</p>
                <p className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <span>UX: <strong className="text-primary">{r.ux_score}</strong></span>
                <span>Ret: <strong className="text-primary">{r.retention_score}</strong></span>
                <span>Mon: <strong className="text-primary">{r.monetization_score}</strong></span>
                <span>Grw: <strong className="text-primary">{r.growth_score}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
