import { useState } from "react";
import { useLastApp } from "@/hooks/use-last-app";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { FileText, Loader2, ThumbsUp, ThumbsDown, Minus, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlanGate } from "@/components/PlanGate";
import { useNavigate } from "react-router-dom";

const ReviewsContent = () => {
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

      const { data: result, error } = await supabase.functions.invoke("analyze-reviews", {
        body: { appId: app.app_id, appName: app.app_name, description: app.description },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result);
      toast({ title: "Analysis Complete", description: "Review intelligence generated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Analysis failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) return <div className="p-6"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;

  const sentiment = data?.overall_sentiment;
  const total = sentiment ? sentiment.positive + sentiment.neutral + sentiment.negative : 0;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Review Intelligence</h1>
        <p className="text-muted-foreground mt-1">AI-powered analysis of user reviews</p>
      </div>

      {!app ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Analyze an app first to see review intelligence here.</p>
        </div>
      ) : !data ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
          <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-lg font-display mb-2">Ready to analyze reviews for <strong>{app.app_name}</strong></p>
          <p className="text-xs text-muted-foreground mb-3">Uses 1 credit</p>
          <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...</> : "Analyze Reviews"}
          </Button>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-display">Analyzing reviews...</p>
          <p className="text-sm text-muted-foreground">This may take 15-30 seconds</p>
        </div>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {sentiment && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h2 className="font-bold font-display mb-4">Sentiment Overview</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <ThumbsUp className="w-6 h-6 text-primary mx-auto mb-1" />
                    <div className="text-2xl font-bold text-primary">{total ? Math.round(sentiment.positive / total * 100) : 0}%</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center">
                    <Minus className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-yellow-400">{total ? Math.round(sentiment.neutral / total * 100) : 0}%</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <ThumbsDown className="w-6 h-6 text-destructive mx-auto mb-1" />
                    <div className="text-2xl font-bold text-destructive">{total ? Math.round(sentiment.negative / total * 100) : 0}%</div>
                    <div className="text-xs text-muted-foreground">Negative</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Trend: <strong className="text-foreground capitalize">{data.sentiment_trend}</strong></p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" /> Top Complaints
                </h3>
                <div className="space-y-3">
                  {data.top_complaints?.map((c: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{c.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.severity === 'high' ? 'bg-destructive/20 text-destructive' : c.severity === 'medium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-muted text-muted-foreground'}`}>{c.severity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">"{c.example_review}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-primary" /> Top Praises
                </h3>
                <div className="space-y-3">
                  {data.top_praises?.map((p: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <span className="text-sm font-medium">{p.category}</span>
                      <p className="text-xs text-muted-foreground italic">"{p.example_review}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {data.feature_requests && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" /> Feature Requests
                </h3>
                <div className="space-y-3">
                  {data.feature_requests.map((f: any, i: number) => (
                    <div key={i} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{f.feature}</p>
                        <p className="text-xs text-muted-foreground italic">"{f.example_review}"</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${f.demand_level === 'high' ? 'bg-primary/20 text-primary' : f.demand_level === 'medium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-muted text-muted-foreground'}`}>{f.demand_level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.action_items && (
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3">Action Items</h3>
                <ul className="space-y-2">
                  {data.action_items.map((a: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">{i + 1}.</span>{a}
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

const ReviewsPage = () => (
  <PlanGate feature="reviews">
    <ReviewsContent />
  </PlanGate>
);

export default ReviewsPage;
