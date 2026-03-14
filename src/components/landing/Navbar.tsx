import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold font-display">Mobile Wisdom AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log In</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90">Get Started</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-border px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Pricing</a>
          <Link to="/auth" className="block">
            <Button className="w-full bg-gradient-primary text-primary-foreground rounded-lg">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
