import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
          className="relative max-w-3xl mx-auto text-center p-16 rounded-3xl bg-primary text-primary-foreground overflow-hidden"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Stop guessing.
            <br />
            <span className="font-serif italic font-normal">Start growing.</span>
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of developers who use AI-powered insights to outrank competitors and boost revenue.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="h-13 px-10 bg-primary-foreground text-primary font-medium rounded-full hover:bg-primary-foreground/90"
          >
            Analyze Your App Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm text-primary-foreground/50 mt-4">No credit card required • 1 free analysis</p>
        </motion.div>
      </div>
    </section>
  );
};
