import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, age } = await req.json();

    if (!text || text.trim().length < 10) {
      return new Response(
        JSON.stringify({
          valid: false,
          serce: "Napisz trochę więcej — co dokładnie się wydarzyło? 😊",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("Brak klucza ANTHROPIC_API_KEY");

    const ageNum = parseInt(age) || 30;
    let toneTip = "";
    if (ageNum <= 9)  toneTip = "Piszesz do małego dziecka (6-9 lat). Używaj prostych słów, ciepło, krótko.";
    else if (ageNum <= 13) toneTip = "Piszesz do dziecka (10-13 lat). Bądź przyjazny i naturalny.";
    else if (ageNum <= 17) toneTip = "Piszesz do nastolatka (14-17 lat). Bądź szczery i bez protekcjonalizmu.";
    else toneTip = "Piszesz do dorosłego. Bądź ciepły i bezpośredni.";

    const prompt = `Jesteś asystentem aplikacji Magic Jar.
Użytkownik wpisał myśl do sekcji "Dobry Dzień" — miejsca na pozytywne wspomnienia z dnia.

${toneTip}

ODRZUĆ (valid: false) jeśli tekst:
- to bełkot, losowe litery lub powtarzające się słowa (np. "bla bla bla", "aaa bbb ccc", "fdskjfh")
- jest bezsensowny lub niezrozumiały
- jest negatywny, smutny, pełen żalu, złości lub narzekania
- jest za krótki lub zbyt ogólny (samo "dobrze", "ok", "nic", "nie wiem")
- zawiera wulgaryzmy lub obraźliwe treści
- to przypadkowe testowanie (np. "test", "123", "asdf")

ZAAKCEPTUJ (valid: true) tylko jeśli:
- to prawdziwa pozytywna myśl, wspomnienie lub wydarzenie z dzisiejszego dnia
- tekst ma sens, jest zrozumiały i coś konkretnego opisuje
- nawet krótka ale szczera pozytywna myśl (np. "zjadłam pyszne lody z tatą") jest ok

Odpowiedz TYLKO w JSON, bez żadnych dodatkowych słów, bez markdown:
{"valid": true, "serce": "krótka ciepła odpowiedź max 2 zdania"}
lub
{"valid": false, "serce": "krótka łagodna sugestia co wpisać max 1 zdanie"}

Myśl użytkownika: "${text}"`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data?.content?.[0]?.text || "";

    // Parsuj JSON z odpowiedzi
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const result = JSON.parse(match[0]);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback jeśli Haiku zwrócił coś dziwnego
    throw new Error("Nie udało się sparsować odpowiedzi Haiku");

  } catch (err) {
    console.error("iskierka-eval error:", err);
    // Bezpieczny fallback — nie blokuj użytkownika przy błędzie serwera
    return new Response(
      JSON.stringify({
        valid: true,
        serce: "Pięknie, że to zapisujesz! 🌟",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
