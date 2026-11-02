/* Common navigation, Cyprus banner and footer for every 12milia.top page.
   One place to edit shared content. Loaded before privacy.js. */
(() => {
  'use strict';
  const root = '/';
  const asset = root + 'assets/';
  const links = [
    ['12 ν.μ.', root + '#overview'],
    ['Βασικές έννοιες', root + 'basikes-ennoies/'],
    ['Ίμια & Καστελλόριζο', root + 'nisia-kai-aoz/'],
    ['Χάρτες', root + '#map'],
    ['Ερωτήσεις', root + '#faq'],
    ['🗳️ Ψήφισε', root + '#poll'],
    ['Επιλεγμένο υλικό', root + '#articles-videos'],
    ['Πηγές', root + '#sources']
  ];
  const nav = document.getElementById('site-header');
  if (nav) nav.innerHTML = '<nav aria-label="Κεντρική πλοήγηση" class="wrap nav">' +
    '<a class="brand" href="' + root + '">12milia<span>.top</span><img src="' + asset + 'gr-flag.svg" alt="" class="site-flag" width="24" height="16"></a>' +
    '<div class="navlinks">' + links.map(([label, href]) => '<a href="' + href + '">' + label + '</a>').join('') + '</div></nav>';
  const banner = document.getElementById('site-cyprus');
  if (banner) {
    const now = new Date();
    let years = now.getFullYear() - 1974;
    if (now.getMonth() < 6 || (now.getMonth() === 6 && now.getDate() < 20)) years--;
    const greek = (navigator.language || 'el').toLowerCase().startsWith('el');
    const url = greek
      ? 'https://www.gov.cy/mfa/documents/toyrkiki-stratiotiki-eisvoli-kai-katochi/'
      : 'https://www.gov.cy/mfa/en/documents/turkish-military-invasion-and-occupation/';
    const title = greek
      ? 'Υπουργείο Εξωτερικών Κυπριακής Δημοκρατίας — Τουρκική στρατιωτική εισβολή και κατοχή'
      : 'Republic of Cyprus Ministry of Foreign Affairs — Turkish military invasion and occupation';
    const label = greek
      ? years + ' χρόνια Τουρκική στρατιωτική εισβολή και κατοχή — Κύπρος: Δεν ξεχνώ'
      : years + ' years Turkish military invasion and occupation — Cyprus: We do not forget';
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    const a = document.createElement('a');
    a.className = 'cyprus-remembrance';
    a.id = 'cyprus-remembrance';
    a.href = url;
    a.title = title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const flag = document.createElement('img');
    flag.alt = 'Σημαία Κυπριακής Δημοκρατίας';
    flag.width = 32; flag.height = 23;
    flag.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Cyprus.svg';
    const span = document.createElement('span');
    span.id = 'cyprus-years';
    span.textContent = label;
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    a.append(flag, span, arrow); wrap.append(a); banner.replaceChildren(wrap);
  }
  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `
    <div class="wrap footer-inner">
      <div><a href="/" class="footer-brand">   <strong>12milia.top <img src="${asset}gr-flag.svg" alt="Ελληνική σημαία" class="footer-flag" width="24" height="16"></strong> </a>
        <p>Ανεξάρτητη πρωτοβουλία ενημέρωσης για τα 12 ν.μ. και το Δίκαιο της Θάλασσας.</p>
        <p><a aria-label="Επικοινωνία με email στο info@amomfaretos.top" href="mailto:info@amomfaretos.top">info@amomfaretos.top</a></p>
        <p>Δημιουργία: <time datetime="2026-10-28"><strong class="anniversary-date">28 Οκτωβρίου</strong> <span class="footer-year">2026</span></time></p>
      </div>
      <div><p>Με επίσημες πηγές, διαδραστικούς χάρτες και τεκμηρίωση.</p>
        <p><button aria-haspopup="dialog" id="privacy-open" type="button">Πληροφορίες απορρήτου</button></p>
        <p><a href="/">Επιστροφή στην αρχική</a></p>
      </div>
    </div>`;
  const searchScript = document.createElement('script');
  searchScript.src = asset + 'site-search.js?v=1';
  document.body.appendChild(searchScript);
})();
