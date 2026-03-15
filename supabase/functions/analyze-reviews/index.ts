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
            content: `You are a mobile app review intelligence analyst. Analyze the given app and generate a realistic review intelligence report. Return ONLY valid JSON:
{
  "app_name": "string",
  "overall_sentiment": { "positive": number, "neutral": number, "negative": number },
  "top_complaints": [
    { "category": "string", "count": number, "severity": "high|medium|low", "example_review": "string" }
  ],
  "top_praises": [
    { "category": "string", "count": number, "example_review": "string" }
  ],
  "feature_requests": [
    { "feature": "string", "demand_level": "high|medium|low", "example_review": "string" }
  ],
  "sentiment_trend": "improving|stable|declining",
  "key_insights": ["insight1","insight2","insight3"],
  "action_items": ["action1","action2","action3"]
}`,
          },
          {
            role: "user",
            content: `Generate review intelligence for:
App ID: ${appId}
App Name: ${appName || appId}
Description: ${description || "Mobile application"}

Provide realistic review analysis with actionable insights.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited." }), {
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
    console.error("analyze-reviews error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
