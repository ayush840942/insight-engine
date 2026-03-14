import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, TrendingUp, Shield, DollarSign, Rocket, Flame, Star } from "lucide-react";

interface AnalysisResult {
  app_name: string;
  ux_score: number;
  retention_score: number;
  monetization_score: number;
  growth_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  roast?: string;
}

const AnalyzeApp = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    // Extract app ID from URL
    const match = url.match(/id=([a-zA-Z0-9._]+)/);
    if (!match) {
      toast({ title: "Invalid URL", description: "Please paste a valid Google Play Store URL.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
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
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-400";
    return "text-destructive";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Analyze App</h1>
        <p className="text-muted-foreground mt-1">Paste a Google Play Store URL to get AI-powered insights</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="https://play.google.com/store/apps/details?id=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-11 h-12 bg-secondary border-border"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          className="h-12 px-6 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
        </Button>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-display">Analyzing app with AI...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take 15-30 seconds</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* App Name & Summary */}
            <div className="p-6 rounded-2xl bg-gradient-card border border-border">
              <h2 className="text-2xl font-bold font-display mb-2">{result.app_name}</h2>
              <p className="text-muted-foreground">{result.summary}</p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "UX Score", score: result.ux_score, icon: Shield },
                { label: "Retention", score: result.retention_score, icon: TrendingUp },
                { label: "Monetization", score: result.monetization_score, icon: DollarSign },
                { label: "Growth", score: result.growth_score, icon: Rocket },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-gradient-card border border-border text-center">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${scoreColor(item.score)}`} />
                  <div className={`text-3xl font-bold font-display ${scoreColor(item.score)}`}>{item.score}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
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
            <div className="p-6 rounded-2xl bg-gradient-card border border-border">
              <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-accent" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">{i + 1}.</span>{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Roast */}
            {result.roast && (
              <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5">
                <h3 className="font-bold font-display mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" /> App Roast 🔥
                </h3>
                <p className="text-muted-foreground italic">{result.roast}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzeApp;
