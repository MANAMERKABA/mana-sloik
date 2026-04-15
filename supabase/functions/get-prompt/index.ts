import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data } = await supabase
    .from("prompts")
    .select("tresc")
    .eq("nazwa", "serce_konstytucja")
    .single()

  return new Response(JSON.stringify({ prompt: data?.tresc || "" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
})
