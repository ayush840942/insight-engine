import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (url.trim()) {
      navigate(`/dashboard/analyze?url=${encodeURIComponent(url.trim())}`);
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <div className="container relative z-10 px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered App Intelligence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 leading-[1.1]">
            Understand Why Your
            <br />
            <span className="text-gradient">App Is Not Growing</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            AI analyzes your mobile app and gives actionable insights to increase downloads, retention, and revenue.
          </p>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="url"
                  placeholder="Paste Google Play Store URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 pl-5 pr-4 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-base rounded-xl"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="h-14 px-8 bg-gradient-primary text-primary-foreground font-semibold rounded-xl glow hover:opacity-90 transition-opacity"
              >
                Analyze My App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Example: https://play.google.com/store/apps/details?id=com.instagram.android
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-10 mt-16"
          >
            {[
              { value: "10,000+", label: "Apps Analyzed" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "2,500+", label: "Developers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold font-display text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
