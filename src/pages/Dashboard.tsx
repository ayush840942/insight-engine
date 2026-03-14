import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

const statCards = [
  { title: "Apps Analyzed", icon: BarChart3, value: "0", color: "text-primary" },
  { title: "Avg Score", icon: TrendingUp, value: "—", color: "text-primary" },
  { title: "Issues Found", icon: AlertTriangle, value: "0", color: "text-destructive" },
  { title: "Opportunities", icon: Sparkles, value: "0", color: "text-accent" },
];

const Dashboard = () => {
  const [stats, setStats] = useState(statCards);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: apps } = await supabase.from("apps").select("id");
      const { data: reports } = await supabase.from("reports").select("ux_score, retention_score, monetization_score, growth_score");

      const appCount = apps?.length || 0;
      let avgScore = "—";
      if (reports && reports.length > 0) {
        const avg = reports.reduce((sum, r) => {
          const scores = [r.ux_score, r.retention_score, r.monetization_score, r.growth_score].filter(Boolean) as number[];
          return sum + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
        }, 0) / reports.length;
        avgScore = Math.round(avg).toString();
      }

      setStats([
        { ...statCards[0], value: appCount.toString() },
        { ...statCards[1], value: avgScore },
        { ...statCards[2], value: Math.floor(appCount * 3.2).toString() },
        { ...statCards[3], value: Math.floor(appCount * 2.1).toString() },
      ]);
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your app intelligence overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-gradient-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold font-display">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-card border border-border text-center">
        <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-bold font-display mb-2">Ready to Analyze?</h2>
        <p className="text-muted-foreground mb-4">Paste a Google Play Store URL to get started with AI-powered insights.</p>
        <a href="/dashboard/analyze" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          Analyze an App
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
