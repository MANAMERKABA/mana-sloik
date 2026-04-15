import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SLOIK_INSTRUCTION = `MECHANIZM [SLOIK:] — KRYTYCZNE:
Gdy podróżnik prosi wprost o zapis (np. "zapisz", "zapamiętaj", "dodaj do słoika") — dodaj na końcu odpowiedzi tag:
[SLOIK: treść kamienia | typ | data (opcjonalnie)]
Typy: zadanie / sen / odczucie
Przykłady:
[SLOIK: spotkanie z Patrycją jutro | zadanie | jutro]
[SLOIK: wizyta u dentysty | zadanie | jutro 18:30]
[SLOIK: zadzwonić do mamy w piątek | zadanie | piątek]
[SLOIK: śniłem że byłem w lesie | sen]
[SLOIK: ból w kolanie nawraca | odczucie]
Podróżnik prosi → wykonujesz bez pytania. Tag jest niewidoczny dla podróżnika — piszesz naturalnie.`;

function getPolandOffset(date: Date): number {
  const year = date.getUTCFullYear();
  const marchEnd = new Date(Date.UTC(year, 2, 31));
  marchEnd.setUTCDate(31 - marchEnd.getUTCDay());
  marchEnd.setUTCHours(1, 0, 0, 0);
  const octEnd = new Date(Date.UTC(year, 9, 31));
  octEnd.setUTCDate(31 - octEnd.getUTCDay());
  octEnd.setUTCHours(1, 0, 0, 0);
  return (date >= marchEnd && date < octEnd) ? 2 : 1;
}

