/* =============================================
   Help Me Decide — Fabric data movement picker
   Mirroring · Copy Job · Pipelines (Copy activity) · Eventstreams
   ============================================= */
(function () {
  const SECTION = document.getElementById('help-me-decide');
  if (!SECTION) return;

  const KEYS = ['mirroring', 'copyjob', 'pipeline', 'eventstream'];

  const LABEL = {
    mirroring:   'Mirroring',
    copyjob:     'Copy Job',
    pipeline:    'Copy activity in Pipelines',
    eventstream: 'Eventstreams',
  };

  // Why-we-picked phrasing per winner
  const REASON = {
    mirroring:   'Simple, free, near-zero setup — mirrors operational data into OneLake for analytics with no transformation.',
    copyjob:     'Low-code ingestion with bulk + incremental + CDC out of the box — no pipeline to build, but still rich options.',
    pipeline:    'Full orchestration with custom transforms and multi-activity flows — you control state and incremental logic.',
    eventstream: 'Real-time ingestion and routing for streaming sources (Kafka / Event Hubs / AMQP / HTTP) with in-flight transforms.',
  };

  // Scoring matrix: SCORES[questionKey][answerValue] => { optionKey: points }
  const SCORES = {
    latency: {
      realtime: { eventstream: 6 },
      nearreal: { copyjob: 2, eventstream: 2, mirroring: 2, pipeline: 1 },
      batch:    { copyjob: 3, pipeline: 3, mirroring: 1 },
    },
    source: {
      db:      { mirroring: 5, copyjob: 2, pipeline: 1 },
      files:   { copyjob: 4, pipeline: 3 },
      streams: { eventstream: 6 },
    },
    transform: {
      none:       { mirroring: 4, copyjob: 1 },
      cdc:        { copyjob: 5, mirroring: 1 },
      custom:     { pipeline: 6 },
      'stream-tx':{ eventstream: 6 },
    },
    control: {
      lowest:   { mirroring: 4, copyjob: 1 },
      moderate: { copyjob: 4, eventstream: 1 },
      full:     { pipeline: 5 },
    },
  };

  const selections = {};      // { questionKey: answerValue }
  const pickEl     = document.getElementById('decide-pick');
  const resultEl   = document.getElementById('decide-result');
  const resetBtn   = document.getElementById('decide-reset');
  const cardsRoot  = document.getElementById('decide-cards');

  // Chip clicks
  SECTION.querySelectorAll('.decide-q').forEach(fieldset => {
    const qKey = fieldset.dataset.q;
    fieldset.querySelectorAll('.decide-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        selections[qKey] = btn.dataset.v;
        // toggle active state within this fieldset
        fieldset.querySelectorAll('.decide-chip').forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        recompute();
      });
    });
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    for (const k of Object.keys(selections)) delete selections[k];
    SECTION.querySelectorAll('.decide-chip').forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    recompute();
  });

  function recompute() {
    const totals = { mirroring: 0, copyjob: 0, pipeline: 0, eventstream: 0 };
    let answered = 0;

    for (const [qKey, ans] of Object.entries(selections)) {
      if (!ans) continue;
      answered++;
      const row = SCORES[qKey] && SCORES[qKey][ans];
      if (!row) continue;
      for (const [optKey, pts] of Object.entries(row)) {
        totals[optKey] = (totals[optKey] || 0) + pts;
      }
    }

    // Determine winner (only if at least 2 answers given, to avoid premature pick)
    let winner = null;
    if (answered >= 2) {
      let best = -1;
      for (const k of KEYS) {
        if (totals[k] > best) { best = totals[k]; winner = k; }
      }
    }

    // Update cards
    cardsRoot.querySelectorAll('.decide-card').forEach(card => {
      const k = card.dataset.key;
      card.classList.toggle('is-recommended', winner === k);
      // dim non-winners a bit when a winner exists
      card.classList.toggle('is-dim', winner !== null && winner !== k);
    });

    // Update recommendation banner
    if (winner) {
      pickEl.textContent = `${LABEL[winner]} — ${REASON[winner]}`;
      resultEl.classList.add('has-pick');
      resetBtn.hidden = false;
    } else if (answered === 1) {
      pickEl.textContent = 'Answer one or two more to lock in a recommendation…';
      resultEl.classList.remove('has-pick');
      resetBtn.hidden = false;
    } else {
      pickEl.textContent = 'Answer the questions to see a recommendation';
      resultEl.classList.remove('has-pick');
      resetBtn.hidden = true;
    }
  }
})();
