import { Zap } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Comparison", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container px-6">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">Mobile Wisdom AI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered mobile app analytics platform. Analyze, optimize, and grow your app with actionable insights.
          </p>
        </div>
        <div>
          <h4 className="font-semibold font-display mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold font-display mb-3 text-sm">Contact</h4>
          <p className="text-sm text-muted-foreground">support@mobilewisdom.ai</p>
          <p className="text-sm text-muted-foreground mt-1">Built with ❤️ for app developers</p>
        </div>
      </div>
      <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mobile Wisdom AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);
