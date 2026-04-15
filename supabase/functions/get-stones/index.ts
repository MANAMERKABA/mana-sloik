import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const { traveler_id } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: stones } = await supabase
    .from("stones")
    .select("tresc, typ, due_date, created_at")
    .eq("traveler_id", traveler_id)
    .eq("status", "aktywny")
    .order("created_at", { ascending: false })
    .limit(20)

  if (!stones || stones.length === 0) {
    return new Response(JSON.stringify({ sloik: "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }

  const sloik = stones.map(s => {
    const due = s.due_date ? ` [kiedy: ${new Date(s.due_date).toLocaleString("pl-PL")}]` : ""
    return `[${s.typ}] ${s.tresc}${due}`
  }).join("\n")

  return new Response(JSON.stringify({ sloik }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
})
