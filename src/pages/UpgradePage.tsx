import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Loader2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "free",
    name: "Free",
    tagline: "For explorers",
    credits: 5,
    highlights: ["5 analyses / month", "AI scores & overview", "Basic ASO score", "Store listing tips", "App Roast Mode 🔥"],
    icon: Zap,
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For indie developers",
    credits: 25,
    highlights: ["25 analyses / month", "Competitor intelligence", "Growth plan generator", "Feature gap analysis", "Review sentiment AI", "Priority support"],
    icon: Zap,
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growth teams",
    credits: 100,
    badge: "Most Popular",
    highlights: ["100 analyses / month", "Deep competitor analysis", "Monetization optimizer", "Revenue forecasting", "Keyword intelligence", "Export PDF & API"],
    icon: Crown,
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For agencies & studios",
    credits: 500,
    highlights: ["500 analyses / month", "White-label reports", "Team collaboration", "Custom integrations", "Bulk analysis", "Dedicated manager & SLA"],
    icon: Shield,
    highlighted: false,
  },
];

type FVal = true | false | "limited" | string;

const comparisonData: { category: string; rows: { name: string; values: FVal[] }[] }[] = [
  {
    category: "Analysis & Insights",
    rows: [
      { name: "Monthly analyses", values: ["5", "25", "100", "500"] },
      { name: "AI-powered app scoring", values: [true, true, true, true] },
      { name: "ASO score & basic keywords", values: [true, true, true, true] },
      { name: "Store listing optimization", values: [true, true, true, true] },
      { name: "Keyword intelligence & difficulty", values: [false, "limited", true, true] },
      { name: "App Roast Mode 🔥", values: [true, true, true, true] },
    ],
  },
  {
    category: "Competitor & Market",
    rows: [
      { name: "Competitor benchmarking", values: [false, true, true, true] },
      { name: "Feature gap analysis", values: [false, true, true, true] },
      { name: "Deep competitor deep-dive", values: [false, false, true, true] },
      { name: "Market trend insights", values: [false, false, true, true] },
    ],
  },
  {
    category: "Reviews & Sentiment",
    rows: [
      { name: "Review intelligence", values: [true, true, true, true] },
      { name: "Sentiment analysis", values: ["limited", true, true, true] },
      { name: "Review reply suggestions", values: [false, true, true, true] },
    ],
  },
  {
    category: "Growth & Monetization",
    rows: [
      { name: "Growth plan generator", values: [false, true, true, true] },
      { name: "Monetization optimizer", values: [false, false, true, true] },
      { name: "Revenue forecasting", values: [false, false, true, true] },
    ],
  },
  {
    category: "Export & Integrations",
    rows: [
      { name: "Export reports as PDF", values: [false, false, true, true] },
      { name: "API access", values: [false, false, true, true] },
      { name: "White-label reports", values: [false, false, false, true] },
      { name: "Custom integrations", values: [false, false, false, true] },
      { name: "Bulk app analysis", values: [false, false, false, true] },
    ],
  },
  {
    category: "Support",
    rows: [
      { name: "Email support", values: [true, true, true, true] },
      { name: "Priority support", values: [false, true, true, true] },
      { name: "Dedicated account manager", values: [false, false, false, true] },
      { name: "SLA & onboarding", values: [false, false, false, true] },
    ],
  },
];

const CellIcon = ({ value }: { value: FVal }) => {
  if (value === true) return <Check className="w-4 h-4 text-accent mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/20 mx-auto" />;
  if (value === "limited") return <span className="text-xs text-muted-foreground font-medium">Limited</span>;
  return <span className="text-sm font-bold text-foreground">{value}</span>;
};

const UpgradePage = () => {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { currency, getPrice, loading: currencyLoading } = useCurrency();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("subscription_plan, credits_remaining")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setCurrentPlan(data.subscription_plan);
        setCredits(data.credits_remaining);
      }
    };
    fetchProfile();

    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free" || planId === currentPlan) return;
    setLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: { plan: planId, action: "create_order", currency: currency.code },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Mobile Wisdom AI",
        description: `${data.plan_name} Plan Subscription`,
        order_id: data.order_id,
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke("razorpay-order", {
              body: {
                plan: planId,
                action: "verify_payment",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            if (verifyError) throw verifyError;
            if (verifyData?.error) throw new Error(verifyData.error);
            setCurrentPlan(planId);
            setCredits(verifyData.credits);
            toast({ title: "Upgrade Successful! 🎉", description: `You're now on the ${verifyData.plan} plan.` });
          } catch (err: any) {
            toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
          }
        },
        theme: { color: "#1a1e24" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const planNames = ["Free", "Starter", "Pro", "Agency"];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Currently on <span className="text-foreground font-semibold capitalize">{currentPlan}</span> with{" "}
          <span className="text-accent font-semibold">{credits}</span> credits remaining
        </p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mx-auto w-fit">
          <TabsTrigger value="cards">Plans</TabsTrigger>
          <TabsTrigger value="compare">Compare Features</TabsTrigger>
        </TabsList>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {plans.map((plan, i) => {
              const isCurrent = plan.id === currentPlan;
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                    plan.highlighted
                      ? "border-primary bg-primary text-primary-foreground shadow-elevated"
                      : "border-border bg-card hover:shadow-card"
                  } ${isCurrent ? "ring-2 ring-accent" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      {plan.badge}
                    </div>
                  )}
                  {isCurrent && (
                    <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground text-xs">
                      Current
                    </Badge>
                  )}

                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                    </div>
                    <p className={`text-xs ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {plan.tagline}
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      {currencyLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="text-3xl font-extrabold">{getPrice(plan.id)}</span>
                          {plan.id !== "free" && (
                            <span className={`text-xs ${plan.highlighted ? "text-primary-foreground/50" : "text-muted-foreground"}`}>/mo</span>
                          )}
                        </>
                      )}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${plan.highlighted ? "text-accent" : "text-accent"}`}>
                      {plan.credits} analyses / month
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.highlights.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                        <span className={`text-xs ${plan.highlighted ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || plan.id === "free" || loading === plan.id}
                    className={`w-full rounded-full h-10 text-sm font-semibold ${
                      plan.highlighted
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : plan.id === "free" ? (
                      "Free Forever"
                    ) : (
                      <>Upgrade <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare">
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[40%]">Feature</th>
                  {planNames.map((name, i) => (
                    <th key={name} className={`py-3 px-3 text-center font-semibold ${i === 2 ? "text-accent bg-accent/5" : ""} ${name.toLowerCase() === currentPlan ? "underline underline-offset-4 decoration-accent" : ""}`}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((cat) => (
                  <>
                    <tr key={`cat-${cat.category}`}>
                      <td colSpan={5} className="pt-5 pb-1.5 px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row, ri) => (
                      <tr key={row.name} className={`border-b border-border/30 ${ri % 2 === 0 ? "bg-secondary/10" : ""}`}>
                        <td className="py-2.5 px-4 text-foreground/90">{row.name}</td>
                        {row.values.map((v, vi) => (
                          <td key={vi} className={`py-2.5 px-3 text-center ${vi === 2 ? "bg-accent/5" : ""}`}>
                            <CellIcon value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpgradePage;
