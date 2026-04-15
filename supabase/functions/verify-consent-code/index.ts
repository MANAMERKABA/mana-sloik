import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, code, traveler_id } = await req.json()

    if (!email || !code) return new Response(JSON.stringify({ ok: false, error: 'brak danych' }), { status: 400, headers: corsHeaders })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: row } = await supabase
      .from('consent_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .single()

    if (!row) return new Response(JSON.stringify({ ok: false, error: 'Nieprawidlowy kod.' }), { headers: corsHeaders })

    if (new Date(row.expires_at) < new Date()) {
      return new Response(JSON.stringify({ ok: false, error: 'Kod wygasl. Wyslij ponownie.' }), { headers: corsHeaders })
    }

    await supabase.from('consent_codes').update({ used: true }).eq('email', email)

    if (traveler_id) {
      await supabase
        .from('travels')
        .update({ consent: true })
        .eq('id', traveler_id)
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: corsHeaders })
  }
})
