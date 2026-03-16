import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, TrendingUp, Shield, DollarSign, Rocket, Flame, Star, Lock, Gauge, Tag, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KeywordSuggestion {
  keyword: string;
  difficulty: string;
  volume: string;
  relevance: number;
}

interface StoreListingTips {
  title_suggestion: string;
  short_description: string;
  icon_feedback: string;
  screenshot_tips: string[];
}

interface AnalysisResult {
  app_name: string;
  ux_score: number;
  retention_score: number;
  monetization_score: number;
  growth_score: number;
  aso_score?: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyword_suggestions?: KeywordSuggestion[];
  store_listing_tips?: StoreListingTips;
  category_ranking_estimate?: string;
  conversion_rate_estimate?: string;
  roast?: string;
}

const AnalyzeApp = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { credits, plan, hasCredits, deductCredit, loading: creditsLoading } = useCredits();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    if (!hasCredits) {
      toast({
        title: "No Credits Remaining",
        description: plan === "free"
          ? "Free plan includes 5 analyses. Upgrade to get more!"
          : "You've used all your credits this month. Upgrade for more.",
        variant: "destructive",
      });
      return;
    }

    const match = url.match(/id=([a-zA-Z0-9._]+)/);
    if (!match) {
      toast({ title: "Invalid URL", description: "Please paste a valid Google Play Store URL.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const deducted = await deductCredit();
      if (!deducted) {
        toast({ title: "No Credits", description: "Unable to deduct credit. Please upgrade.", variant: "destructive" });
        return;
      }

      const { data, error } = await supabase.functions.invoke("analyze-app", {
        body: { appId: match[1], url: url.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast({ title: "Analysis Complete!", description: `${data.app_name} has been analyzed.` });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({ title: "Analysis Failed", description: error.message || "Could not analyze this app.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-accent/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-destructive/10";
  };

  const difficultyColor = (d: string) => {
    if (d === "low") return "text-accent bg-accent/10";
    if (d === "medium") return "text-yellow-500 bg-yellow-500/10";
    return "text-destructive bg-destructive/10";
  };

  const overallScore = result
    ? Math.round((result.ux_score + result.retention_score + result.monetization_score + result.growth_score) / 4)
    : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analyze App</h1>
          <p className="text-muted-foreground mt-1 text-sm">Paste a Google Play Store URL to get AI-powered insights</p>
        </div>
        {!creditsLoading && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Credits remaining</div>
            <div className={`text-2xl font-bold ${hasCredits ? "text-accent" : "text-destructive"}`}>
              {credits}
            </div>
            <span className="text-xs text-muted-foreground capitalize">{plan} plan</span>
          </div>
        )}
      </div>

      {!creditsLoading && !hasCredits && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-accent/30 bg-accent/5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h3 className="font-semibold">You've used all your analyses</h3>
              <p className="text-sm text-muted-foreground">
                {plan === "free"
                  ? "Free plan includes 5 analyses. Upgrade to unlock up to 500/month."
                  : "Upgrade to a higher plan for more monthly analyses."}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/dashboard/upgrade")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full whitespace-nowrap">
            Upgrade Now
          </Button>
        </motion.div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="https://play.google.com/store/apps/details?id=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 h-12 bg-card border-border rounded-full"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={loading || !url.trim() || (!hasCredits && !creditsLoading)}
          className="h-12 px-8 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
        </Button>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Analyzing app with AI...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take 15-30 seconds</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header with overall score */}
            <div className="p-6 rounded-2xl bg-card border border-border flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{result.app_name}</h2>
                <p className="text-muted-foreground text-sm">{result.summary}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  {result.category_ranking_estimate && (
                    <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {result.category_ranking_estimate}</span>
                  )}
                  {result.conversion_rate_estimate && (
                    <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> CVR: {result.conversion_rate_estimate}</span>
                  )}
                </div>
              </div>
              <div className="text-center ml-6">
                <div className={`w-20 h-20 rounded-2xl ${scoreBg(overallScore)} flex items-center justify-center`}>
                  <span className={`text-3xl font-bold ${scoreColor(overallScore)}`}>{overallScore}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Overall</p>
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: "UX", score: result.ux_score, icon: Shield },
                { label: "Retention", score: result.retention_score, icon: TrendingUp },
                { label: "Monetization", score: result.monetization_score, icon: DollarSign },
                { label: "Growth", score: result.growth_score, icon: Rocket },
                { label: "ASO", score: result.aso_score || 0, icon: Gauge },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-card border border-border text-center">
                  <item.icon className={`w-5 h-5 mx-auto mb-2 ${scoreColor(item.score)}`} />
                  <div className={`text-2xl font-bold ${scoreColor(item.score)}`}>{item.score}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                  <Progress value={item.score} className="h-1 mt-2" />
                </div>
              ))}
            </div>

            {/* Keyword Suggestions */}
            {result.keyword_suggestions && result.keyword_suggestions.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-accent" /> ASO Keyword Suggestions
                </h3>
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
                    <span>Keyword</span>
                    <span className="text-center">Difficulty</span>
                    <span className="text-center">Volume</span>
                    <span className="text-center">Relevance</span>
                  </div>
                  {result.keyword_suggestions.map((kw, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-4 items-center py-2 text-sm"
                    >
                      <span className="font-medium">{kw.keyword}</span>
                      <span className="text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                      </span>
                      <span className="text-center">
                        <span className="flex items-center justify-center gap-0.5 text-xs text-muted-foreground">
                          {kw.volume === "high" ? <ArrowUpRight className="w-3 h-3 text-accent" /> : kw.volume === "low" ? <ArrowDownRight className="w-3 h-3 text-destructive" /> : null}
                          {kw.volume}
                        </span>
                      </span>
                      <span className="text-center">
                        <span className={`text-xs font-bold ${scoreColor(kw.relevance)}`}>{kw.relevance}%</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Store Listing Tips */}
            {result.store_listing_tips && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" /> Store Listing Optimization
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Suggested Title</p>
                    <p className="text-sm font-medium bg-accent/5 p-3 rounded-xl border border-accent/20">{result.store_listing_tips.title_suggestion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Short Description</p>
                    <p className="text-sm bg-secondary/50 p-3 rounded-xl">{result.store_listing_tips.short_description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Icon Feedback</p>
                    <p className="text-sm text-muted-foreground">{result.store_listing_tips.icon_feedback}</p>
                  </div>
                  {result.store_listing_tips.screenshot_tips && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Screenshot Tips</p>
                      <ul className="space-y-1">
                        {result.store_listing_tips.screenshot_tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-0.5">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" /> Weaknesses
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-accent" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-medium">{i + 1}.</span>{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* App Roast */}
            {result.roast && (
              <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" /> App Roast 🔥
                </h3>
                <p className="text-muted-foreground italic text-sm">{result.roast}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzeApp;
