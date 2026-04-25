// supabase/functions/event-update/index.ts
//
// MANA — Faza A (z5.A) — kafel EVENT (Horyzont prywatny, [602])
// Partial update istniejącego eventu.
//
// REQUEST body (JSON):
//   - id (req): string UUID — który event aktualizować
//   - dowolne pola do zmiany (przynajmniej jedno):
//     tytul, data_czas, opis, czas_trwania_min, kraina,
//     lokalizacja, przypomnienie_min_przed
//
// updated_at ustawia się automatycznie przez trigger w bazie.
//
// RESPONSE:
//   200 + { ok: true, event: {...} }
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

const KRAINY_DOPUSZCZALNE = ["horyzont", "business", "shared"];
const POLA_AKTUALIZOWALNE = [
  "tytul", "data_czas", "opis", "czas_trwania_min",
  "kraina", "lokalizacja", "przypomnienie_min_przed",
] as const;

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
    const { id, ...zmiany } = body;

    // --- Walidacja id ---
    if (typeof id !== "string" || !UUID_REGEX.test(id)) {
      return jsonResponse(400, { ok: false, error: "id wymagany (UUID string)" });
    }

    // --- Filtruj tylko dozwolone pola; reszta odrzucona ---
    const update: Record<string, unknown> = {};
    for (const klucz of POLA_AKTUALIZOWALNE) {
      if (klucz in zmiany) update[klucz] = zmiany[klucz];
    }

    if (Object.keys(update).length === 0) {
      return jsonResponse(400, {
        ok: false,
        error: `Brak pól do aktualizacji. Dozwolone: ${POLA_AKTUALIZOWALNE.join(", ")}`,
      });
    }

    // --- Walidacja per-pole (gdy obecne) ---
    if ("tytul" in update) {
      if (typeof update.tytul !== "string" || (update.tytul as string).trim() === "") {
        return jsonResponse(400, { ok: false, error: "tytul musi być niepustym stringiem" });
      }
      update.tytul = (update.tytul as string).trim();
    }
    if ("data_czas" in update) {
      if (typeof update.data_czas !== "string" || isNaN(new Date(update.data_czas as string).getTime())) {
        return jsonResponse(400, { ok: false, error: "data_czas musi być poprawną datą ISO 8601" });
      }
    }
    if ("opis" in update && update.opis !== null && typeof update.opis !== "string") {
      return jsonResponse(400, { ok: false, error: "opis musi być stringiem lub null" });
    }
    if ("czas_trwania_min" in update) {
      if (typeof update.czas_trwania_min !== "number" || (update.czas_trwania_min as number) <= 0) {
        return jsonResponse(400, { ok: false, error: "czas_trwania_min musi być dodatnim numberem (minuty)" });
      }
    }
    if ("kraina" in update) {
      if (typeof update.kraina !== "string" || !KRAINY_DOPUSZCZALNE.includes(update.kraina as string)) {
        return jsonResponse(400, {
          ok: false,
          error: `kraina musi być jedną z: ${KRAINY_DOPUSZCZALNE.join(", ")}`,
        });
      }
    }
    if ("lokalizacja" in update && update.lokalizacja !== null && typeof update.lokalizacja !== "string") {
      return jsonResponse(400, { ok: false, error: "lokalizacja musi być stringiem lub null" });
    }
    if ("przypomnienie_min_przed" in update) {
      const v = update.przypomnienie_min_przed;
      if (v !== null && (typeof v !== "number" || (v as number) < 0)) {
        return jsonResponse(400, {
          ok: false,
          error: "przypomnienie_min_przed musi być nieujemnym numberem (minuty) lub null",
        });
      }
    }

    // --- Supabase client ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- UPDATE + SELECT zwrotny ---
    const { data, error } = await supabase
      .from("events")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // PGRST116 = "JSON object requested, multiple (or no) rows returned" — eq().single() na nieistniejący id
      if (error.code === "PGRST116") {
        return jsonResponse(404, { ok: false, error: `Event o id=${id} nie istnieje` });
      }
      console.error("event-update UPDATE error:", error);
      return jsonResponse(500, { ok: false, error: `Błąd bazy: ${error.message}` });
    }

    return jsonResponse(200, { ok: true, event: data });
  } catch (err) {
    console.error("event-update unexpected error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse(500, { ok: false, error: `Nieoczekiwany błąd: ${msg}` });
  }
});
