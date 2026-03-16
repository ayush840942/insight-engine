import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { appId, url } = await req.json();
    if (!appId) {
      return new Response(JSON.stringify({ error: "appId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id || null;
    }

    console.log("Fetching app data for:", appId);
    let appData: any = {};
    
    try {
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=us`;
      const response = await fetch(playStoreUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      const html = await response.text();
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const appName = titleMatch ? titleMatch[1].replace(" - Apps on Google Play", "").trim() : appId;
      const descMatch = html.match(/itemprop="description"[^>]*>([^<]{0,500})/);
      const description = descMatch ? descMatch[1].trim() : "Mobile application";

      appData = { appId, appName, description, url: playStoreUrl };
    } catch (fetchError) {
      console.error("Failed to fetch Play Store data:", fetchError);
      appData = {
        appId,
        appName: appId.split(".").pop() || appId,
        description: "Mobile application",
        url: url || "",
      };
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert mobile app analyst specializing in ASO (App Store Optimization), user experience, and growth strategy. Analyze the following app and provide a comprehensive report.
    
    Return ONLY valid JSON with this exact structure:
    {
      "app_name": "string",
      "summary": "2-3 sentence summary of the app's current state",
      "ux_score": number (0-100),
      "retention_score": number (0-100),
      "monetization_score": number (0-100),
      "growth_score": number (0-100),
      "aso_score": number (0-100, overall ASO health score),
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2", "weakness3"],
      "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],
      "keyword_suggestions": [
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)},
        {"keyword": "string", "difficulty": "low|medium|high", "volume": "low|medium|high", "relevance": number (0-100)}
      ],
      "store_listing_tips": {
        "title_suggestion": "optimized title suggestion",
        "short_description": "optimized short description (80 chars max)",
        "icon_feedback": "feedback on icon design",
        "screenshot_tips": ["tip1", "tip2", "tip3"]
      },
      "category_ranking_estimate": "string (e.g. Top 50 in Category)",
      "conversion_rate_estimate": "string (e.g. 25-35%)",
      "roast": "A brutally honest 2-3 sentence critique of the app"
    }`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this mobile app thoroughly:
App ID: ${appData.appId}
App Name: ${appData.appName}
Description: ${appData.description}
Play Store URL: ${appData.url}

Provide a thorough analysis with realistic scores, ASO keyword suggestions with difficulty/volume estimates, and store listing optimization tips. Be specific and actionable.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    let analysis: any;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    if (userId) {
      const { data: appRecord, error: appError } = await supabase
        .from("apps")
        .insert({
          user_id: userId,
          app_id: appId,
          app_name: analysis.app_name || appData.appName,
          description: appData.description,
          raw_data: appData,
        })
        .select()
        .single();

      if (appRecord && !appError) {
        await supabase.from("reports").insert({
          app_id: appRecord.id,
          user_id: userId,
          ux_score: analysis.ux_score,
          retention_score: analysis.retention_score,
          monetization_score: analysis.monetization_score,
          growth_score: analysis.growth_score,
          analysis_json: analysis,
        });
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-app error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
