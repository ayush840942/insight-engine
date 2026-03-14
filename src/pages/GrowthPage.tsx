import { Rocket } from "lucide-react";

const GrowthPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold font-display">Growth Plan</h1>
      <p className="text-muted-foreground mt-1">AI-generated 30-day improvement roadmap</p>
    </div>
    <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
      <Rocket className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">Analyze an app first to see your growth plan here.</p>
    </div>
  </div>
);

export default GrowthPage;
