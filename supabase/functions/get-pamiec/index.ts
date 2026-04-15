Deno.serve(async (req) => {
  const { traveler_id } = await req.json();

  const url = `${Deno.env.get('SUPABASE_URL')}/rest/v1/memory?traveler_id=eq.${traveler_id}&select=tresc&order=updated_at.desc&limit=1`;

  const res = await fetch(url, {
    headers: {
      apikey: Deno.env.get('SUPABASE_ANON_KEY'),
      Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
    }
  });

  const data = await res.json();
  const pamiec = data?.[0]?.tresc ?? '';

  return new Response(JSON.stringify({ pamiec }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
