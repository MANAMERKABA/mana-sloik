import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, traveler_id, nick } = await req.json()

    if (!email) return new Response(JSON.stringify({ error: 'brak email' }), { status: 400, headers: corsHeaders })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Najpierw usuń stary kod dla tego emaila (jeśli istnieje)
    await supabase.from('consent_codes').delete().eq('email', email)

    // Wstaw nowy kod
    const { error: dbError } = await supabase.from('consent_codes').insert({
      email,
      code,
      expires_at: expires,
      traveler_id: traveler_id || null,
      used: false
    })

    if (dbError) {
      console.error('DB insert error:', dbError.message)
      return new Response(JSON.stringify({ ok: false, error: 'Błąd bazy: ' + dbError.message }), { status: 500, headers: corsHeaders })
    }

    console.log('Kod zapisany do bazy dla:', email)

    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!

    const emailBody = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#2a2640;">Magic Jar — kod potwierdzający</h2>
        <p style="color:#6a6686;">Cześć ${nick || ''}!</p>
        <p style="color:#6a6686;">Twój kod do potwierdzenia zgody:</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#f6a825;padding:20px 0;">${code}</div>
        <p style="color:#b0abc8;font-size:13px;">Kod ważny 15 minut. Jeśli to nie Ty — zignoruj tę wiadomość.</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Magic Jar <noreply@magicjar.pl>',
        to: email,
        subject: 'Twój kod Magic Jar: ' + code,
        html: emailBody
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ ok: false, error: 'Błąd wysyłki: ' + err }), { headers: corsHeaders })
    }

    console.log('Email wysłany na:', email)
    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })

  } catch (error) {
    console.error('Catch error:', error.message)
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: corsHeaders })
  }
})
