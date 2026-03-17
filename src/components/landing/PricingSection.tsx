import { motion } from "framer-motion";
import { Check, X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/hooks/use-currency";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    tagline: "For explorers",
    features: ["5 analyses / month", "AI scores & overview", "Basic ASO score", "Store listing tips", "App Roast Mode 🔥"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For indie developers",
    features: ["25 analyses / month", "Everything in Free", "Competitor intelligence", "Growth plan generator", "Feature gap analysis", "Review sentiment AI", "Priority email support"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    tagline: "For growth teams",
    features: ["100 analyses / month", "Everything in Starter", "Deep competitor analysis", "Monetization optimizer", "Revenue forecasting", "Keyword intelligence", "Export reports (PDF)", "API access"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For agencies & studios",
    features: ["500 analyses / month", "Everything in Pro", "White-label reports", "Team collaboration", "Custom integrations", "Bulk app analysis", "Dedicated account manager", "SLA & onboarding"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

type FeatureValue = true | false | "limited" | string;

const comparisonCategories: {
  category: string;
  features: { name: string; free: FeatureValue; starter: FeatureValue; pro: FeatureValue; agency: FeatureValue }[];
}[] = [
  {
    category: "Analysis & Insights",
    features: [
      { name: "Monthly analyses", free: "5", starter: "25", pro: "100", agency: "500" },
      { name: "AI-powered app scoring", free: true, starter: true, pro: true, agency: true },
      { name: "ASO score & basic keywords", free: true, starter: true, pro: true, agency: true },
      { name: "Store listing optimization", free: true, starter: true, pro: true, agency: true },
      { name: "Keyword intelligence & difficulty", free: false, starter: "limited", pro: true, agency: true },
      { name: "App Roast Mode 🔥", free: true, starter: true, pro: true, agency: true },
    ],
  },
  {
    category: "Competitor & Market",
    features: [
      { name: "Competitor benchmarking", free: false, starter: true, pro: true, agency: true },
      { name: "Feature gap analysis", free: false, starter: true, pro: true, agency: true },
      { name: "Deep competitor deep-dive", free: false, starter: false, pro: true, agency: true },
      { name: "Market trend insights", free: false, starter: false, pro: true, agency: true },
    ],
  },
  {
    category: "Reviews & Sentiment",
    features: [
      { name: "Review intelligence", free: true, starter: true, pro: true, agency: true },
      { name: "Sentiment analysis", free: "limited", starter: true, pro: true, agency: true },
      { name: "Review reply suggestions", free: false, starter: true, pro: true, agency: true },
    ],
  },
  {
    category: "Growth & Monetization",
    features: [
      { name: "Growth plan generator", free: false, starter: true, pro: true, agency: true },
      { name: "Monetization optimizer", free: false, starter: false, pro: true, agency: true },
      { name: "Revenue forecasting", free: false, starter: false, pro: true, agency: true },
    ],
  },
  {
    category: "Export & Integrations",
    features: [
      { name: "Export reports as PDF", free: false, starter: false, pro: true, agency: true },
      { name: "API access", free: false, starter: false, pro: true, agency: true },
      { name: "White-label reports", free: false, starter: false, pro: false, agency: true },
      { name: "Custom integrations", free: false, starter: false, pro: false, agency: true },
      { name: "Bulk app analysis", free: false, starter: false, pro: false, agency: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Community support", free: true, starter: true, pro: true, agency: true },
      { name: "Email support", free: true, starter: true, pro: true, agency: true },
      { name: "Priority support", free: false, starter: true, pro: true, agency: true },
      { name: "Dedicated account manager", free: false, starter: false, pro: false, agency: true },
      { name: "SLA & onboarding", free: false, starter: false, pro: false, agency: true },
    ],
  },
];

const CellValue = ({ value }: { value: FeatureValue }) => {
  if (value === true) return <Check className="w-4 h-4 text-accent mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/25 mx-auto" />;
  if (value === "limited") return <span className="text-xs text-muted-foreground font-medium">Limited</span>;
  return <span className="text-sm font-semibold text-foreground">{value}</span>;
};

export const PricingSection = () => {
  const navigate = useNavigate();
  const { getPrice, loading: currencyLoading } = useCurrency();
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="py-24 relative" id="pricing">
      <div className="container px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plans for every
            <br />
            <span className="font-serif italic font-normal">stage of growth</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Start free with 5 analyses per month. Scale as you grow — no hidden fees.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary bg-primary text-primary-foreground shadow-elevated scale-[1.02]"
                  : "border-border bg-card hover:shadow-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-lg font-bold ${plan.highlighted ? "" : ""}`}>{plan.name}</h3>
                <p className={`text-sm mt-0.5 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.tagline}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  {currencyLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight">{getPrice(plan.id)}</span>
                      {plan.id !== "free" && (
                        <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>/mo</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                    <span className={plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate("/auth")}
                className={`w-full rounded-full h-11 font-semibold ${
                  plan.highlighted
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Toggle comparison */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            {showComparison ? "Hide" : "Compare all"} features in detail
          </button>
        </div>

        {/* Feature comparison table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-12 max-w-5xl mx-auto overflow-x-auto"
          >
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-3 font-medium text-muted-foreground w-[40%]">Feature</th>
                  {["Free", "Starter", "Pro", "Agency"].map((name, i) => (
                    <th key={name} className={`py-4 px-3 text-center font-semibold ${i === 2 ? "text-accent" : "text-foreground"}`}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((cat) => (
                  <>
                    <tr key={cat.category}>
                      <td colSpan={5} className="pt-6 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.features.map((f, fi) => (
                      <tr key={f.name} className={`border-b border-border/40 ${fi % 2 === 0 ? "bg-secondary/20" : ""}`}>
                        <td className="py-2.5 px-3 text-foreground">{f.name}</td>
                        <td className="py-2.5 px-3 text-center"><CellValue value={f.free} /></td>
                        <td className="py-2.5 px-3 text-center"><CellValue value={f.starter} /></td>
                        <td className="py-2.5 px-3 text-center bg-accent/5"><CellValue value={f.pro} /></td>
                        <td className="py-2.5 px-3 text-center"><CellValue value={f.agency} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </section>
  );
};
