import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appId, appName, description } = await req.json();
    if (!appId) {
      return new Response(JSON.stringify({ error: "appId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a mobile app competitive intelligence analyst. Analyze the given app and identify its top competitors. Return ONLY valid JSON:
{
  "app_name": "string",
  "competitors": [
    {
      "name": "string",
      "app_id": "string",
      "category": "string",
      "estimated_rating": number,
      "estimated_installs": "string",
      "key_features": ["f1","f2","f3"],
      "advantage_over_target": "string",
      "weakness_vs_target": "string"
    }
  ],
  "feature_gap_analysis": [
    { "feature": "string", "your_app": "has|missing|weak", "competitors": "common|rare|unique" }
  ],
  "competitive_position": "string (2-3 sentences about market position)",
  "recommendations": ["rec1","rec2","rec3"]
}`,
          },
          {
            role: "user",
            content: `Analyze competitors for this app:
App ID: ${appId}
App Name: ${appName || appId}
Description: ${description || "Mobile application"}

Identify 4-6 real competitors with realistic data.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse failed" };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-competitors error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
