import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-card border border-primary/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative z-10">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Stop Guessing. Start <span className="text-gradient">Growing.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who use AI-powered insights to outrank competitors, increase downloads, and boost revenue.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="h-14 px-10 bg-gradient-primary text-primary-foreground font-semibold rounded-xl glow hover:opacity-90"
            >
              Analyze Your App Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">No credit card required • 1 free analysis</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
