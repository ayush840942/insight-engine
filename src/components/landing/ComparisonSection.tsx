import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type Status = "yes" | "no" | "partial";

const tools = ["Mobile Wisdom AI", "App Radar", "Mixpanel", "UXCam", "Sensor Tower"];

const features: { name: string; statuses: Status[] }[] = [
  { name: "No SDK Required", statuses: ["yes", "yes", "no", "no", "yes"] },
  { name: "AI-Powered Analysis", statuses: ["yes", "partial", "no", "no", "no"] },
  { name: "ASO & Keyword Tracking", statuses: ["yes", "yes", "no", "no", "yes"] },
  { name: "Review Sentiment Analysis", statuses: ["yes", "partial", "no", "no", "partial"] },
  { name: "Competitor Benchmarking", statuses: ["yes", "yes", "no", "no", "yes"] },
  { name: "UX & UI Scoring", statuses: ["yes", "no", "no", "yes", "no"] },
  { name: "Growth Plan Generator", statuses: ["yes", "no", "no", "no", "no"] },
  { name: "Monetization Optimizer", statuses: ["yes", "no", "no", "no", "partial"] },
  { name: "Affordable Pricing", statuses: ["yes", "no", "partial", "no", "no"] },
];

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "yes") return <Check className="w-4 h-4 text-accent mx-auto" />;
  if (status === "no") return <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />;
  return <Minus className="w-4 h-4 text-muted-foreground/50 mx-auto" />;
};

export const ComparisonSection = () => {
  return (
    <section className="py-24 relative" id="comparison">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">Comparison</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Why choose
            <br />
            <span className="font-serif italic font-normal">Mobile Wisdom AI</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-x-auto max-w-5xl mx-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Feature</th>
                {tools.map((tool, i) => (
                  <th key={tool} className={`py-4 px-3 text-sm font-semibold text-center ${i === 0 ? "text-accent" : "text-foreground"}`}>
                    {tool}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={feature.name} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-secondary/30" : ""}`}>
                  <td className="py-3 px-3 text-sm">{feature.name}</td>
                  {feature.statuses.map((status, j) => (
                    <td key={j} className={`py-3 px-3 ${j === 0 ? "bg-accent/5" : ""}`}>
                      <StatusIcon status={status} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};
