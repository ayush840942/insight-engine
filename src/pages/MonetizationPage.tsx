import { useState } from "react";
import { useLastApp } from "@/hooks/use-last-app";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { DollarSign, Loader2, TrendingUp, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlanGate } from "@/components/PlanGate";
import { useNavigate } from "react-router-dom";

const MonetizationContent = () => {
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

      const { data: result, error } = await supabase.functions.invoke("analyze-monetization", {
        body: { appId: app.app_id, appName: app.app_name, description: app.description },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result);
      toast({ title: "Analysis Complete", description: "Monetization analysis generated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Analysis failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) return <div className="p-6"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;

  const scoreColor = (s: number) => s >= 80 ? "text-primary" : s >= 60 ? "text-yellow-400" : "text-destructive";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Monetization Analyzer</h1>
        <p className="text-muted-foreground mt-1">Optimize your revenue strategy</p>
      </div>

      {!app ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Analyze an app first to see monetization insights here.</p>
        </div>
      ) : !data ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <DollarSign className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-lg font-display mb-2">Ready to analyze monetization for <strong>{app.app_name}</strong></p>
          <p className="text-xs text-muted-foreground mb-3">Uses 1 credit</p>
          <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...</> : "Analyze Monetization"}
          </Button>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-display">Analyzing monetization strategy...</p>
        </div>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-card border border-border text-center">
                <DollarSign className={`w-8 h-8 mx-auto mb-2 ${scoreColor(data.monetization_score || 0)}`} />
                <div className={`text-4xl font-bold font-display ${scoreColor(data.monetization_score || 0)}`}>{data.monetization_score}</div>
                <div className="text-sm text-muted-foreground mt-1">Monetization Score</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-2">Current Model</h3>
                <p className="text-sm text-primary capitalize font-semibold">{data.current_model?.type}</p>
                <p className="text-sm text-muted-foreground mt-1">{data.current_model?.pricing_details}</p>
                <p className="text-sm text-muted-foreground mt-1">Est. Revenue: <strong className="text-foreground">{data.current_model?.estimated_monthly_revenue}</strong></p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.current_model?.detected_revenue_streams?.map((s: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-secondary text-xs text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {data.revenue_forecast && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Revenue Forecast
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{data.revenue_forecast.current_estimate}</div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{data.revenue_forecast.optimized_estimate}</div>
                    <div className="text-xs text-muted-foreground">Optimized</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">{data.revenue_forecast.growth_potential}</div>
                    <div className="text-xs text-muted-foreground">Growth Potential</div>
                  </div>
                </div>
              </div>
            )}

            {data.optimization_opportunities && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" /> Optimization Opportunities
                </h3>
                <div className="space-y-3">
                  {data.optimization_opportunities.map((o: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-secondary/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{o.strategy}</span>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${o.potential_impact === 'high' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>Impact: {o.potential_impact}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Effort: {o.effort}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{o.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.competitor_pricing && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-muted-foreground" /> Competitor Pricing
                </h3>
                <div className="space-y-2">
                  {data.competitor_pricing.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="font-medium">{c.competitor}</span>
                      <span className="text-muted-foreground">{c.model} • {c.price_range}</span>
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

const MonetizationPage = () => (
  <PlanGate feature="monetization">
    <MonetizationContent />
  </PlanGate>
);

export default MonetizationPage;
