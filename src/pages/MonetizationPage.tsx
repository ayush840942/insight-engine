import { DollarSign } from "lucide-react";

const MonetizationPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold font-display">Monetization Analyzer</h1>
      <p className="text-muted-foreground mt-1">Optimize your revenue strategy</p>
    </div>
    <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
      <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">Analyze an app first to see monetization insights here.</p>
    </div>
  </div>
);

export default MonetizationPage;
