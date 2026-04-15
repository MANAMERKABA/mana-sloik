const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors() });
  }

  try {
    const { tresc } = await req.json();
    if (!tresc) {
      return new Response(JSON.stringify({ error: "brak tresc" }), {
        status: 400, headers: { ...cors(), "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const jutro = new Date(now.getTime() + 86400000).toISOString().split("T")[0];
    const pojutrze = new Date(now.getTime() + 172800000).toISOString().split("T")[0];
    const hour = now.getHours();

    const prompt = `Dzisiaj jest ${today}, godzina ${hour}:00. Przeanalizuj tekst i zdecyduj gdzie powinien trafić w aplikacji MANA.

TEKST: "${tresc}"

ZASADY KLASYFIKACJI:
1. "horyzont" z due_date gdy tekst zawiera konkretną datę lub termin (np. "jutro", "w piątek", "25 marca", "o 18:00")
2. "horyzont" z due_date=null gdy tekst to zadanie DO ZROBIENIA bez konkretnej daty (np. "zadzwonić do...", "przeczytać...", "to jest zadanie", "zadanie do zrobienia", "muszę", "trzeba")
3. "cisza" gdy tekst to sen, myśl, odczucie, emocja, refleksja
4. "notatka" tylko gdy naprawdę nie wiadomo gdzie trafi

WAŻNE — rozpoznaj zadanie bez daty:
- frazy "to jest zadanie", "zadanie do zrobienia", "muszę zrobić", "trzeba zrobić" → sekcja=horyzont, due_date=null, typ=zadanie
- czasowniki w bezokoliczniku ("zadzwonić", "przeczytać", "napisać") → sekcja=horyzont, due_date=null, typ=zadanie

Daty pomocnicze: jutro=${jutro}, pojutrze=${pojutrze}
Wyciągnij datę gdy jest — format ISO 8601. Brak godziny = ustaw 09:00.

Odpowiedz TYLKO czystym JSON bez żadnego tekstu przed ani po:
{"sekcja":"horyzont","due_date":"2026-04-03T18:00:00","typ":"zadanie","pewnosc":"wysoka","opis":"zadanie z terminem"}`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    const text = (data?.content?.[0]?.text ?? "").trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = {
        sekcja: "notatka",
        due_date: null,
        typ: "notatka",
        pewnosc: "niska",
        opis: "nie udało się przeanalizować",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...cors(), "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...cors(), "Content-Type": "application/json" },
    });
  }
});
