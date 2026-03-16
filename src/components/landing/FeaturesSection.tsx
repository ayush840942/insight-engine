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
  Gauge,
  Globe,
  Layers,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Brain,
    title: "AI App Analyzer",
    description: "Get UX, retention, monetization, and growth scores powered by AI analysis of real app store data.",
    free: true,
  },
  {
    icon: Gauge,
    title: "ASO Score",
    description: "Overall App Store Optimization health score with actionable breakdown to improve discoverability.",
    free: true,
  },
  {
    icon: Tag,
    title: "Keyword Intelligence",
    description: "AI-powered keyword suggestions with difficulty, volume, and relevance scores for your store listing.",
    free: true,
  },
  {
    icon: Eye,
    title: "Store Listing Optimizer",
    description: "Get AI suggestions for title, description, icon, and screenshots to improve conversion rates.",
    free: true,
  },
  {
    icon: MessageSquareText,
    title: "Review Intelligence",
    description: "Analyze user reviews to detect complaints, feature requests, and sentiment trends.",
    free: true,
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Auto-detect competitors, generate feature gap reports, and benchmark side-by-side.",
    free: false,
  },
  {
    icon: DollarSign,
    title: "Monetization Optimizer",
    description: "Detect monetization models, estimate revenue potential, and get pricing suggestions.",
    free: false,
  },
  {
    icon: Rocket,
    title: "Growth Plan Generator",
    description: "Get a 30-day AI-generated improvement roadmap tailored to your app's weaknesses.",
    free: false,
  },
  {
    icon: TrendingUp,
    title: "Conversion Rate Analysis",
    description: "Estimate store-to-install conversion rates and get tips to improve them.",
    free: true,
  },
  {
    icon: Search,
    title: "Category Ranking",
    description: "Estimate your category ranking and get strategies to climb higher in the charts.",
    free: true,
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description: "Track category trends, market share, and regional performance to find growth markets.",
    free: false,
  },
  {
    icon: Layers,
    title: "A/B Test Suggestions",
    description: "AI generates store listing experiments — icons, screenshots, descriptions — with impact scores.",
    free: false,
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
            Everything you need to
            <br />
            <span className="font-serif italic font-normal">dominate app stores</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From ASO keyword tracking to competitor analysis — all powered by AI. Many features available on the free plan.
          </p>
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
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                {feature.free && (
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                    Free
                  </Badge>
                )}
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
