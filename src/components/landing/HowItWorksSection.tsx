import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Paste your app URL",
    description: "Drop your Google Play Store link. No SDK, no code, no setup required.",
  },
  {
    step: "02",
    title: "AI analyzes everything",
    description: "Our AI scrapes reviews, competitors, store listing, and screenshots to generate deep insights.",
  },
  {
    step: "03",
    title: "Get actionable report",
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
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three steps to
            <br />
            <span className="font-serif italic font-normal">better growth</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 text-sm font-semibold">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
