import { motion } from "framer-motion";
import {
  Brain,
  MessageSquareText,
  Users,
  DollarSign,
  Rocket,
  Flame,
  Search,
  BarChart3,
  Target,
  TrendingUp,
  Eye,
  Layers,
  PieChart,
  Gauge,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI App Analyzer",
    description: "Get UX, retention, monetization, and growth scores powered by AI analysis of real app store data.",
    badge: "Core",
  },
  {
    icon: MessageSquareText,
    title: "Review Intelligence",
    description: "Analyze thousands of user reviews to detect complaints, feature requests, and sentiment trends over time.",
    badge: null,
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Auto-detect competitors, generate feature gap reports, and benchmark your app side-by-side.",
    badge: null,
  },
  {
    icon: DollarSign,
    title: "Monetization Optimizer",
    description: "Detect monetization models, estimate revenue potential, and get AI suggestions for pricing strategy.",
    badge: null,
  },
  {
    icon: Rocket,
    title: "Growth Plan Generator",
    description: "Get a 30-day AI-generated improvement roadmap tailored to your app's weaknesses and market position.",
    badge: null,
  },
  {
    icon: Flame,
    title: "App Roast Mode",
    description: "Get a brutally honest critique of your app with no-BS feedback on what's killing your growth.",
    badge: "Fun",
  },
  {
    icon: Search,
    title: "ASO Keyword Intelligence",
    description: "Discover high-impact keywords, track ranking positions, and optimize your store listing like App Radar.",
    badge: "New",
  },
  {
    icon: TrendingUp,
    title: "Funnel & Conversion Analysis",
    description: "Identify where users drop off — from store view to install to first session to retention. Like Mixpanel, but for store data.",
    badge: "New",
  },
  {
    icon: Eye,
    title: "UX Audit & Heatmap Insights",
    description: "AI-powered UX scoring with screenshot analysis, UI pattern detection, and accessibility recommendations.",
    badge: "New",
  },
  {
    icon: PieChart,
    title: "Cohort & Retention Analysis",
    description: "Track user retention cohorts, predict churn risk, and get strategies to improve D1/D7/D30 retention rates.",
    badge: "New",
  },
  {
    icon: Gauge,
    title: "Performance & Vitals Monitor",
    description: "Analyze crash rates, ANR data, and app vitals from store data to improve technical quality scores.",
    badge: "New",
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description: "Track category trends, market share estimates, and regional performance to find untapped growth markets.",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "User Acquisition Tactics",
    description: "AI recommends the best channels, ad creatives, and viral loops to acquire users cost-effectively.",
    badge: null,
  },
  {
    icon: Target,
    title: "Retention & Engagement Strategies",
    description: "Get personalized push notification strategies, onboarding flows, and re-engagement campaign ideas.",
    badge: null,
  },
  {
    icon: Layers,
    title: "A/B Test Suggestions",
    description: "AI generates store listing experiments — icons, screenshots, descriptions — with predicted impact scores.",
    badge: "New",
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
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Replace 5+ Tools With
            <span className="text-gradient"> One Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything from App Radar, Mixpanel, UXCam, and Sensor Tower — powered by AI, at a fraction of the cost.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  {feature.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      feature.badge === "New"
                        ? "bg-primary/10 text-primary"
                        : feature.badge === "Core"
                        ? "bg-accent/10 text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
