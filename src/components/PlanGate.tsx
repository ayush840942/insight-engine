import { useCredits } from "@/hooks/use-credits";
import { useNavigate } from "react-router-dom";
import { Lock, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Define which plans can access which features
const FEATURE_ACCESS: Record<string, string[]> = {
  analyze: ["free", "starter", "pro", "agency"],
  reports: ["free", "starter", "pro", "agency"],
  reviews: ["starter", "pro", "agency"],
  competitors: ["starter", "pro", "agency"],
  monetization: ["pro", "agency"],
  growth: ["pro", "agency"],
};

// Minimum plan required for each feature
const MIN_PLAN: Record<string, string> = {
  reviews: "Starter",
  competitors: "Starter",
  monetization: "Pro",
  growth: "Pro",
};

interface PlanGateProps {
  feature: keyof typeof FEATURE_ACCESS;
  children: React.ReactNode;
}

export const PlanGate = ({ feature, children }: PlanGateProps) => {
  const { plan, loading } = useCredits();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const allowedPlans = FEATURE_ACCESS[feature] || [];
  const hasAccess = allowedPlans.includes(plan);

  if (!hasAccess) {
    const minPlan = MIN_PLAN[feature] || "Starter";
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 rounded-2xl bg-gradient-card border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-display mb-3">
              {minPlan}+ Feature
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              This feature requires the <strong className="text-primary">{minPlan}</strong> plan or higher.
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              You're currently on the <strong className="capitalize">{plan}</strong> plan.
              Upgrade to unlock this and other premium features.
            </p>
            <Button
              onClick={() => navigate("/dashboard/upgrade")}
              className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 px-8 h-12"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to {minPlan}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export { FEATURE_ACCESS, MIN_PLAN };
