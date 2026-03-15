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
            content: `You are a mobile app monetization expert. Analyze the given app's monetization strategy. Return ONLY valid JSON:
{
  "app_name": "string",
  "current_model": {
    "type": "freemium|subscription|ads|in-app-purchases|paid|hybrid",
    "detected_revenue_streams": ["stream1","stream2"],
    "estimated_monthly_revenue": "string",
    "pricing_details": "string"
  },
  "monetization_score": number (0-100),
  "strengths": ["s1","s2","s3"],
  "weaknesses": ["w1","w2","w3"],
  "optimization_opportunities": [
    { "strategy": "string", "potential_impact": "high|medium|low", "effort": "high|medium|low", "description": "string" }
  ],
  "competitor_pricing": [
    { "competitor": "string", "model": "string", "price_range": "string" }
  ],
  "revenue_forecast": {
    "current_estimate": "string",
    "optimized_estimate": "string",
    "growth_potential": "string"
  },
  "recommendations": ["rec1","rec2","rec3","rec4","rec5"]
}`,
          },
          {
            role: "user",
            content: `Analyze monetization for:
App ID: ${appId}
App Name: ${appName || appId}
Description: ${description || "Mobile application"}

Provide detailed monetization analysis with revenue optimization strategies.`,
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
    console.error("analyze-monetization error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
