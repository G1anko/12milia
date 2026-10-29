// Cloudflare Worker for the static site and D1 poll. No account identifiers or raw IPs are stored.
const json = (obj, status = 200) => new Response(JSON.stringify(obj), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const validToken = token => typeof token === 'string' && /^[a-f0-9-]{36}$/i.test(token);
const keys = ['yes','no','unsure'];
async function digest(token, secret) {
  const bytes = new TextEncoder().encode(`${secret}:${token}`);
  const hash = await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash), x=>x.toString(16).padStart(2,'0')).join('');
}
async function tally(db) {
  const rows = await db.prepare('SELECT choice, COUNT(*) AS n FROM poll_votes GROUP BY choice').all();
  const counts = {yes:0,no:0,unsure:0};
  for (const row of rows.results) if (keys.includes(row.choice)) counts[row.choice] = row.n;
  return {counts,total:Object.values(counts).reduce((a,b)=>a+b,0)};
}
export default {
  async fetch(request,env) {
    const u = new URL(request.url);
    if (!u.pathname.startsWith('/api/poll/')) return env.ASSETS.fetch(request);
    if (!env.DB || !env.POLL_SECRET || env.POLL_ENABLED !== 'true') return json({enabled:false},503);
    try {
      if (request.method==='GET' && u.pathname==='/api/poll/status') {
        const token=u.searchParams.get('token');
        if (!validToken(token)) return json({enabled:true,voted:false});
        const hash=await digest(token, env.POLL_SECRET);
        const row=await env.DB.prepare('SELECT choice FROM poll_votes WHERE token_hash = ?').bind(hash).first();
        return row ? json({enabled:true,voted:true,results:await tally(env.DB)}) : json({enabled:true,voted:false});
      }
      if (request.method==='POST' && u.pathname==='/api/poll/vote') {
// Περιορισμός υποβολών ανά IP.
// Δεν αποθηκεύουμε την IP στη βάση D1.
const ip = request.headers.get('CF-Connecting-IP');

if (!ip || !env.POLL_RATE_LIMITER) {
  return json({error:'rate_limit_unavailable'},503);
}

const {success} = await env.POLL_RATE_LIMITER.limit({
  key: ip
});

if (!success) {
  return json({error:'rate_limit_exceeded'},429);
}
        if (Number(request.headers.get('content-length') || 0)>1024) return json({error:'too_large'},413);
        let body; try {body=await request.json();} catch {return json({error:'invalid_json'},400);}
        if (!validToken(body?.token)||!keys.includes(body?.vote)) return json({error:'invalid_vote'},400);
        if (!env.TURNSTILE_SECRET_KEY) {
  return json({error:'turnstile_not_configured'},503);
}

if (typeof body.turnstileToken !== 'string' ||
    !body.turnstileToken ||
    body.turnstileToken.length > 2048) {
  return json({error:'turnstile_required'},400);
}

const verification = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: body.turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') || undefined
    })
  }
);

if (!verification.ok) {
  return json({error:'turnstile_unavailable'},503);
}

const result = await verification.json();

if (!result.success ||
    result.hostname !== '12milia.top') {
  return json({error:'turnstile_failed'},403);
}
        const hash=await digest(body.token,env.POLL_SECRET);
        // Atomic unique constraint: an existing browser token cannot change its vote.
        await env.DB.prepare('INSERT OR IGNORE INTO poll_votes(token_hash,choice) VALUES (?,?)').bind(hash,body.vote).run();
        return json({ok:true,results:await tally(env.DB)});
      }
      return json({error:'not_found'},404);
    } catch(e) { console.error('poll backend error',e?.message); return json({error:'service_unavailable'},503); }
  }
};
