import { motion } from "framer-motion";
import { Upload, Brain, FileBarChart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Paste Your App URL",
    description: "Drop your Google Play Store link. That's it — no SDK, no code, no setup required.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes Everything",
    description: "Our AI scrapes reviews, competitors, store listing, screenshots and generates deep insights in seconds.",
  },
  {
    icon: FileBarChart,
    step: "03",
    title: "Get Actionable Report",
    description: "Receive scores, competitor gaps, ASO keywords, monetization tips, and a 30-day growth roadmap.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 relative" id="how-it-works">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">Three steps. No SDK integration needed.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 z-10">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}

              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
                <step.icon className="w-9 h-9 text-primary" />
                <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
