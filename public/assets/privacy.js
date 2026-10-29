/* 12milia.top — κοινό παράθυρο απορρήτου για όλες τις σελίδες (v44). */
(function () {
  'use strict';
  const overlay = document.getElementById('privacy-overlay');
  const opener = document.getElementById('privacy-open');
  if (!overlay || !opener) return;

  // Ένα μοναδικό αρχείο για το κείμενο και τη λειτουργία του διαλόγου.
  // Δεν αναφέρεται ενεργή ψηφοφορία: το backend D1 δεν έχει ενεργοποιηθεί.
  overlay.innerHTML = `
    <div class="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title" tabindex="-1">
      <button id="privacy-close" class="privacy-close" type="button" aria-label="Κλείσιμο πληροφοριών απορρήτου">×</button>
      <h2 id="privacy-title">Πληροφορίες απορρήτου</h2>
      <p>Το <strong>12milia.top</strong> είναι ανεξάρτητος ενημερωτικός ιστότοπος και δεν απαιτεί την παροχή προσωπικών στοιχείων για την περιήγηση.</p>
      <p><strong>Στατιστικά επισκεψιμότητας:</strong> Χρησιμοποιούμε το Counter.dev για συγκεντρωτικά στατιστικά, όπως επισκέψεις, χώρα, τύπο συσκευής και πρόγραμμα περιήγησης. Η υπηρεσία δηλώνει ότι λειτουργεί χωρίς cookies και χωρίς καταγραφή μεμονωμένων επισκεπτών.</p>
      <p><strong>Φιλοξενία:</strong> Ο ιστότοπος φιλοξενείται μέσω Cloudflare, η οποία ενδέχεται να επεξεργάζεται τεχνικά δεδομένα σύνδεσης για την παροχή και προστασία του ιστότοπου.</p>
      <p><strong>Εξωτερικές υπηρεσίες:</strong> Οι χάρτες και ορισμένα γραφικά χρησιμοποιούν εξωτερικές υπηρεσίες. Κατά τη φόρτωσή τους, το πρόγραμμα περιήγησης επικοινωνεί με τους αντίστοιχους παρόχους και ενδέχεται να διαβιβάζει τεχνικά δεδομένα σύνδεσης.</p>
    </div>`;

  const dialog = overlay.querySelector('.privacy-modal');
  const closer = overlay.querySelector('#privacy-close');
  let lastFocus = null;
  let previousOverflow = '';

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = previousOverflow;
    const returnTo = lastFocus && lastFocus.isConnected ? lastFocus : opener;
    returnTo.focus();
  }
  function open() {
    lastFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    dialog.focus();
  }
  opener.addEventListener('click', open);
  closer.addEventListener('click', close);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusables = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])'));
    if (!focusables.length) { event.preventDefault(); dialog.focus(); return; }
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
      event.preventDefault(); first.focus();
    }
  });
})();
