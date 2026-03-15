import { useState } from "react";
import { useLastApp } from "@/hooks/use-last-app";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { Rocket, Loader2, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlanGate } from "@/components/PlanGate";
import { useNavigate } from "react-router-dom";

const GrowthContent = () => {
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

      const { data: result, error } = await supabase.functions.invoke("growth-plan", {
        body: { appId: app.app_id, appData: { appName: app.app_name, description: app.description } },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result);
      toast({ title: "Plan Generated", description: "30-day growth plan is ready." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate plan.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) return <div className="p-6"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Growth Plan</h1>
        <p className="text-muted-foreground mt-1">AI-generated 30-day improvement roadmap</p>
      </div>

      {!app ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <Rocket className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Analyze an app first to see your growth plan here.</p>
        </div>
      ) : !data ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <Rocket className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-lg font-display mb-2">Ready to generate growth plan for <strong>{app.app_name}</strong></p>
          <p className="text-xs text-muted-foreground mb-3">Uses 1 credit</p>
          <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</> : "Generate Growth Plan"}
          </Button>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-display">Generating 30-day growth plan...</p>
        </div>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-4">
              {data.weeks?.map((week: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold font-display">W{week.week}</span>
                    </div>
                    <div>
                      <h3 className="font-bold font-display">{week.title}</h3>
                      <p className="text-xs text-muted-foreground">{week.expected_impact}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-13">
                    {week.tasks?.map((task: string, j: number) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {data.viral_strategies && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" /> Viral Strategies
                </h3>
                <ul className="space-y-2">
                  {data.viral_strategies.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-0.5">🚀</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.aso_tips && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> ASO Optimization Tips
                </h3>
                <ul className="space-y-2">
                  {data.aso_tips.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">{i + 1}.</span>{t}
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

const GrowthPage = () => (
  <PlanGate feature="growth">
    <GrowthContent />
  </PlanGate>
);

export default GrowthPage;
