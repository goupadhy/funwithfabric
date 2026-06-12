/* =============================================
   Fabric Advisor – simple client-side chatbot
   Uses fabricSamples from data.js. No backend.
   ============================================= */
(function () {
  'use strict';

  // ---------- Microsoft Fabric platform Q&A ----------
  // Each entry: keywords (used for scoring) + html answer + optional follow-up chips.
  const FABRIC_TOPICS = [
    {
      id: 'copy-job',
      keywords: ['copy job', 'copyjob', 'copy-job'],
      html:
        '<strong>Copy Job</strong> is a Microsoft Fabric Data Factory item designed for simple, code-free <em>data movement</em> between sources and destinations.<br><br>' +
        '<strong>Key traits</strong><br>' +
        '• Built for ingestion — no transformations or orchestration logic.<br>' +
        '• Supports <em>full</em> and <em>incremental</em> copy patterns.<br>' +
        '• Works with many cloud and on-prem connectors via gateways.<br>' +
        '• Lighter and faster to author than a full Data Pipeline for plain copy work.<br><br>' +
        '<strong>When to use it</strong><br>' +
        '• Bring data into OneLake / a Lakehouse / Warehouse on a schedule.<br>' +
        '• Incremental loads from a source table using a watermark column.<br>' +
        '• You don’t need branching, conditional logic, or multi-activity flows.<br><br>' +
        '<strong>When to pick a Data Pipeline instead</strong>: you need conditional branches, looping, parameterized child pipelines, or activities beyond copy (Notebook, Stored Procedure, Dataflow, etc.).',
      chips: ['Copy Job vs Data Pipeline', 'On-prem vs VNet data gateway', 'What is OneLake?'],
    },
    {
      id: 'copy-job-vs-pipeline',
      keywords: ['copy job vs pipeline', 'copy job or pipeline', 'data pipeline vs copy job', 'pipeline vs copy job'],
      html:
        '<strong>Copy Job vs Data Pipeline</strong><br><br>' +
        '<strong>Copy Job</strong> — single-purpose copy tool. Pick it when the task is <em>just move data</em>, optionally incremental, with no branching.<br><br>' +
        '<strong>Data Pipeline</strong> — orchestrator. Pick it when you need:<br>' +
        '• Multiple activities (Copy + Notebook + Stored Procedure + Dataflow).<br>' +
        '• Conditional branches (If/Switch) or loops (ForEach/Until).<br>' +
        '• Parameters, variables, expressions, dependency chains.<br>' +
        '• Calling child pipelines or external services.<br><br>' +
        'Rule of thumb: start with Copy Job; graduate to a Data Pipeline once you need more than “copy from A to B”.',
      chips: ['What is Copy Job?', 'What is a Dataflow Gen2?', 'On-prem vs VNet data gateway'],
    },
    {
      id: 'gateway-comparison',
      keywords: [
        'onprem vs vnet', 'on-prem vs vnet', 'on prem vs vnet',
        'gateway vs', 'data gateway vs', 'vnet data gateway',
        'on-premises data gateway', 'onprem data gateway', 'on premises data gateway',
        'when to use gateway', 'which gateway', 'gateway comparison',
      ],
      html:
        '<strong>On-premises data gateway vs VNet data gateway</strong><br><br>' +
        '<strong>On-premises data gateway</strong> — software you install on a Windows machine inside your corporate network. It bridges Fabric / Power BI / Logic Apps to data that lives <em>behind your firewall</em>.<br>' +
        '• Use it for: SQL Server on-prem, Oracle, SAP, file shares, REST APIs reachable only from inside your network.<br>' +
        '• You manage the host VM, updates, and high availability (cluster nodes).<br><br>' +
        '<strong>Virtual network (VNet) data gateway</strong> — a <em>fully managed</em> gateway provisioned by Microsoft into your Azure VNet. No VM to maintain.<br>' +
        '• Use it for: Azure data sources locked down with <em>private endpoints</em> or accessible only from a VNet (Azure SQL DB, Synapse, Storage, Key Vault, Azure Databricks).<br>' +
        '• No on-prem network involved — it lives entirely in Azure.<br><br>' +
        '<strong>Quick decision</strong><br>' +
        '• Source is in your data center → <strong>on-prem gateway</strong>.<br>' +
        '• Source is Azure with public endpoints → <strong>no gateway needed</strong>.<br>' +
        '• Source is Azure but private (private endpoint / VNet only) → <strong>VNet gateway</strong>.<br>' +
        '• Mix of both → use both, in their respective scenarios.',
      chips: ['What is Copy Job?', 'What is OneLake?', 'What is a Dataflow Gen2?'],
    },
    {
      id: 'onelake',
      keywords: ['onelake', 'one lake', 'what is onelake'],
      html:
        '<strong>OneLake</strong> is the single, tenant-wide data lake built into Microsoft Fabric — think “OneDrive for data”.<br><br>' +
        '• One copy of data accessible to every Fabric workload (Lakehouse, Warehouse, Power BI, Real-Time, Data Science).<br>' +
        '• Open Delta Parquet format under the hood.<br>' +
        '• <em>Shortcuts</em> let you reference data in ADLS Gen2, Amazon S3, or Google Cloud Storage without copying.<br>' +
        '• Security and governance flow through the Fabric workspace model.',
      chips: ['Lakehouse vs Warehouse', 'What is a shortcut?', 'What is Direct Lake?'],
    },
    {
      id: 'lakehouse-vs-warehouse',
      keywords: ['lakehouse vs warehouse', 'warehouse vs lakehouse', 'lakehouse or warehouse'],
      html:
        '<strong>Lakehouse vs Warehouse in Fabric</strong><br><br>' +
        '<strong>Lakehouse</strong> — files + tables on OneLake. Spark / Notebook first, schema-on-read, great for data engineering, unstructured + structured data, ML.<br><br>' +
        '<strong>Warehouse</strong> — fully managed T-SQL data warehouse. Multi-table transactions, stored procedures, classic BI workloads.<br><br>' +
        'Both store data in OneLake as Delta tables, so Power BI can query either through Direct Lake.',
      chips: ['What is Direct Lake?', 'What is OneLake?', 'What is a Dataflow Gen2?'],
    },
    {
      id: 'direct-lake',
      keywords: ['direct lake', 'directlake'],
      html:
        '<strong>Direct Lake</strong> is a Power BI semantic-model storage mode unique to Fabric. It reads Delta Parquet files in OneLake <em>directly</em>, with no import refresh and no DirectQuery round-trip per visual.<br><br>' +
        '• Fast like Import, fresh like DirectQuery.<br>' +
        '• Falls back to DirectQuery if a query exceeds capacity limits (guardrails).<br>' +
        '• Requires a Lakehouse or Warehouse as the data source.',
      chips: ['Lakehouse vs Warehouse', 'What is OneLake?'],
    },
    {
      id: 'dataflow-gen2',
      keywords: ['dataflow gen2', 'dataflow gen 2', 'gen2 dataflow', 'what is dataflow'],
      html:
        '<strong>Dataflow Gen2</strong> is Power Query in the cloud — a low-code way to ingest and transform data, then land it in a destination (Lakehouse, Warehouse, KQL DB, Azure SQL).<br><br>' +
        '• Familiar Power Query M experience.<br>' +
        '• Good when transformations are needed and authors prefer a visual UI over code.<br>' +
        '• Heavier than Copy Job, lighter than a full Spark notebook.',
      chips: ['Copy Job vs Data Pipeline', 'What is a Notebook?'],
    },
    {
      id: 'shortcut',
      keywords: ['what is a shortcut', 'onelake shortcut', 'shortcuts in fabric'],
      html:
        '<strong>OneLake shortcuts</strong> are references to data that lives elsewhere — another Fabric workspace, ADLS Gen2, Amazon S3, GCS, or a Dataverse table.<br><br>' +
        '• No data is copied — reads are virtualized.<br>' +
        '• Great for unifying data across clouds and reusing curated datasets across workspaces.',
      chips: ['What is OneLake?', 'Lakehouse vs Warehouse'],
    },
    {
      id: 'medallion',
      keywords: [
        'medallion', 'bronze silver gold', 'bronze/silver/gold',
        'lakehouse architecture', 'medallion architecture', 'medallion lakehouse',
      ],
      html:
        '<strong>Medallion lakehouse architecture</strong> is the recommended design pattern for Microsoft Fabric on OneLake. It organizes data into three quality layers:<br><br>' +
        '• <strong>Bronze (Raw)</strong> — land data exactly as it arrives. Source of truth, no changes.<br>' +
        '• <strong>Silver (Enriched)</strong> — clean, conform, deduplicate, join across sources.<br>' +
        '• <strong>Gold (Curated)</strong> — business-ready aggregates and marts for BI / ML.<br><br>' +
        'All three layers are typically stored as Delta tables in OneLake. A common deployment is one Lakehouse per layer (or Lakehouse for Bronze/Silver and Warehouse for Gold), each in its own workspace for governance.<br><br>' +
        'See: <a href="https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture" target="_blank" rel="noopener noreferrer">Medallion lakehouse architecture on Microsoft Learn ↗</a>',
      chips: ['What is OneLake?', 'Lakehouse vs Warehouse', 'What is Direct Lake?'],
    },
  ];

  // ---------- Textile knowledge base ----------
  const TYPE_INFO = {
    Cotton: {
      summary:
        'Cotton is a soft, breathable plant fiber. Easy to sew, machine-washable, and very beginner-friendly. Comes in many weights — from sheer lawn to heavy denim and canvas.',
      best_for: ['shirts', 'dresses', 'quilts', 'bags', 'kids clothes'],
      care: 'Machine wash cool to warm. Tumble dry low. Expect some shrinkage on the first wash — prewash before cutting.',
    },
    Linen: {
      summary:
        'Linen is a strong, breathable fiber from the flax plant. Crisp hand, beautiful drape, and softens with each wash. Wrinkles freely — embrace it.',
      best_for: ['summer apparel', 'tablecloths', 'curtains', 'bags'],
      care: 'Machine wash cool, line dry or tumble dry low. Iron while slightly damp for crisp finish.',
    },
    Silk: {
      summary:
        'Silk is a luxurious natural protein fiber with beautiful sheen and drape. Lightweight, temperature-regulating, but delicate to sew.',
      best_for: ['blouses', 'evening wear', 'linings', 'scarves'],
      care: 'Hand-wash cold with mild detergent or dry-clean. Roll in towel — never wring. Iron low, on the wrong side.',
    },
    Wool: {
      summary:
        'Wool is a warm, resilient animal fiber. Great structure and insulation; many weights from fine suiting to dense coating.',
      best_for: ['coats', 'jackets', 'trousers', 'blankets'],
      care: 'Dry-clean for tailored items, or hand-wash gently in cool water with wool detergent. Lay flat to dry.',
    },
    Knit: {
      summary:
        'Knit fabrics stretch in one or both directions, making them comfortable and forgiving. Sew with a ballpoint needle and stretch stitch (or serger).',
      best_for: ['t-shirts', 'leggings', 'dresses', 'activewear'],
      care: 'Machine wash cool, tumble dry low or lay flat. Avoid high heat to preserve elasticity.',
    },
    Velvet: {
      summary:
        'Velvet has a dense pile that catches light beautifully. Heavier and tricky to sew — pin within the seam allowance and use a walking foot.',
      best_for: ['evening wear', 'pillows', 'drapery'],
      care: 'Dry-clean preferred. If washable, hand-wash cold and air-dry pile-side-up.',
    },
    Synthetic: {
      summary:
        'Synthetics (polyester, nylon, fleece, etc.) are durable, easy-care, and resistant to wrinkles. Great for activewear and cold-weather projects.',
      best_for: ['activewear', 'jackets', 'blankets', 'bags'],
      care: 'Machine wash cool to warm, tumble dry low. Avoid high heat — fibers can melt.',
    },
  };

  // Project → keywords map used to score fabrics
  const PROJECT_KEYWORDS = {
    'summer dress':    ['summer', 'breathable', 'light', 'dress'],
    'winter coat':     ['warm', 'coat', 'wool', 'heavy', 'outerwear', 'winter'],
    'baby clothes':    ['soft', 'organic', 'cotton', 'breathable', "children", 'kids', 'baby'],
    "kids' clothes":   ['soft', 'organic', 'cotton', "children's wear", 'kids'],
    'jeans':           ['denim', 'jeans', 'heavy', 'durable'],
    't-shirt':         ['knit', 'jersey', 'stretchy', 't-shirt'],
    'blouse':          ['blouse', 'light', 'silk', 'lawn', 'poplin'],
    'curtains':        ['drapery', 'home decor', 'heavy', 'velvet', 'linen'],
    'upholstery':      ['upholstery', 'durable', 'heavy', 'canvas', 'velvet'],
    'bag':             ['bag', 'durable', 'sturdy', 'canvas', 'denim'],
    'quilt':           ['quilting', 'cotton', 'beginner-friendly'],
    'evening wear':    ['evening', 'formal', 'luxury', 'silk', 'velvet'],
    'activewear':      ['activewear', 'stretchy', 'knit', 'synthetic'],
  };

  // ---------- Utilities ----------
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function normalize(s) {
    return String(s || '').toLowerCase();
  }

  // ---------- Search / scoring ----------
  function scoreFabricFor(fabric, keywords) {
    const haystack = [
      fabric.name,
      fabric.type,
      fabric.color,
      fabric.weight,
      ...(fabric.uses || []),
      ...(fabric.tags || []),
      fabric.description,
    ].map(normalize).join(' | ');

    let score = 0;
    for (const kw of keywords) {
      const k = normalize(kw);
      if (!k) continue;
      // weighted: tag/use exact match > word in description
      if ((fabric.tags || []).some(t => normalize(t) === k)) score += 4;
      else if ((fabric.uses || []).some(u => normalize(u).includes(k))) score += 3;
      else if (normalize(fabric.type) === k) score += 3;
      else if (normalize(fabric.name).includes(k)) score += 2;
      else if (haystack.includes(k)) score += 1;
    }
    return score;
  }

  function topFabrics(keywords, n = 3) {
    if (typeof fabricSamples === 'undefined') return [];
    const scored = fabricSamples
      .map(f => ({ f, s: scoreFabricFor(f, keywords) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, n);
    return scored.map(x => x.f);
  }

  // ---------- Intent detection ----------
  function detectIntent(text) {
    const t = normalize(text).trim();
    if (!t) return { kind: 'empty' };

    // Microsoft Fabric platform topics take precedence
    const topicHit = matchFabricTopic(t);
    if (topicHit) return { kind: 'platform', topic: topicHit };

    // Greetings
    if (/^(hi|hello|hey|yo|hiya|howdy|good\s*(morning|afternoon|evening))\b/.test(t)) {
      return { kind: 'greeting' };
    }

    // Thanks
    if (/\b(thanks|thank you|thx|ty)\b/.test(t)) {
      return { kind: 'thanks' };
    }

    // Care
    if (/\b(care|wash|clean|laundry|shrink|iron)\b/.test(t)) {
      const type = matchType(t);
      return { kind: 'care', type };
    }

    // Beginner
    if (/\b(beginner|new|starter|easy|easiest|simple)\b/.test(t)) {
      return { kind: 'beginner' };
    }

    // Explain a fabric type
    const type = matchType(t);
    if (type && /\b(what is|tell me|about|explain|info on)\b/.test(t)) {
      return { kind: 'explain', type };
    }

    // Recommendation
    if (/\b(recommend|suggest|best|good|what should|help me|need|looking for|use for|for a |for an |for my)\b/.test(t)) {
      return { kind: 'recommend', query: t };
    }

    // Compare
    const compare = t.match(/(cotton|linen|silk|wool|knit|velvet|synthetic|denim)\s+(vs|versus|or)\s+(cotton|linen|silk|wool|knit|velvet|synthetic|denim)/);
    if (compare) {
      return { kind: 'compare', a: titleCase(compare[1]), b: titleCase(compare[3]) };
    }

    // If a known type is mentioned, treat as explain
    if (type) return { kind: 'explain', type };

    // Fallback: try to interpret as recommendation
    return { kind: 'recommend', query: t };
  }

  function matchType(text) {
    const types = Object.keys(TYPE_INFO);
    for (const ty of types) if (normalize(text).includes(normalize(ty))) return ty;
    if (/\bdenim\b/.test(text)) return 'Cotton';
    if (/\bjersey\b/.test(text)) return 'Knit';
    if (/\bfleece\b/.test(text)) return 'Synthetic';
    return null;
  }

  // Pick the highest-scoring Fabric platform topic, if any.
  function matchFabricTopic(t) {
    let best = null;
    let bestScore = 0;
    for (const topic of FABRIC_TOPICS) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (t.includes(kw)) score += kw.split(' ').length; // longer phrase = stronger match
      }
      if (score > bestScore) { bestScore = score; best = topic; }
    }
    return bestScore > 0 ? best : null;
  }

  function titleCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  // ---------- Response renderers ----------
  function fabricCardHtml(f) {
    const swatch = f.colorHex || '#cccccc';
    return `
      <div class="bot-fabric-card">
        <div class="bot-fabric-swatch" style="background:${escapeHtml(swatch)}"></div>
        <div class="bot-fabric-body">
          <div class="bot-fabric-name">${escapeHtml(f.name)}</div>
          <div class="bot-fabric-meta">${escapeHtml(f.type)} · ${escapeHtml(f.weight)} weight · ${escapeHtml(f.color)}</div>
          <div class="bot-fabric-desc">${escapeHtml(f.description)}</div>
          <div class="bot-fabric-uses">${(f.uses || []).slice(0, 4).map(u => `<span class="bot-tag">${escapeHtml(u)}</span>`).join('')}</div>
        </div>
      </div>`;
  }

  function answer(intent) {
    switch (intent.kind) {
      case 'greeting':
        return {
          html: `Hi! I'm the <strong>Fabric Advisor</strong>. Ask me anything like:<br>
                 <em>"What is Copy Job?"</em> or <em>"When to use on-prem data gateway vs VNet data gateway?"</em>`,
          chips: defaultChips(),
        };

      case 'platform':
        return { html: intent.topic.html, chips: intent.topic.chips || defaultChips() };

      case 'thanks':
        return { html: `You're welcome! Happy sewing 🪡`, chips: defaultChips() };

      case 'beginner': {
        const list = (typeof fabricSamples !== 'undefined' ? fabricSamples : [])
          .filter(f => (f.tags || []).includes('beginner-friendly'))
          .slice(0, 3);
        if (!list.length) return { html: 'Try a medium-weight cotton — easy to sew and forgiving.' };
        return {
          html: `Great picks for a beginner. They're forgiving to cut, pin, and stitch:<br>${list.map(fabricCardHtml).join('')}`,
        };
      }

      case 'explain': {
        const info = TYPE_INFO[intent.type];
        if (!info) return { html: `I don't have detailed info on that fabric type yet.` };
        const samples = (typeof fabricSamples !== 'undefined' ? fabricSamples : [])
          .filter(f => f.type === intent.type).slice(0, 2);
        return {
          html: `<strong>${escapeHtml(intent.type)}</strong> — ${escapeHtml(info.summary)}<br>
                 <em>Best for:</em> ${info.best_for.map(escapeHtml).join(', ')}.<br>
                 <em>Care:</em> ${escapeHtml(info.care)}
                 ${samples.length ? `<br><br>From our catalog:${samples.map(fabricCardHtml).join('')}` : ''}`,
          chips: ['Care tips', 'Recommend for a dress', 'Beginner picks'],
        };
      }

      case 'care': {
        if (intent.type && TYPE_INFO[intent.type]) {
          return {
            html: `<strong>Caring for ${escapeHtml(intent.type)}:</strong> ${escapeHtml(TYPE_INFO[intent.type].care)}`,
            chips: ['Tell me about ' + intent.type, 'Beginner picks'],
          };
        }
        return {
          html: `Tell me which fabric — for example, <em>"how do I care for silk?"</em><br>` +
                Object.keys(TYPE_INFO).map(t => `<span class="bot-chip-inline">${t}</span>`).join(' '),
          chips: Object.keys(TYPE_INFO).map(t => 'Care for ' + t),
        };
      }

      case 'compare': {
        const a = TYPE_INFO[intent.a], b = TYPE_INFO[intent.b];
        if (!a || !b) return { html: `I can compare Cotton, Linen, Silk, Wool, Knit, Velvet, Synthetic.` };
        return {
          html: `<strong>${escapeHtml(intent.a)}</strong>: ${escapeHtml(a.summary)}<br><br>
                 <strong>${escapeHtml(intent.b)}</strong>: ${escapeHtml(b.summary)}`,
          chips: ['Recommend for a dress', 'Care tips', 'Beginner picks'],
        };
      }

      case 'recommend': {
        const q = intent.query;
        // Try matching a known project phrase first
        let keywords = [];
        for (const project in PROJECT_KEYWORDS) {
          if (q.includes(project) || project.split(' ').every(w => q.includes(w))) {
            keywords = PROJECT_KEYWORDS[project];
            break;
          }
        }
        // Fall back: use all meaningful words from the query
        if (!keywords.length) {
          keywords = q
            .replace(/[^a-z0-9\s-]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !STOP_WORDS.has(w));
        }
        const hits = topFabrics(keywords, 3);
        if (!hits.length) {
          return {
            html: `I couldn't find a strong match. Try naming the project (e.g. <em>"jeans"</em>, <em>"summer dress"</em>, <em>"curtains"</em>) or a fabric type.`,
            chips: defaultChips(),
          };
        }
        return {
          html: `Here are a few good options:${hits.map(fabricCardHtml).join('')}`,
          chips: ['Care tips', 'Beginner picks', 'Suggest another'],
        };
      }

      case 'empty':
      default:
        return { html: `I didn't catch that — try asking about a fabric type or a project.`, chips: defaultChips() };
    }
  }

  const STOP_WORDS = new Set([
    'the','a','an','and','or','but','for','to','of','in','on','at','with','what',
    'good','best','should','use','using','need','help','please','make','sew',
    'fabric','recommend','suggest','some','that','this','any','about','from',
    'how','do','can','i','my','our','is','are','it','they','want','would','like','one',
  ]);

  function defaultChips() {
    return [
      'What is Copy Job?',
      'On-prem vs VNet data gateway',
      'Lakehouse vs Warehouse',
      'What is OneLake?',
    ];
  }

  // ---------- UI ----------
  let panelOpen = false;
  let panel, log, input, fab;

  function buildUI() {
    fab = el(`
      <button id="fab-advisor" class="fab-advisor" type="button" aria-label="Open Fabric Advisor chat">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
          <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
        </svg>
        <span>Ask Fabric Advisor</span>
      </button>`);

    panel = el(`
      <section id="advisor-panel" class="advisor-panel" role="dialog" aria-label="Fabric Advisor" aria-hidden="true">
        <header class="advisor-header">
          <div class="advisor-title">
            <span class="advisor-avatar" aria-hidden="true">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="advisor-ribbon" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#2AC2A0"/>
                    <stop offset="55%" stop-color="#117865"/>
                    <stop offset="100%" stop-color="#0E5C4F"/>
                  </linearGradient>
                </defs>
                <path fill="url(#advisor-ribbon)" d="M9 4h14a2 2 0 0 1 2 2v6l-7 4 7 4v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
              </svg>
            </span>
            <div>
              <div class="advisor-name">Fabric Advisor</div>
              <div class="advisor-sub">Tips, recommendations, and care</div>
            </div>
          </div>
          <button class="advisor-close" type="button" aria-label="Close chat">×</button>
        </header>
        <div class="advisor-log" id="advisor-log" aria-live="polite"></div>
        <form class="advisor-input" id="advisor-form" autocomplete="off">
          <input id="advisor-input" type="text" placeholder="Ask about fabrics…" aria-label="Your message" maxlength="300" />
          <button type="submit" class="advisor-send" aria-label="Send">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="m3 11 18-8-8 18-2-8-8-2Z"/>
            </svg>
          </button>
        </form>
        <div class="advisor-footnote">Runs locally in your browser — no data sent anywhere.</div>
      </section>`);

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    log = panel.querySelector('#advisor-log');
    input = panel.querySelector('#advisor-input');

    fab.addEventListener('click', togglePanel);
    panel.querySelector('.advisor-close').addEventListener('click', closePanel);
    panel.querySelector('#advisor-form').addEventListener('submit', onSubmit);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panelOpen) closePanel();
    });
  }

  function togglePanel() {
    panelOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    panelOpen = true;
    if (!log.children.length) {
      addBotMessage(answer({ kind: 'greeting' }));
    }
    setTimeout(() => input.focus(), 120);
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    panelOpen = false;
  }

  function onSubmit(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    // brief "typing" indicator
    const typing = el('<div class="msg msg-bot msg-typing"><span></span><span></span><span></span></div>');
    log.appendChild(typing);
    scrollToBottom();
    setTimeout(() => {
      typing.remove();
      addBotMessage(answer(detectIntent(text)));
    }, 350);
  }

  function addUserMessage(text) {
    log.appendChild(el(`<div class="msg msg-user">${escapeHtml(text)}</div>`));
    scrollToBottom();
  }

  function addBotMessage({ html, chips }) {
    const wrap = el(`<div class="msg msg-bot">${html}</div>`);
    log.appendChild(wrap);
    if (chips && chips.length) {
      const chipsEl = el('<div class="msg-chips"></div>');
      chips.forEach(c => {
        const b = el(`<button type="button" class="msg-chip">${escapeHtml(c)}</button>`);
        b.addEventListener('click', () => {
          input.value = c;
          input.form.requestSubmit();
        });
        chipsEl.appendChild(b);
      });
      log.appendChild(chipsEl);
    }
    scrollToBottom();
  }

  function scrollToBottom() {
    log.scrollTop = log.scrollHeight;
  }

  // ---------- Init ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
