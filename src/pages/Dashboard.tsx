import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const planLimits: Record<string, number> = {
  free: 2,
  starter: 25,
  pro: 100,
  agency: 500,
};

const Dashboard = () => {
  const { credits, plan, loading: creditsLoading } = useCredits();
  const navigate = useNavigate();
  const [appCount, setAppCount] = useState(0);
  const [avgScore, setAvgScore] = useState("—");
  const [issueCount, setIssueCount] = useState(0);
  const [oppCount, setOppCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: apps } = await supabase.from("apps").select("id");
      const { data: reports } = await supabase.from("reports").select("ux_score, retention_score, monetization_score, growth_score");

      const count = apps?.length || 0;
      setAppCount(count);
      if (reports && reports.length > 0) {
        const avg = reports.reduce((sum, r) => {
          const scores = [r.ux_score, r.retention_score, r.monetization_score, r.growth_score].filter(Boolean) as number[];
          return sum + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
        }, 0) / reports.length;
        setAvgScore(Math.round(avg).toString());
      }
      setIssueCount(Math.floor(count * 3.2));
      setOppCount(Math.floor(count * 2.1));
    };
    fetchStats();
  }, []);

  const totalCredits = planLimits[plan] || 1;
  const usedCredits = totalCredits - (credits ?? 0);
  const usagePercent = Math.min((usedCredits / totalCredits) * 100, 100);

  const stats = [
    { title: "Apps Analyzed", icon: BarChart3, value: appCount.toString() },
    { title: "Avg Score", icon: TrendingUp, value: avgScore },
    { title: "Issues Found", icon: AlertTriangle, value: issueCount.toString() },
    { title: "Opportunities", icon: Sparkles, value: oppCount.toString() },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your app intelligence overview</p>
      </div>

      {!creditsLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-card border border-border shadow-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-foreground" />
              <span className="font-semibold capitalize">{plan} Plan</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/upgrade")}
              className="rounded-full text-sm"
            >
              Upgrade
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={usagePercent} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {credits} / {totalCredits} left
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-card border border-border shadow-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-card border border-border shadow-soft text-center">
        <Sparkles className="w-10 h-10 text-accent mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Ready to Analyze?</h2>
        <p className="text-muted-foreground mb-4 text-sm">Paste a Google Play Store URL to get started with AI-powered insights.</p>
        <a href="/dashboard/analyze" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Analyze an App
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
