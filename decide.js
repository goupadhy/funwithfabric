/* =============================================
   Help Me Decide — multi-block picker
   Block 1: Data movement (Mirroring / Copy Job / Pipelines / Eventstreams)
   Block 2: Data gateway  (On-prem OPDG / VNet / Cloud direct)
   ============================================= */
(function () {
  const SECTION = document.getElementById('help-me-decide');
  if (!SECTION) return;

  // ----- Config per decider -----
  const CONFIGS = {
    movement: {
      keys: ['mirroring', 'copyjob', 'pipeline', 'eventstream'],
      label: {
        mirroring:   'Mirroring',
        copyjob:     'Copy Job',
        pipeline:    'Copy activity in Pipelines',
        eventstream: 'Eventstreams',
      },
      reason: {
        mirroring:   'Simple, free, near-zero setup — mirrors operational data into OneLake for analytics with no transformation.',
        copyjob:     'Low-code ingestion with bulk + incremental + CDC out of the box — no pipeline to build, but still rich options.',
        pipeline:    'Full orchestration with custom transforms and multi-activity flows — you control state and incremental logic.',
        eventstream: 'Real-time ingestion and routing for streaming sources (Kafka / Event Hubs / AMQP / HTTP) with in-flight transforms.',
      },
      scores: {
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
          none:        { mirroring: 4, copyjob: 1 },
          cdc:         { copyjob: 5, mirroring: 1 },
          custom:      { pipeline: 6 },
          'stream-tx': { eventstream: 6 },
        },
        control: {
          lowest:   { mirroring: 4, copyjob: 1 },
          moderate: { copyjob: 4, eventstream: 1 },
          full:     { pipeline: 5 },
        },
      },
    },

    gateway: {
      keys: ['opdg', 'vnet', 'cloud'],
      label: {
        opdg:  'On-premises data gateway',
        vnet:  'VNet data gateway',
        cloud: 'Cloud direct connection',
      },
      reason: {
        opdg:  'Bridges Fabric to data behind your firewall — install on a Windows VM in your network and you can reach SQL Server, file shares, SAP, Oracle, and more.',
        vnet:  'Microsoft-managed gateway that reaches Azure data sources behind a VNet via subnet delegation — no VM to install or patch.',
        cloud: 'No gateway needed — connect Fabric directly to a publicly reachable cloud source (Snowflake, BigQuery, Azure SQL public, SaaS).',
      },
      scores: {
        location: {
          onprem: { opdg: 6 },
          vnet:   { vnet: 6 },
          public: { cloud: 6 },
        },
        access: {
          private: { opdg: 3, vnet: 3 },
          public:  { cloud: 4 },
        },
        mgmt: {
          run:  { opdg: 4 },
          none: { vnet: 3, cloud: 3 },
        },
        sourcekind: {
          winenterprise: { opdg: 5 },
          azurepaas:     { vnet: 5 },
          saas:          { cloud: 5 },
        },
      },
    },
  };

  // Wire up every .decide-block found in the section
  SECTION.querySelectorAll('.decide-block').forEach(block => {
    const key = block.dataset.decider;
    const cfg = CONFIGS[key];
    if (cfg) initDecider(block, cfg);
  });

  // ----- Generic decider factory -----
  function initDecider(block, cfg) {
    const pickEl    = block.querySelector('.decide-pick');
    const resultEl  = block.querySelector('.decide-result');
    const resetBtn  = block.querySelector('.decide-reset');
    const cardsRoot = block.querySelector('.decide-cards');
    if (!pickEl || !resultEl || !resetBtn || !cardsRoot) return;

    const selections = {};

    block.querySelectorAll('.decide-q').forEach(fieldset => {
      const qKey = fieldset.dataset.q;
      fieldset.querySelectorAll('.decide-chip').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          selections[qKey] = btn.dataset.v;
          fieldset.querySelectorAll('.decide-chip').forEach(b => {
            const active = b === btn;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          recompute();
        });
      });
    });

    resetBtn.addEventListener('click', () => {
      for (const k of Object.keys(selections)) delete selections[k];
      block.querySelectorAll('.decide-chip').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      recompute();
    });

    function recompute() {
      const totals = {};
      cfg.keys.forEach(k => { totals[k] = 0; });

      let answered = 0;
      for (const [qKey, ans] of Object.entries(selections)) {
        if (!ans) continue;
        answered++;
        const row = cfg.scores[qKey] && cfg.scores[qKey][ans];
        if (!row) continue;
        for (const [optKey, pts] of Object.entries(row)) {
          totals[optKey] = (totals[optKey] || 0) + pts;
        }
      }

      let winner = null;
      if (answered >= 2) {
        let best = -1;
        for (const k of cfg.keys) {
          if (totals[k] > best) { best = totals[k]; winner = k; }
        }
        if (best <= 0) winner = null;
      }

      cardsRoot.querySelectorAll('.decide-card').forEach(card => {
        const k = card.dataset.key;
        card.classList.toggle('is-recommended', winner === k);
        card.classList.toggle('is-dim', winner !== null && winner !== k);
      });

      if (winner) {
        pickEl.textContent = `${cfg.label[winner]} — ${cfg.reason[winner]}`;
        resultEl.classList.add('has-pick');
        resetBtn.hidden = false;
      } else if (answered >= 1) {
        pickEl.textContent = 'Answer one or two more to lock in a recommendation…';
        resultEl.classList.remove('has-pick');
        resetBtn.hidden = false;
      } else {
        pickEl.textContent = 'Answer the questions to see a recommendation';
        resultEl.classList.remove('has-pick');
        resetBtn.hidden = true;
      }
    }
  }
})();
