import { motion } from "framer-motion";
import {
  Brain,
  MessageSquareText,
  Users,
  DollarSign,
  Rocket,
  Search,
  TrendingUp,
  Eye,
  PieChart,
  Gauge,
  Globe,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI App Analyzer",
    description: "Get UX, retention, monetization, and growth scores powered by AI analysis of real app store data.",
  },
  {
    icon: MessageSquareText,
    title: "Review Intelligence",
    description: "Analyze thousands of user reviews to detect complaints, feature requests, and sentiment trends.",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Auto-detect competitors, generate feature gap reports, and benchmark your app side-by-side.",
  },
  {
    icon: DollarSign,
    title: "Monetization Optimizer",
    description: "Detect monetization models, estimate revenue potential, and get AI suggestions for pricing.",
  },
  {
    icon: Rocket,
    title: "Growth Plan Generator",
    description: "Get a 30-day AI-generated improvement roadmap tailored to your app's weaknesses.",
  },
  {
    icon: Search,
    title: "ASO Keyword Intelligence",
    description: "Discover high-impact keywords, track ranking positions, and optimize your store listing.",
  },
  {
    icon: TrendingUp,
    title: "Funnel & Conversion",
    description: "Identify where users drop off — from store view to install to first session to retention.",
  },
  {
    icon: Eye,
    title: "UX Audit & Insights",
    description: "AI-powered UX scoring with screenshot analysis, UI pattern detection, and accessibility tips.",
  },
  {
    icon: PieChart,
    title: "Cohort Analysis",
    description: "Track user retention cohorts, predict churn risk, and improve D1/D7/D30 retention rates.",
  },
  {
    icon: Gauge,
    title: "Performance Monitor",
    description: "Analyze crash rates, ANR data, and app vitals to improve technical quality scores.",
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description: "Track category trends, market share, and regional performance to find growth markets.",
  },
  {
    icon: Layers,
    title: "A/B Test Suggestions",
    description: "AI generates store listing experiments — icons, screenshots, descriptions — with impact scores.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative" id="features">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for app teams,
            <br />
            <span className="font-serif italic font-normal">powered by AI</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
