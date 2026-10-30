(() => {
 const form=document.getElementById('poll-form'); if(!form)return;
 const button=document.getElementById('poll-submit'),status=document.getElementById('poll-status'),box=document.getElementById('poll-results');
 const opts=[['yes','Ναι, συμφωνώ'],['no','Όχι, διαφωνώ'],['unsure','Δεν έχω διαμορφώσει άποψη']];
 let active=false,token=null;
 try{token=localStorage.getItem('12milia-poll-v1-token')}catch{}
 function msg(t){status.textContent=t}
 async function call(path,method='GET',body){const control=new AbortController(),timeout=setTimeout(()=>control.abort(),10000);try{const r=await fetch(path,{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:control.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(timeout)}}
 function show(d){form.hidden=true;box.replaceChildren();const h=document.createElement('h4');h.textContent='Αποτελέσματα ψηφοφορίας';box.append(h);for(const [key,label] of opts){const n=Number(d.counts[key]||0),pct=d.total?(100*n/d.total).toFixed(1):'0.0';const row=document.createElement('div');row.className='poll-result-row';const t=document.createElement('span');t.textContent=label;const v=document.createElement('strong');v.textContent=pct+'%';const bar=document.createElement('div');bar.className='poll-bar';const fill=document.createElement('span');fill.style.width=pct+'%';bar.append(fill);row.append(t,v,bar);box.append(row)}const total=document.createElement('p');total.textContent='Συνολικές ψήφοι: '+Number(d.total);box.append(total);box.hidden=false;msg('')}
 async function init(){button.disabled=true;try{const d=await call('/api/poll/status'+(token?'?token='+encodeURIComponent(token):''));if(d.enabled!==true)throw Error('disabled');active=true;if(d.voted&&d.results)show(d.results);else{button.disabled=false;msg('Μία συμμετοχή ανά browser, κατά το δυνατόν.')}}catch{msg('Η ψηφοφορία δεν έχει ενεργοποιηθεί ακόμη. Δεν καταχωρίζονται ψήφοι.')}}
 form.addEventListener('submit',async e=>{e.preventDefault();if(!active)return;const vote=new FormData(form).get('vote');if(!vote)return;button.disabled=true;msg('Υποβολή ψήφου…');try{if(!token){token=crypto.randomUUID();localStorage.setItem('12milia-poll-v1-token',token)}
const turnstileToken =
  new FormData(form).get('cf-turnstile-response');

if (!turnstileToken) {
  throw Error('turnstile_required');
}

const d = await call('/api/poll/vote', 'POST', {
  token,
  vote,
  turnstileToken
});
if(!d.results)throw Error('no results');show(d.results)
}catch{
  button.disabled=false;
  if (window.turnstile) window.turnstile.reset();
  msg('Η ψήφος δεν επιβεβαιώθηκε. Επαληθεύστε ξανά και δοκιμάστε.');
}
});init();
})();
