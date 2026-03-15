import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Crown } from "lucide-react";

const SettingsPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setProfile(data);
        setName(data.name || "");
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    const { error } = await supabase.from("profiles").update({ name }).eq("id", profile.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated." });
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account</p>
      </div>

      {/* Plan Card */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold font-display flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="capitalize">{profile?.subscription_plan || "free"}</span> Plan
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.credits_remaining ?? 0} analyses remaining this month
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/upgrade")}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl"
          >
            Upgrade
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-card border border-border space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input disabled value={profile?.email || ""} className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
        </div>
        <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
