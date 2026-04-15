import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FALLBACK_RDZEN = `Jesteś Sercem MANA — towarzyszem podróżnika. Nie terapeutą, nie doradcą, nie ekspertem. Towarzyszem. Słuchasz ze zrozumieniem. Nigdy nie oceniasz. Zadajesz jedno pytanie na raz. Nigdy więcej. Absolutnie nigdy nie używasz emotek, gwiazdek, podkreśleń. Zawsze mów po polsku. Nie projektujesz trudności których podróżnik nie wymienił. Gdy podróżnik zadaje pytanie — najpierw odpowiedz na nie wprost.`

const FALLBACK_KONTEKST = `Jesteś Duchem Serca w przestrzeni Dobrego Dnia — miejscu gdzie podróżnik uczy się zauważać i wyrażać to co dobre w swoim dniu. Przyjmujesz myśl podróżnika, wzmacniasz to co pozytywne, delikatnie prowadzisz gdy myśl jeszcze tam nie dotarła. Odpowiadasz krótko i ciepło. Jedno pytanie na raz. Nie drążysz w negatywnym. Podróżnik wychodzi czując że ktoś go zauważył.`

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { mysl, session_id, traveler_uuid } = await req.json()

    if (!mysl) return new Response(JSON.stringify({ error: 'brak mysli' }), { status: 400, headers: corsHeaders })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Pobierz oba prompty z bazy — fallback gdy baza nie odpowie
    const [rdzenResult, kontekstResult] = await Promise.allSettled([
      supabase.from('prompts').select('tresc').eq('nazwa', 'serce_konstytucja').single(),
      supabase.from('prompts').select('tresc').eq('nazwa', 'magic_jar_kontekst').single()
    ])

    const rdzenTresc = rdzenResult.status === 'fulfilled' && rdzenResult.value.data?.tresc
      ? rdzenResult.value.data.tresc
      : FALLBACK_RDZEN

    const kontekstTresc = kontekstResult.status === 'fulfilled' && kontekstResult.value.data?.tresc
      ? kontekstResult.value.data.tresc
      : FALLBACK_KONTEKST

    // Pobierz historię sesji
    const { data: historia } = await supabase
      .from('dd_entries')
      .select('mysl, odpowiedz, created_at')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true })
      .limit(10)

    // Wykryj wzorce semantyczne jeśli mamy traveler_uuid i OpenAI key
    let wzorzecKontekst = ''
    try {
      if (traveler_uuid && Deno.env.get('OPENAI_API_KEY')) {
        // Generuj embedding bieżącej myśli
        const embRes = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
          },
          body: JSON.stringify({ model: 'text-embedding-ada-002', input: mysl })
        })
        const embData = await embRes.json()
        const embedding = embData.data?.[0]?.embedding

        if (embedding) {
          // Szukaj podobnych myśli z ostatnich 30 dni
          const { data: podobne } = await supabase.rpc('match_dd_entries', {
            query_embedding: embedding,
            match_threshold: 0.85,
            match_count: 10,
            p_traveler_uuid: traveler_uuid,
            days_back: 30
          })

          if (podobne && podobne.length >= 3) {
            wzorzecKontekst = `\n\nINFORMACJA DLA DUCHA: podróżnik pisał podobną myśl już ${podobne.length} razy w ostatnich 30 dniach. Zastosuj mechanikę dla powtarzających się myśli zgodnie z zasadami.`
          }
        }
      }
    } catch (_) {
      // Wzorzec nie jest krytyczny — kontynuuj bez niego
    }

    // Zbuduj messages z historią
    const messages: { role: string; content: string }[] = []
    if (historia && historia.length > 0) {
      historia.forEach((e: any) => {
        messages.push({ role: 'user', content: e.mysl })
        messages.push({ role: 'assistant', content: e.odpowiedz })
      })
    }
    messages.push({ role: 'user', content: mysl })

    // Jeden system prompt = rdzeń + nakładka + wzorzec
    const systemPrompt = rdzenTresc + '\n\n' + kontekstTresc + wzorzecKontekst

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: systemPrompt,
        messages
      })
    })

    const data = await response.json()
    const pelnaOdpowiedz = data.content?.[0]?.text || 'Słyszę Cię.'

    // Wyciągnij blokadę — ukryta przed podróżnikiem
    const blokada = pelnaOdpowiedz.includes('BLOKADA:TAK')
    const odpowiedz = pelnaOdpowiedz
      .replace(/BLOKADA:TAK/g, '')
      .replace(/BLOKADA:NIE/g, '')
      .trim()

    // Zapisz do bazy
    const { data: nowyWpis } = await supabase
      .from('dd_entries')
      .insert({ session_id, mysl, odpowiedz, ocena: blokada ? 'negatywna' : 'pozytywna', traveler_uuid })
      .select('id')
      .single()

    // Wywołaj embed-dd-entry asynchronicznie — nie blokuje odpowiedzi podróżnika
    if (nowyWpis?.id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      fetch(`${supabaseUrl}/functions/v1/embed-dd-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ entry_id: nowyWpis.id, mysl })
      }).catch(() => {})
    }

    return new Response(JSON.stringify({ odpowiedz, blokada }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    })
  }
})
