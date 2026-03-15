import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We replaced App Radar and Sensor Tower with Mobile Wisdom AI. The AI insights are way more actionable — and it's 10x cheaper.",
    author: "Rahul M.",
    role: "Indie App Developer",
    rating: 5,
  },
  {
    quote: "The competitor intelligence feature found gaps we never noticed. We shipped 3 features and our ratings jumped from 3.8 to 4.5.",
    author: "Sarah L.",
    role: "Product Manager, FinTech Startup",
    rating: 5,
  },
  {
    quote: "App Roast Mode is savage but honest. It pointed out UX issues our team had been blind to for months. Fixed them all in a sprint.",
    author: "Kunal D.",
    role: "CTO, Social App",
    rating: 5,
  },
  {
    quote: "The monetization optimizer suggested switching from ads to freemium. Revenue went up 40% in the first month.",
    author: "Jessica T.",
    role: "Founder, Health & Fitness App",
    rating: 5,
  },
  {
    quote: "I use the 30-day growth plan every month. It's like having a growth advisor on demand. Best ₹2,900 I spend.",
    author: "Amit P.",
    role: "Growth Lead, EdTech",
    rating: 5,
  },
  {
    quote: "No SDK to integrate, no complex setup. Just paste the URL and get an instant audit. Perfect for our agency workflow.",
    author: "Lisa W.",
    role: "Agency Owner",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative" id="testimonials">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Loved by <span className="text-gradient">App Teams</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Developers, product managers, and growth teams trust Mobile Wisdom AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/20 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-4 text-sm">"{t.quote}"</p>
              <div>
                <p className="font-semibold font-display text-sm">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
