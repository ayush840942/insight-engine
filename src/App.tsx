import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AnalyzeApp from "./pages/AnalyzeApp";
import Reports from "./pages/Reports";
import ReviewsPage from "./pages/ReviewsPage";
import CompetitorsPage from "./pages/CompetitorsPage";
import MonetizationPage from "./pages/MonetizationPage";
import GrowthPage from "./pages/GrowthPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analyze" element={<AnalyzeApp />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="competitors" element={<CompetitorsPage />} />
            <Route path="monetization" element={<MonetizationPage />} />
            <Route path="growth" element={<GrowthPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
