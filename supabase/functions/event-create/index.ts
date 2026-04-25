// supabase/functions/event-create/index.ts
//
// MANA — Faza A (z5.A) — kafel EVENT (Horyzont prywatny, [602])
// Tworzenie nowego eventu w tabeli `events`.
//
// Format daty: ISO 8601 z UTC offset, np. "2026-04-25T18:00:00+02:00"
// Europe/Warsaw: +02:00 (CEST, lato), +01:00 (CET, zima)
//
// REQUEST body (JSON):
//   - traveler_id (req): number — bigint FK travels(id)
//   - tytul (req):       string — niepusty
//   - data_czas (req):   string — ISO 8601
//   - opis:              string  | default null
//   - czas_trwania_min:  number  | default 60 (minuty)
//   - kraina:            string  | default 'horyzont'  (horyzont|business|shared)
//   - lokalizacja:       string  | default null
//   - przypomnienie_min_przed: number | default null (minuty przed)
//
// RESPONSE:
//   201 + { ok: true, event: {...} }
//   400 + { ok: false, error: "..." }
//   405 + { ok: false, error: "..." }
//   500 + { ok: false, error: "..." }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const KRAINY_DOPUSZCZALNE = ["horyzont", "business", "shared"];

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
    const {
      traveler_id,
      tytul,
      data_czas,
      opis = null,
      czas_trwania_min = 60,
      kraina = "horyzont",
      lokalizacja = null,
      przypomnienie_min_przed = null,
    } = body;

    // --- Walidacja required ---
    if (typeof traveler_id !== "number" || !Number.isFinite(traveler_id)) {
      return jsonResponse(400, { ok: false, error: "traveler_id wymagany (number, bigint)" });
    }
    if (typeof tytul !== "string" || tytul.trim() === "") {
      return jsonResponse(400, { ok: false, error: "tytul wymagany (niepusty string)" });
    }
    if (typeof data_czas !== "string") {
      return jsonResponse(400, { ok: false, error: "data_czas wymagany (ISO 8601 z UTC offset)" });
    }
    if (isNaN(new Date(data_czas).getTime())) {
      return jsonResponse(400, { ok: false, error: "data_czas nie jest poprawną datą ISO 8601" });
    }

    // --- Walidacja optional ---
    if (typeof czas_trwania_min !== "number" || czas_trwania_min <= 0) {
      return jsonResponse(400, { ok: false, error: "czas_trwania_min musi być dodatnim numberem (minuty)" });
    }
    if (!KRAINY_DOPUSZCZALNE.includes(kraina)) {
      return jsonResponse(400, { ok: false, error: `kraina musi być jedną z: ${KRAINY_DOPUSZCZALNE.join(", ")}` });
    }
    if (przypomnienie_min_przed !== null && (typeof przypomnienie_min_przed !== "number" || przypomnienie_min_przed < 0)) {
      return jsonResponse(400, { ok: false, error: "przypomnienie_min_przed musi być nieujemnym numberem (minuty) lub null" });
    }

    // --- Supabase client (service_role bypass RLS, dla MVP RLS = anon_all i tak) ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- INSERT + SELECT zwrotny ---
    const { data, error } = await supabase
      .from("events")
      .insert({
        traveler_id,
        tytul: tytul.trim(),
        data_czas,
        opis,
        czas_trwania_min,
        kraina,
        lokalizacja,
        przypomnienie_min_przed,
      })
      .select()
      .single();

    if (error) {
      console.error("event-create INSERT error:", error);
      return jsonResponse(500, { ok: false, error: `Błąd bazy: ${error.message}` });
    }

    return jsonResponse(201, { ok: true, event: data });
  } catch (err) {
    console.error("event-create unexpected error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse(500, { ok: false, error: `Nieoczekiwany błąd: ${msg}` });
  }
});
