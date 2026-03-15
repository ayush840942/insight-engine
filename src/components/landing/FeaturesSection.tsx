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
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI App Analyzer",
    description: "Get UX, retention, monetization, and growth scores powered by AI analysis of real app data.",
  },
  {
    icon: MessageSquareText,
    title: "Review Intelligence",
    description: "Analyze hundreds of user reviews to detect complaints, feature requests, and sentiment patterns.",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Auto-detect competitors and generate feature gap reports with side-by-side comparisons.",
  },
  {
    icon: DollarSign,
    title: "Monetization Optimizer",
    description: "Detect monetization models and get AI suggestions to improve revenue with estimated potential.",
  },
  {
    icon: Rocket,
    title: "Growth Plan Generator",
    description: "Get a 30-day AI-generated improvement roadmap tailored to your app's weaknesses.",
  },
  {
    icon: Flame,
    title: "App Roast Mode",
    description: "Get a brutally honest critique of your app with no-BS feedback on what's killing growth.",
  },
  {
    icon: Search,
    title: "ASO Keyword Suggestions",
    description: "Discover high-impact keywords and optimize your store listing to rank higher in search results.",
  },
  {
    icon: BarChart3,
    title: "User Acquisition Tactics",
    description: "AI recommends the best channels, ad strategies, and viral loops to acquire users cost-effectively.",
  },
  {
    icon: Target,
    title: "Retention Strategies",
    description: "Identify churn risks and get personalized push notification, onboarding, and engagement strategies.",
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
            Everything You Need to
            <span className="text-gradient"> Grow Your App</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI-powered analysis tools designed for mobile app developers and growth teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
