import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { nick } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  const { data } = await supabase
    .from('trainers')
    .select('nick')
    .ilike('nick', nick)
    .limit(1)

  return new Response(
    JSON.stringify({ is_trainer: data && data.length > 0 }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
