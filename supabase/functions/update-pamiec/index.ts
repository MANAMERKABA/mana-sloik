Deno.serve(async (req) => {
  const { traveler_id, pamiec } = await req.json();

  const url = `${Deno.env.get('SUPABASE_URL')}/rest/v1/memory`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: Deno.env.get('SUPABASE_ANON_KEY'),
      Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      traveler_id,
      tresc: pamiec,
      updated_at: new Date().toISOString()
    })
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
