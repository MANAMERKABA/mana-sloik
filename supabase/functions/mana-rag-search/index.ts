import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { query, warstwa } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Brak query" }), { status: 400 });
    }

    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    const embeddingData = await embeddingRes.json();
    const embedding = embeddingData.data[0].embedding;

    const supabase = createClient(
      Deno.env.get("SERCE_SUPABASE_URL")!,
      Deno.env.get("SERCE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.rpc("search_knowledge", {
      query_embedding: embedding,
      match_count: 10,
    });

    if (error) throw error;

    const aktywnaWarstwa = warstwa || "podroznik";
    const filtered = data.filter((r: any) => r.warstwa === aktywnaWarstwa);

    const context = filtered
      .slice(0, 5)
      .map((r: any) => `[${r.temat}]\n${r["treść"]}`)
      .join("\n\n---\n\n");

    return new Response(JSON.stringify({ context }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
