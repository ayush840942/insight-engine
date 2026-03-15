import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLANS: Record<string, { amount: number; credits: number; name: string }> = {
  starter: { amount: 1200, credits: 25, name: "Starter" },    // ₹1200 / ~$12
  pro: { amount: 2900, credits: 100, name: "Pro" },           // ₹2900 / ~$29
  agency: { amount: 7900, credits: 500, name: "Agency" },     // ₹7900 / ~$79
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, action } = await req.json();

    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured");
    }

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    if (action === "create_order") {
      const planData = PLANS[plan];
      if (!planData) {
        return new Response(JSON.stringify({ error: "Invalid plan" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create Razorpay order
      const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: planData.amount * 100, // in paise
          currency: "INR",
          receipt: `${userId}_${plan}_${Date.now()}`,
          notes: { user_id: userId, plan },
        }),
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        console.error("Razorpay order error:", errText);
        throw new Error("Failed to create Razorpay order");
      }

      const order = await orderRes.json();

      return new Response(
        JSON.stringify({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          key_id: RAZORPAY_KEY_ID,
          plan_name: planData.name,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify_payment") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));

      // Verify signature using HMAC SHA256
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(RAZORPAY_KEY_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const data = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
      const signatureBytes = await crypto.subtle.sign("HMAC", key, data);
      const expectedSignature = Array.from(new Uint8Array(signatureBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedSignature !== razorpay_signature) {
        return new Response(JSON.stringify({ error: "Invalid payment signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const planData = PLANS[plan];
      if (!planData) {
        return new Response(JSON.stringify({ error: "Invalid plan" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update user profile with service role
      const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { error: updateError } = await serviceClient
        .from("profiles")
        .update({
          subscription_plan: plan,
          credits_remaining: planData.credits,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error("Failed to update subscription");
      }

      return new Response(
        JSON.stringify({ success: true, plan: planData.name, credits: planData.credits }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("razorpay-order error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
