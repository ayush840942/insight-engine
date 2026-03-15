import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="container relative z-10 px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground tracking-wide uppercase mb-6"
          >
            AI-Powered App Intelligence
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]">
            Understand why your
            <br />
            <span className="font-serif italic font-normal">app isn't growing</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI analyzes your mobile app and gives actionable insights to increase downloads, retention, and revenue.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Paste Google Play Store URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-13 pl-5 pr-4 bg-card border-border text-foreground placeholder:text-muted-foreground text-base rounded-full"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="h-13 px-8 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                Analyze My App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Example: https://play.google.com/store/apps/details?id=com.instagram.android
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground mt-16"
          >
            Trusted by 2,500+ app developers and growth teams
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
