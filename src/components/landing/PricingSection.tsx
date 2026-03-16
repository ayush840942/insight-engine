import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/hooks/use-currency";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Get started for free",
    features: [
      "5 analyses per month",
      "AI scores & report",
      "ASO score & keywords",
      "Store listing tips",
      "Review intelligence",
      "App Roast Mode 🔥",
      "Email support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    description: "For indie developers",
    features: [
      "25 analyses/month",
      "All Free features",
      "Competitor intelligence",
      "Growth plan generator",
      "Feature gap analysis",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growth teams",
    features: [
      "100 analyses/month",
      "All Starter features",
      "Deep competitor analysis",
      "Monetization optimizer",
      "Revenue forecasting",
      "Export reports as PDF",
      "API access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    description: "For agencies & teams",
    features: [
      "500 analyses/month",
      "All Pro features",
      "White-label reports",
      "Team collaboration",
      "Custom integrations",
      "Bulk app analysis",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const PricingSection = () => {
  const navigate = useNavigate();
  const { getPrice, loading: currencyLoading } = useCurrency();

  return (
    <section className="py-24 relative" id="pricing">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, transparent
            <br />
            <span className="font-serif italic font-normal">pricing</span>
          </h2>
          <p className="text-muted-foreground mt-4">Start free with 5 analyses. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-elevated"
                  : "border-border bg-card hover:shadow-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  {currencyLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className="text-4xl font-bold">{getPrice(plan.id)}</span>
                      <span className="text-muted-foreground">/month</span>
                    </>
                  )}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/auth")}
                className={`w-full rounded-full ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
