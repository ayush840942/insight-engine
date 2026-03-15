import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is Mobile Wisdom AI different from App Radar or Sensor Tower?",
    a: "Unlike traditional ASO tools, we use AI to analyze your entire app — reviews, competitors, UX, monetization, and store listing — then generate actionable growth plans. No SDK needed, instant results, and 10x more affordable.",
  },
  {
    q: "Do I need to integrate an SDK?",
    a: "No! Just paste your Google Play Store URL. We analyze publicly available data using AI. No code changes, no SDK setup, no privacy concerns.",
  },
  {
    q: "What data sources do you analyze?",
    a: "We analyze your app's store listing, screenshots, description, reviews, ratings, competitor apps, category trends, and more — all from public app store data.",
  },
  {
    q: "Can I analyze iOS apps too?",
    a: "Currently we support Google Play Store apps. Apple App Store support is coming soon.",
  },
  {
    q: "How accurate are the AI recommendations?",
    a: "Our AI is trained on patterns from thousands of successful apps. Users report an average 25% improvement in key metrics within 30 days of following our growth plans.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel anytime. No lock-in contracts. Your credits remain active until the end of your billing period.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative" id="faq">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Frequently asked
            <br />
            <span className="font-serif italic font-normal">questions</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
