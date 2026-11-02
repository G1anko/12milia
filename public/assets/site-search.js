/* Local on-site search: no external search provider, analytics or query storage. */
(() => {
  'use strict';
  const pages = [
    ['/', 'Αρχική'],
    ['/basikes-ennoies/', 'Βασικές έννοιες'],
    ['/nisia-kai-aoz/', 'Ίμια και Καστελλόριζο']
  ];
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el').replace(/ς/g, 'σ');
  const makeIds = doc => {
    doc.querySelectorAll('section[id]').forEach(section => {
      section.querySelectorAll('details:not([id])').forEach((details, i) => {
        details.id = 'search-' + section.id + '-' + (i + 1);
      });
    });
  };
  makeIds(document);
  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'site-search-trigger';
  link.setAttribute('aria-label', 'Αναζήτηση στον ιστότοπο');
  link.title = 'Αναζήτηση';
  link.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
  const menu = document.querySelector('#site-header .navlinks');
  if (!menu) return;
  menu.appendChild(link);
  const overlay = document.createElement('div');
  overlay.className = 'site-search-overlay';
  overlay.hidden = true;
  overlay.innerHTML = '<div class="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-heading"><div class="site-search-heading"><h2 id="site-search-heading">Αναζήτηση στο 12milia.top</h2><button type="button" class="site-search-close" aria-label="Κλείσιμο αναζήτησης">×</button></div><label for="site-search-input">Τι αναζητάς;</label><input id="site-search-input" type="search" autocomplete="off" placeholder="π.χ. Κύπρος, 1931, casus belli"><p class="site-search-status" role="status" aria-live="polite"></p><div class="site-search-results"></div><p class="site-search-note">Αναζήτηση στις σελίδες του ιστοτόπου, χωρίς αποστολή του ερωτήματος σε τρίτους.</p></div>';
  document.body.appendChild(overlay);
  const input = overlay.querySelector('input');
  const results = overlay.querySelector('.site-search-results');
  const status = overlay.querySelector('.site-search-status');
  const close = () => { overlay.hidden = true; document.body.classList.remove('site-search-active'); link.focus(); };
  const titleFor = node => {
    if (node.tagName === 'DETAILS') return node.querySelector('summary')?.textContent.trim() || 'Περισσότερα';
    return node.querySelector('h1,h2,h3')?.textContent.trim() || 'Πληροφορίες';
  };
  const makeRecords = (doc, path, pageLabel) => {
    makeIds(doc);
    const records = [];
    doc.querySelectorAll('main section[id], main details[id]').forEach(node => {
      const id = node.id;
      if (!id || id === 'poll') return;
      const copy = node.cloneNode(true);
      copy.querySelectorAll('script,style,svg,nav,form,button,figure,details,iframe').forEach(n => n.remove());
      const body = (copy.textContent || '').replace(/\s+/g, ' ').trim();
      if (!body) return;
      records.push({title:titleFor(node),page:pageLabel,href:path+'#'+encodeURIComponent(id),body});
    });
    return records;
  };
  let indexPromise;
  const load = () => indexPromise ||= Promise.all(pages.map(async ([path,label]) => {
    const response = await fetch(path, {credentials:'same-origin'});
    if (!response.ok) throw new Error('Δεν φορτώθηκε η σελίδα ' + label);
    const html = await response.text();
    return makeRecords(new DOMParser().parseFromString(html,'text/html'),path,label);
  })).then(groups => groups.flat());
  const match = (record, query) => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    const text = normalize(record.title+' '+record.body);
    if (!terms.every(t => text.includes(t))) return null;
    const first = normalize(record.body).indexOf(terms[0]);
    const start = Math.max(0, first-85);
    const snippet = (start ? '…' : '') + record.body.slice(start,start+215) + (start+215 < record.body.length ? '…' : '');
    return {...record,snippet,score:terms.reduce((sum,t) => sum+(normalize(record.title).includes(t)?10:1),0)};
  };
  const render = async () => {
    const q = input.value.trim();
    results.replaceChildren();
    if (!q) { status.textContent='Γράψε μια λέξη ή φράση για να ξεκινήσεις.'; return; }
    status.textContent='Αναζήτηση…';
    try {
      const records = await load();
      if (q !== input.value.trim() || overlay.hidden) return;
      const matches = records.map(r=>match(r,q)).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,15);
      status.textContent=matches.length ? 'Αποτελέσματα: '+matches.length+(matches.length===15?' (εμφανίζονται έως 15)':'') : 'Δεν βρέθηκαν αποτελέσματα.';
      for (const item of matches) {
        const a = document.createElement('a');
        a.className = 'site-search-result';
        a.href = item.href;
        const heading = document.createElement('strong'); heading.textContent = item.title;
        const label = document.createElement('small'); label.textContent = item.page;
        const excerpt = document.createElement('span'); excerpt.textContent = item.snippet;
        a.append(heading,label,excerpt); results.append(a);
      }
    } catch (err) { status.textContent = 'Η αναζήτηση δεν είναι προσωρινά διαθέσιμη. Έλεγξε τη σύνδεσή σου.'; }
  };
  let request = 0;
  input.addEventListener('input', () => { const n = ++request; Promise.resolve().then(()=>{if(n===request)render();}); });
  link.addEventListener('click', () => { overlay.hidden=false; document.body.classList.add('site-search-active'); input.focus(); render(); });
  overlay.querySelector('.site-search-close').addEventListener('click',close);
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!overlay.hidden)close(); });
  overlay.addEventListener('keydown',e=>{if(e.key==='Tab'){const nodes=[...overlay.querySelectorAll('button,input,a')].filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  const openTarget = () => {
    if (!location.hash) return;
    let node;
    try { node=document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; }
    if (!node) return;
    if (node.tagName==='DETAILS') node.open=true;
    node.closest('details')?.setAttribute('open','');
  };
  openTarget();
  window.addEventListener('hashchange',openTarget);
  results.addEventListener('click', e => { const a=e.target.closest('a'); if(a && new URL(a.href).pathname===location.pathname) { close(); queueMicrotask(openTarget); } });
})();
