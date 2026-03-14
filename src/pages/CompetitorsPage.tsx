import { Users } from "lucide-react";

const CompetitorsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold font-display">Competitor Intelligence</h1>
      <p className="text-muted-foreground mt-1">Compare your app with competitors</p>
    </div>
    <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
      <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">Analyze an app first to see competitor analysis here.</p>
    </div>
  </div>
);

export default CompetitorsPage;
