/* =============================================
   Visitor counter — funwithfabric
   - Total visits: hit on counterapi.dev (free public counter)
   - Your visits:  localStorage on this browser
   Both fail safely; never blocks page render.
   ============================================= */
(function () {
  const TOTAL_EL  = document.getElementById('visit-count-total');
  const YOU_EL    = document.getElementById('visit-count-you');
  if (!TOTAL_EL || !YOU_EL) return;

  // --- 1. Local "your visits" counter ----------------------
  try {
    const KEY = 'fwf_visit_count';
    const prev = parseInt(localStorage.getItem(KEY) || '0', 10) || 0;
    const next = prev + 1;
    localStorage.setItem(KEY, String(next));
    YOU_EL.textContent = formatNumber(next);
  } catch (_) {
    // localStorage blocked (private mode etc.) — show a dash
    YOU_EL.textContent = '—';
  }

  // --- 2. Global "total visits" counter --------------------
  // Public, no-auth counter at https://counterapi.dev
  // We bump-and-read once per session to avoid double-counting
  // route changes within a single tab.
  const SESSION_KEY = 'fwf_session_counted';
  const NAMESPACE   = 'funwithfabric';
  const COUNTER     = 'site-visits';
  const BUMP_URL    = `https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/up`;
  const READ_URL    = `https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/`;

  const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1';
  const endpoint = alreadyCounted ? READ_URL : BUMP_URL;

  fetch(endpoint, { method: 'GET', cache: 'no-store', mode: 'cors' })
    .then(r => {
      if (!r.ok) throw new Error('counter ' + r.status);
      return r.json();
    })
    .then(data => {
      // counterapi.dev returns { count: <number>, ... }
      const n = (data && (data.count ?? data.value));
      if (typeof n === 'number') {
        TOTAL_EL.textContent = formatNumber(n);
        sessionStorage.setItem(SESSION_KEY, '1');
      } else {
        TOTAL_EL.textContent = '—';
      }
    })
    .catch(() => {
      TOTAL_EL.textContent = '—';
    });

  function formatNumber(n) {
    return n.toLocaleString();
  }
})();
