// supabase/functions/summarize-conversation/index.ts
// Edge Function: dostaje transcript rozmowy, zwraca propozycje
// [{tresc, typ, sekcja?, due_date?, data_czas?, opis?, lokalizacja?, czas_trwania_min?}]
//
// Typy:
//   zadanie | sen | odczucie  — idą do stones (typ stones.typ)
//   event                     — idzie do events (frontend INSERT do events.tytul/data_czas)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Jesteś analizatorem rozmów podróżnika z Asystentem MANA.

Twoim zadaniem jest wyciągnąć propozycje rzeczy do zapisania na podstawie transkrypcji rozmowy.

Cztery typy propozycji:
1. "zadanie" — coś do zrobienia (np. "zadzwonić do mamy", "kupić chleb")
2. "sen" — opisany sen, marzenie, wizja
3. "odczucie" — refleksja, obserwacja stanu, uczucie
4. "event" — konkretne wydarzenie z datą i godziną (np. "wizyta u dentysty piątek 14:00")

Zasady:
- TYLKO to co WPROST zostało omówione w rozmowie. Nic nie dopowiadaj.
- Jeśli rozmowa była luźna i nic konkretnego nie zostało powiedziane — zwróć pustą listę.
- Maksymalnie 6 propozycji.
- Każda propozycja zwięzła (1 zdanie, max ~80 znaków w "tresc").
- Dla typu "event" WYMAGANE pole "data_czas" w formacie ISO 8601 z timezone (np. "2026-04-29T14:00:00+02:00"). Jeśli rozmowa nie podała precyzyjnej daty/godziny — NIE klasyfikuj jako event, tylko jako "zadanie".
- Dla typu "zadanie" opcjonalne "due_date" w ISO 8601, jeśli wynika z rozmowy.
- Dla wszystkich typów opcjonalnie "sekcja" (krótka kategoria, np. "praca", "rodzina", "zdrowie").
- Dla "event" opcjonalnie "opis", "lokalizacja", "czas_trwania_min".

Odpowiedź WYŁĄCZNIE jako JSON tablica obiektów. Bez wstępu, bez markdown, bez wyjaśnień.

Format:
[
  {"tresc": "...", "typ": "zadanie|sen|odczucie|event", ...opcjonalne pola}
]

Pusta tablica = []`;

function getPolandISO(): string {
  const now = new Date();
  const offset = isDST(now) ? 2 : 1;
  const local = new Date(now.getTime() + offset * 3600 * 1000);
  return local.toISOString().slice(0, 19) + (offset === 2 ? "+02:00" : "+01:00");
}

function isDST(date: Date): boolean {
  const year = date.getUTCFullYear();
  const marchEnd = new Date(Date.UTC(year, 2, 31));
  marchEnd.setUTCDate(31 - marchEnd.getUTCDay());
  marchEnd.setUTCHours(1, 0, 0, 0);
  const octEnd = new Date(Date.UTC(year, 9, 31));
  octEnd.setUTCDate(31 - octEnd.getUTCDay());
  octEnd.setUTCHours(1, 0, 0, 0);
  return date >= marchEnd && date < octEnd;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const traveler_id = body.traveler_id;
    const transcript = body.transcript;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 20) {
      return new Response(
        JSON.stringify({ propozycje: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt =
      `Aktualna data/czas (Polska): ${getPolandISO()}\n\n` +
      `Transkrypcja rozmowy:\n\n${transcript}\n\n` +
      `Wyciągnij propozycje jako JSON.`;

    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const errTxt = await anthropicResp.text();
      return new Response(
        JSON.stringify({ error: `Anthropic ${anthropicResp.status}: ${errTxt}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicData = await anthropicResp.json();
    const rawText = anthropicData.content?.[0]?.text || "[]";

    let propozycje: any[] = [];
    try {
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
      const arrStart = cleaned.indexOf("[");
      const arrEnd = cleaned.lastIndexOf("]");
      if (arrStart === -1 || arrEnd === -1) {
        propozycje = [];
      } else {
        propozycje = JSON.parse(cleaned.slice(arrStart, arrEnd + 1));
      }
    } catch (parseErr) {
      console.warn("summarize-conversation: parse fail", { rawText, err: parseErr });
      propozycje = [];
    }

    const valid = (Array.isArray(propozycje) ? propozycje : [])
      .filter((p) => p && typeof p === "object" && typeof p.tresc === "string" && p.tresc.trim())
      .map((p) => {
        const typ = ["zadanie", "sen", "odczucie", "event"].includes(p.typ) ? p.typ : "odczucie";
        const out: any = { tresc: String(p.tresc).trim(), typ };
        if (p.sekcja && typeof p.sekcja === "string") out.sekcja = p.sekcja;
        if (p.due_date && typeof p.due_date === "string") out.due_date = p.due_date;
        if (typ === "event") {
          if (p.data_czas && typeof p.data_czas === "string") out.data_czas = p.data_czas;
          else return null;
          if (p.tytul && typeof p.tytul === "string") out.tytul = p.tytul;
          if (p.opis && typeof p.opis === "string") out.opis = p.opis;
          if (p.lokalizacja && typeof p.lokalizacja === "string") out.lokalizacja = p.lokalizacja;
          if (typeof p.czas_trwania_min === "number") out.czas_trwania_min = p.czas_trwania_min;
        }
        return out;
      })
      .filter(Boolean)
      .slice(0, 6);

    return new Response(
      JSON.stringify({ propozycje: valid }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
