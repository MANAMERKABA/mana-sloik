// supabase/functions/event-delete/index.ts
//
// MANA — Faza A (z5.A) — kafel EVENT (Horyzont prywatny, [602])
// Hard delete eventu po id.
//
// REQUEST body (JSON):
//   - id (req): string UUID — który event usunąć
//
// RESPONSE:
//   200 + { ok: true, deleted: { id: "..." } }
//   400 + { ok: false, error: "..." }   walidacja
//   404 + { ok: false, error: "..." }   event nie istnieje
//   405 + { ok: false, error: "..." }   metoda
//   500 + { ok: false, error: "..." }   server / baza

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Metoda niedozwolona, użyj POST" });
  }

  try {
    const body = await req.json();
    const { id } = body;

    // --- Walidacja id ---
    if (typeof id !== "string" || !UUID_REGEX.test(id)) {
      return jsonResponse(400, { ok: false, error: "id wymagany (UUID string)" });
    }

    // --- Supabase client ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- DELETE + SELECT zwrotny (żeby wykryć "nie ma takiego id") ---
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return jsonResponse(404, { ok: false, error: `Event o id=${id} nie istnieje` });
      }
      console.error("event-delete DELETE error:", error);
      return jsonResponse(500, { ok: false, error: `Błąd bazy: ${error.message}` });
    }

    return jsonResponse(200, { ok: true, deleted: { id: data.id } });
  } catch (err) {
    console.error("event-delete unexpected error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse(500, { ok: false, error: `Nieoczekiwany błąd: ${msg}` });
  }
});
