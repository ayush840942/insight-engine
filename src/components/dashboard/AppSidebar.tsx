import {
  LayoutDashboard,
  Search,
  Users,
  MessageSquareText,
  DollarSign,
  Rocket,
  FileText,
  Settings,
  LogOut,
  Crown,
  Lock,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import { FEATURE_ACCESS } from "@/components/PlanGate";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, feature: null },
  { title: "Analyze App", url: "/dashboard/analyze", icon: Search, feature: "analyze" },
  { title: "Reviews", url: "/dashboard/reviews", icon: MessageSquareText, feature: "reviews" },
  { title: "Competitors", url: "/dashboard/competitors", icon: Users, feature: "competitors" },
  { title: "Monetization", url: "/dashboard/monetization", icon: DollarSign, feature: "monetization" },
  { title: "Growth Plan", url: "/dashboard/growth", icon: Rocket, feature: "growth" },
  { title: "Reports", url: "/dashboard/reports", icon: FileText, feature: "reports" },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, feature: null },
  { title: "Upgrade", url: "/dashboard/upgrade", icon: Crown, feature: null },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { plan } = useCredits();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isLocked = (feature: string | null) => {
    if (!feature) return false;
    const allowed = FEATURE_ACCESS[feature];
    if (!allowed) return false;
    return !allowed.includes(plan);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xs">MW</span>
          </div>
          {!collapsed && <span className="font-semibold text-sm">Mobile Wisdom AI</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const locked = isLocked(item.feature);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`hover:bg-secondary ${locked ? "opacity-50" : ""}`}
                        activeClassName="bg-secondary text-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && (
                          <span className="flex items-center gap-2">
                            {item.title}
                            {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
