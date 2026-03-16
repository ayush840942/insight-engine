import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Get started",
    credits: 5,
    features: ["5 analyses per month", "AI scores & report", "ASO score & keywords", "Store listing tips", "Review intelligence", "App Roast Mode 🔥", "Email support"],
    highlighted: false,
    icon: Zap,
  },
  {
    id: "starter",
    name: "Starter",
    description: "For indie developers",
    credits: 25,
    features: ["25 analyses per month", "All Free features", "Competitor intelligence", "Growth plan generator", "Feature gap analysis", "Priority support"],
    highlighted: false,
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growth teams",
    credits: 100,
    features: ["100 analyses per month", "All Starter features", "Deep competitor analysis", "Monetization optimizer", "Revenue forecasting", "Export reports as PDF", "API access"],
    highlighted: true,
    icon: Crown,
  },
  {
    id: "agency",
    name: "Agency",
    description: "For agencies & teams",
    credits: 500,
    features: ["500 analyses per month", "All Pro features", "White-label reports", "Team collaboration", "Custom integrations", "Bulk app analysis", "Dedicated account manager"],
    highlighted: false,
    icon: Shield,
  },
];

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
            toast({ title: "Upgrade Successful! 🎉", description: `You're now on the ${verifyData.plan} plan with ${verifyData.credits} credits.` });
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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Upgrade Your Plan</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          You're on the <span className="text-foreground font-semibold capitalize">{currentPlan}</span> plan
          with <span className="text-foreground font-semibold">{credits}</span> credits remaining.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-elevated"
                  : "border-border bg-card hover:shadow-card"
              } ${isCurrent ? "ring-2 ring-accent/30" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">
                  Current Plan
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  {currencyLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className="text-3xl font-bold">{getPrice(plan.id)}</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-accent mt-1 font-medium">{plan.credits} analyses/month</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || plan.id === "free" || loading === plan.id}
                className={`w-full rounded-full ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
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
                  "Upgrade Now"
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePage;
