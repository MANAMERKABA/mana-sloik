import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { entry_id, mysl } = await req.json()

    if (!entry_id || !mysl) {
      return new Response(JSON.stringify({ error: 'brak entry_id lub mysl' }), { status: 400, headers: corsHeaders })
    }

    // Generuj embedding przez OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: mysl
      })
    })

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data?.[0]?.embedding

    if (!embedding) {
      return new Response(JSON.stringify({ error: 'brak embeddingu z OpenAI' }), { status: 500, headers: corsHeaders })
    }

    // Zapisz embedding do dd_entries
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase
      .from('dd_entries')
      .update({ embedding })
      .eq('id', entry_id)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    })
  }
})
