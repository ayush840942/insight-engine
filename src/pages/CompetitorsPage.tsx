import { useState } from "react";
import { useLastApp } from "@/hooks/use-last-app";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { Users, Loader2, Shield, Star, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlanGate } from "@/components/PlanGate";
import { useNavigate } from "react-router-dom";

const CompetitorsContent = () => {
  const { app, loading: appLoading } = useLastApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();
  const { hasCredits, deductCredit } = useCredits();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!app) return;

    if (!hasCredits) {
      toast({ title: "No Credits", description: "You've used all your credits. Upgrade for more.", variant: "destructive" });
      navigate("/dashboard/upgrade");
      return;
    }

    setLoading(true);
    try {
      const deducted = await deductCredit();
      if (!deducted) {
        toast({ title: "No Credits", description: "Unable to deduct credit.", variant: "destructive" });
        return;
      }

      const { data: result, error } = await supabase.functions.invoke("analyze-competitors", {
        body: { appId: app.app_id, appName: app.app_name, description: app.description },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result);
      toast({ title: "Analysis Complete", description: "Competitor intelligence generated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Analysis failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) return <div className="p-6"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Competitor Intelligence</h1>
        <p className="text-muted-foreground mt-1">Compare your app with competitors</p>
      </div>

      {!app ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Analyze an app first to see competitor analysis here.</p>
        </div>
      ) : !data ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <Users className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-lg font-display mb-2">Ready to analyze competitors for <strong>{app.app_name}</strong></p>
          <p className="text-xs text-muted-foreground mb-3">Uses 1 credit</p>
          <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...</> : "Analyze Competitors"}
          </Button>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-display">Analyzing competitors...</p>
          <p className="text-sm text-muted-foreground">This may take 15-30 seconds</p>
        </div>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {data.competitive_position && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h2 className="text-xl font-bold font-display mb-2">Market Position</h2>
                <p className="text-muted-foreground">{data.competitive_position}</p>
              </div>
            )}

            <div className="grid gap-4">
              {data.competitors?.map((c: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold font-display text-lg">{c.name}</h3>
                      <p className="text-sm text-muted-foreground">{c.category} • {c.estimated_installs} installs</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{c.estimated_rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Shield className="w-4 h-4 inline mr-1 text-primary" /><strong>Advantage:</strong> <span className="text-muted-foreground">{c.advantage_over_target}</span></p>
                    <p><AlertTriangle className="w-4 h-4 inline mr-1 text-destructive" /><strong>Weakness:</strong> <span className="text-muted-foreground">{c.weakness_vs_target}</span></p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {c.key_features?.map((f: string, j: number) => (
                        <span key={j} className="px-2 py-1 rounded-lg bg-secondary text-xs text-muted-foreground">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {data.feature_gap_analysis && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-4">Feature Gap Analysis</h3>
                <div className="space-y-3">
                  {data.feature_gap_analysis.map((f: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{f.feature}</span>
                      <div className="flex gap-4">
                        <span className={f.your_app === "has" ? "text-primary" : f.your_app === "weak" ? "text-yellow-400" : "text-destructive"}>
                          You: {f.your_app}
                        </span>
                        <span className="text-muted-foreground">Competitors: {f.competitors}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.recommendations && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {data.recommendations.map((r: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">{i + 1}.</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompetitorsPage = () => (
  <PlanGate feature="competitors">
    <CompetitorsContent />
  </PlanGate>
);

export default CompetitorsPage;
