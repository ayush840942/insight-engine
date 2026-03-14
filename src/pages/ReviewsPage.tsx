import { FileText } from "lucide-react";

const ReviewsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold font-display">Review Intelligence</h1>
      <p className="text-muted-foreground mt-1">AI-powered analysis of user reviews</p>
    </div>
    <div className="text-center py-16 rounded-2xl bg-gradient-card border border-border">
      <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">Analyze an app first to see review intelligence here.</p>
    </div>
  </div>
);

export default ReviewsPage;
