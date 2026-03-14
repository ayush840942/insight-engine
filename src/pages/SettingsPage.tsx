import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const { toast } = useToast();

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
      <div className="p-6 rounded-2xl bg-gradient-card border border-border space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input disabled value={profile?.email || ""} className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label>Plan</Label>
          <Input disabled value={profile?.subscription_plan || "free"} className="bg-secondary border-border capitalize" />
        </div>
        <div className="space-y-2">
          <Label>Credits Remaining</Label>
          <Input disabled value={profile?.credits_remaining?.toString() || "0"} className="bg-secondary border-border" />
        </div>
        <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
