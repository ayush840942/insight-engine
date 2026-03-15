import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Reports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from("reports")
        .select("*, apps(app_name, icon_url)")
        .order("created_at", { ascending: false });
      setReports(data || []);
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-6"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;

  const scoreColor = (s: number) => s >= 80 ? "text-primary" : s >= 60 ? "text-yellow-400" : "text-destructive";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
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
          {reports.map((r) => {
            const analysis = r.analysis_json as any;
            const isExpanded = expanded === r.id;
            return (
              <motion.div
                key={r.id}
                className="rounded-2xl bg-gradient-card border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-semibold font-display">{r.apps?.app_name || "Unknown App"}</p>
                    <p className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-3 text-sm">
                      <span>UX: <strong className={scoreColor(r.ux_score || 0)}>{r.ux_score}</strong></span>
                      <span>Ret: <strong className={scoreColor(r.retention_score || 0)}>{r.retention_score}</strong></span>
                      <span>Mon: <strong className={scoreColor(r.monetization_score || 0)}>{r.monetization_score}</strong></span>
                      <span>Grw: <strong className={scoreColor(r.growth_score || 0)}>{r.growth_score}</strong></span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && analysis && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        {analysis.summary && <p className="text-sm text-muted-foreground">{analysis.summary}</p>}

                        {analysis.strengths && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Strengths</h4>
                            <ul className="space-y-1">
                              {analysis.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary">•</span>{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.weaknesses && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Weaknesses</h4>
                            <ul className="space-y-1">
                              {analysis.weaknesses.map((w: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-destructive">•</span>{w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.recommendations && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Recommendations</h4>
                            <ul className="space-y-1">
                              {analysis.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-accent">{i + 1}.</span>{rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.roast && (
                          <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5">
                            <p className="text-sm text-muted-foreground italic">🔥 {analysis.roast}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reports;
