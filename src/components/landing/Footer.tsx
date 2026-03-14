import { Zap } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-display font-bold">Mobile Wisdom AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mobile Wisdom AI. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