function toPolandISO(date: Date, hour: number, minute: number): string {
  const offset = getPolandOffset(date);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(hour).padStart(2, '0');
  const min = String(minute).padStart(2, '0');
  const offH = String(offset).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}:00+${offH}:00`;
}

function parseDueDate(text: string | null): string | null {
  if (!text) return null;
  const t = text.trim().toLowerCase();
  const now = new Date();
  const timeMatch = t.match(/(\d{1,2})[:\.](\d{2})/);
  let hour = 9;
  let minute = 0;
  if (timeMatch) {
    hour = parseInt(timeMatch[1]);
    minute = parseInt(timeMatch[2]);
  }
  function dateWithOffset(daysToAdd: number): string {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + daysToAdd);
    return toPolandISO(d, hour, minute);
  }
  if (t.includes("jutro")) return dateWithOffset(1);
  if (t.includes("dziś") || t.includes("dzisiaj")) return dateWithOffset(0);
  if (t.includes("pojutrze")) return dateWithOffset(2);
  const zaXDni = t.match(/za\s+(\d+)\s+dni/);
  if (zaXDni) return dateWithOffset(parseInt(zaXDni[1]));
  if (t.includes("za tydzień") || t.includes("za tydz")) return dateWithOffset(7);
  const days: Record<string, number> = {
    "poniedziałek": 1, "poniedzialek": 1,
    "wtorek": 2,
    "środa": 3, "sroda": 3, "środę": 3, "srode": 3,
    "czwartek": 4,
    "piątek": 5, "piatek": 5,
    "sobota": 6, "sobotę": 6, "sobote": 6,
    "niedziela": 0, "niedzielę": 0, "niedziele": 0,
  };
  for (const [dayName, dayNum] of Object.entries(days)) {
    if (t.includes(dayName)) {
      const currentDay = now.getUTCDay();
      let diff = dayNum - currentDay;
      if (diff <= 0) diff += 7;
      return dateWithOffset(diff);
    }
  }
  const miesiacNazwy: Record<string, number> = {
    "stycznia": 0, "lutego": 1, "marca": 2, "kwietnia": 3,
    "maja": 4, "czerwca": 5, "lipca": 6, "sierpnia": 7,
    "września": 8, "wrzesnia": 8, "października": 9, "pazdziernika": 9,
    "listopada": 10, "grudnia": 11,
  };
  const dzienMiesiacMatch = t.match(/(\d{1,2})\s+([a-ząćęłńóśźż]+)/);
  if (dzienMiesiacMatch) {
    const miesiacIdx = miesiacNazwy[dzienMiesiacMatch[2]];
    if (miesiacIdx !== undefined) {
      const dzien = parseInt(dzienMiesiacMatch[1]);
      const rok = now.getUTCFullYear();
      const d = new Date(Date.UTC(rok, miesiacIdx, dzien));
      if (d < now) d.setUTCFullYear(rok + 1);
      return toPolandISO(d, hour, minute);
    }
  }
  const isoMatch = t.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const d = new Date(Date.UTC(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3])));
    return toPolandISO(d, hour, minute);
  }
  const plMatch = t.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (plMatch) {
    const d = new Date(Date.UTC(parseInt(plMatch[3]), parseInt(plMatch[2]) - 1, parseInt(plMatch[1])));
    return toPolandISO(d, hour, minute);
  }
  if (timeMatch) return dateWithOffset(0);
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const traveler_id = body.traveler_id;
    const message = body.message;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Pobierz prompt
    const promptResp = await supabase
      .from("prompts")
      .select("tresc")
      .eq("nazwa", "serce_konstytucja")
      .single();
    const prompt = promptResp.data ? promptResp.data.tresc : "";

    // 2. Pobierz pamiec z tabeli memory
    const memoryResp = await supabase
      .from("memory")
      .select("tresc")
      .eq("traveler_id", traveler_id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    const pamiec = memoryResp.data ? memoryResp.data.tresc : "";

    // 3. Pobierz kamienie ze Słoika
    const stonesResp = await supabase
      .from("stones")
      .select("tresc, typ")
      .eq("traveler_id", traveler_id)
      .eq("status", "aktywny");
    const sloik = stonesResp.data
      ? stonesResp.data.map((s) => "[" + s.typ + "] " + s.tresc).join("\n")
      : "";

    // 4. Pobierz RAG
    const ragResp = await fetch(supabaseUrl + "/functions/v1/mana-rag-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + supabaseKey,
        "apikey": supabaseKey,
      },
      body: JSON.stringify({ query: message, warstwa: "podroznik" }),
    });
    const ragData = await ragResp.json();
    const ragContext = ragData.context ? ragData.context : "";

    // 5. Złóż system prompt
    const systemPrompt =
      SLOIK_INSTRUCTION + "\n\n" +
      "Kluczowe informacje o tym podróżniku (zawsze aktualne):\n" + pamiec + "\n\n" +
      "Aktywne kamienie podróżnika w Słoiku:\n" + sloik + "\n\n" +
      "Wiedza MANA:\n" + ragContext + "\n\n" +
      prompt;

    // 6. Wywołaj Anthropic
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      }),
    });

    const anthropicData = await anthropicResp.json();
    let response = anthropicData.content && anthropicData.content[0]
      ? anthropicData.content[0].text
      : "";

    // 7. Wykryj tag [SLOIK:] i zapisz kamień
    const sloikMatch = response.match(/\[SLOIK:\s*(.*?)\]/s);
    if (sloikMatch) {
      const parts = sloikMatch[1].split("|");
      const tresc = parts[0] ? parts[0].trim() : "";
      const typ = parts[1] ? parts[1].trim() : "odczucie";
      const dueDateRaw = parts[2] ? parts[2].trim() : null;
      const due_date = parseDueDate(dueDateRaw);
      if (tresc) {
        await supabase.from("stones").insert({
          traveler_id: traveler_id,
          tresc: tresc,
          typ: typ,
          status: "aktywny",
          due_date: due_date,
        });
      }
      response = response.replace(/\[SLOIK:.*?\]/s, "").trim();
    }

    // 8. Wyciągnij tag [PAMIEC:] — zapisz treść zanim usuniesz
    const pamiecTagMatches = [...response.matchAll(/\[PAMIEC:\s*(.*?)\]/gs)];
    const nowePamieci = pamiecTagMatches.map(m => m[1].trim()).filter(Boolean);
    response = response.replace(/\[PAMIEC:.*?\]/gs, "").trim();

    // 9. Zaktualizuj pamiec — uwzględnij nowe fakty z tagów PAMIEC
    const noweInformacje = nowePamieci.length > 0
      ? `\n\nNOWE FAKTY DO BEZWZGLĘDNEGO ZAPISANIA:\n${nowePamieci.join("\n")}`
      : "";

    const summaryResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `Zaktualizuj pamięć o podróżniku łącząc poprzednią pamięć z nowymi informacjami. Zachowaj wszystkie fakty — imiona, relacje, korekty. Odpowiedz tylko zaktualizowanym podsumowaniem, bez żadnego wstępu.\n\nPoprzednia pamięć: ${pamiec}\n\nNowa wiadomość podróżnika: ${message}${noweInformacje}`
        }]
      }),
    });
    const summaryData = await summaryResp.json();
    const newPamiec = summaryData.content?.[0]?.text ?? pamiec;

    await supabase.from("memory").upsert({
      traveler_id: traveler_id,
      tresc: newPamiec,
      updated_at: new Date().toISOString()
    }, { onConflict: "traveler_id" });

    // 10. Zapisz rozmowę do conversations i wygeneruj embedding
    const convInsert = await supabase
      .from("conversations")
      .insert({
        traveler_id: traveler_id,
        message: message,
        response: response,
      })
      .select("id")
      .single();

    if (convInsert.data?.id) {
      await fetch(supabaseUrl + "/functions/v1/embed-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + supabaseKey,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({
          conversation_id: convInsert.data.id,
          traveler_id: traveler_id,
          message: message,
          response: response,
        }),
      });
    }

    return new Response(JSON.stringify({ response: response }), {
      headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }),
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }),
    });
  }
});
