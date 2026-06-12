/* =============================================
   Best Practices across Microsoft Fabric
   Renders filterable cards: per-product grouping with
   pragmatic, battle-tested guidance and Learn links.
   ============================================= */
(function () {
  const GRID   = document.getElementById('bp-grid');
  const FILTER = document.getElementById('bp-filter');
  if (!GRID || !FILTER) return;

  // ---- Product palette (matches site Fabric brand colors) ----
  const PRODUCT_META = {
    'OneLake':                { accent: '#117865', icon: 'lake' },
    'Data Engineering':       { accent: '#0078D4', icon: 'spark' },
    'Data Factory':           { accent: '#7B61FF', icon: 'pipeline' },
    'Data Warehouse':         { accent: '#0E5C4F', icon: 'warehouse' },
    'Real-Time Intelligence': { accent: '#F2C811', icon: 'bolt' },
    'Data Science':           { accent: '#A33EBF', icon: 'flask' },
    'Power BI':               { accent: '#E8A33D', icon: 'chart' },
    'Databases':              { accent: '#00B7C3', icon: 'db' },
    'Mirroring':              { accent: '#2AC2A0', icon: 'mirror' },
    'AI / Copilot':           { accent: '#5C2D91', icon: 'sparkle' },
    'Security & Governance':  { accent: '#C42B1C', icon: 'shield' },
    'Capacity & FinOps':      { accent: '#107C10', icon: 'gauge' },
    'CI/CD & DevOps':         { accent: '#444791', icon: 'branch' },
  };

  // ---- Best-practice data ----
  const PRACTICES = [
    // ---------- OneLake ----------
    { product: 'OneLake', tips: [
      { t: 'One lake per tenant, many workspaces',          d: 'Treat OneLake as a single logical data lake. Use workspaces and folders to organize domains \u2014 don\u2019t spin up parallel ADLS accounts for Fabric data.' },
      { t: 'Use shortcuts instead of copying data',         d: 'Create OneLake shortcuts to ADLS Gen2, S3, GCS, or other Fabric items to avoid duplicating storage and keep one source of truth.' },
      { t: 'Standardize on Delta-Parquet',                  d: 'Delta is the native open format. Stick with it for tables to get time travel, schema evolution, and cross-engine reads (Spark, SQL, KQL, Power BI).' },
      { t: 'Adopt the medallion pattern',                   d: 'Bronze (raw) \u2192 Silver (cleansed) \u2192 Gold (curated). Keep transformations between layers idempotent and replayable.' },
      { t: 'Optimize and vacuum regularly',                 d: 'Run OPTIMIZE on hot tables and VACUUM with a sane retention (default 7 days) to keep small files and storage costs under control.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview' },

    // ---------- Data Engineering ----------
    { product: 'Data Engineering', tips: [
      { t: 'Pick the right Spark pool size',                d: 'Start with the Starter pool for exploration; switch to custom pools sized to workload. Enable autoscale and dynamic allocation for variable jobs.' },
      { t: 'Cache the right things, not everything',        d: 'Use Spark caching only for reused intermediate DataFrames in the same session. Excessive caching wastes capacity units.' },
      { t: 'Partition by query patterns, not arrival time', d: 'Partition Delta tables by columns you filter on (date, region). Avoid high-cardinality columns and tiny partitions.' },
      { t: 'Prefer notebooks over scripts for production',  d: 'Notebooks support parameters, %run, snapshots, scheduling, and Spark Job Definitions \u2014 use them as the unit of deployment.' },
      { t: 'Use V-Order for read-heavy Delta tables',       d: 'V-Order writes Parquet in a layout optimized for Direct Lake and SQL endpoint reads. Enable it for gold-layer tables.' },
      { t: 'Manage libraries via environments',             d: 'Define custom libraries in a Spark environment item rather than %pip install in every notebook. Promote environments through dev/test/prod.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview' },

    // ---------- Data Factory ----------
    { product: 'Data Factory', tips: [
      { t: 'Pick the lightest tool that fits',              d: 'Mirroring for free DB replication \u2192 Copy Job for low-code bulk/incremental/CDC \u2192 Pipelines for orchestration \u2192 Dataflows Gen2 for self-service M-style prep.' },
      { t: 'Parameterize, don\u2019t duplicate pipelines',  d: 'Use pipeline + dataset parameters and ForEach to drive metadata-driven ingestion. One pipeline can copy 200 tables instead of 200 pipelines.' },
      { t: 'Watermark for incremental copy',                d: 'Store last-loaded high-water marks in a control table (Warehouse or SQL DB) and read/write them with Lookup + Stored Procedure activities.' },
      { t: 'Lean on staging for big copies',                d: 'Enable staging through a Lakehouse / OneLake to convert source rows to Parquet once, then load destinations in parallel.' },
      { t: 'Configure retries and timeouts deliberately',   d: 'Set activity retry = 2-3 with exponential backoff. Configure timeout shorter than the SLA so failures fail fast.' },
      { t: 'Send pipeline failures to Activator or Teams',  d: 'Use the Outlook / Teams / Activator activity to route failures \u2014 not just \u201Cit ran red.\u201D' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/data-factory/data-factory-overview' },

    // ---------- Data Warehouse ----------
    { product: 'Data Warehouse', tips: [
      { t: 'Cluster keys and statistics still matter',      d: 'Although autonomous, create/refresh statistics on large fact tables and choose distribution keys aligned with join columns.' },
      { t: 'Use Warehouse for write-heavy T-SQL',           d: 'Lakehouse SQL endpoint is read-only. If you need INSERT / UPDATE / DELETE / MERGE, use the Warehouse \u2014 not the Lakehouse SQL endpoint.' },
      { t: 'Cross-database queries with three-part names',  d: 'Query across Warehouses and Lakehouses with [database].[schema].[table] \u2014 no linked servers, no copies needed.' },
      { t: 'Adopt zero-copy clones for dev/test',           d: 'CREATE TABLE \u2026 AS CLONE OF \u2026 gives instant copies for testing schema changes without storage cost.' },
      { t: 'Capture history with system-versioned tables or SCD2 patterns', d: 'For audit needs, use temporal tables or build SCD type 2 dimensions \u2014 don\u2019t rely on Delta time travel alone for compliance history.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing' },

    // ---------- Real-Time Intelligence ----------
    { product: 'Real-Time Intelligence', tips: [
      { t: 'Pick the right destination per stream',         d: 'Eventhouse (KQL) for time-series and ad-hoc analytics; Lakehouse for long-term retention; Activator for action; Custom endpoints for fan-out.' },
      { t: 'Define your ingestion mapping up front',        d: 'Use update policies and JSON ingestion mappings in Eventhouse so messy upstream payloads land in clean, typed columns.' },
      { t: 'Use materialized views for hot aggregates',     d: 'Pre-aggregate high-cardinality streams (rolling 1m / 5m / 1h) with materialized views \u2014 dashboards stay fast as volume grows.' },
      { t: 'Set retention and caching policies explicitly', d: 'Hot cache = days you query daily; cold storage = long tail. Wrong split is the #1 cost driver in Eventhouse.' },
      { t: 'Author KQL in queryset, then promote',          d: 'Develop in a Queryset, save as a function, then reference from Real-Time Dashboards and Activator rules \u2014 single source of truth.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview' },

    // ---------- Data Science ----------
    { product: 'Data Science', tips: [
      { t: 'Track everything in MLflow from day one',       d: 'Log params, metrics, artifacts, and the model signature on every run. The built-in MLflow registry is the deployment contract.' },
      { t: 'Use AutoML to set a baseline',                  d: 'Before custom modeling, run AutoML for a quick benchmark. If your hand-tuned model can\u2019t beat it, rethink features.' },
      { t: 'Score with PREDICT, not ad-hoc loops',          d: 'Use the SynapseML PREDICT function on Spark for distributed batch scoring directly to Lakehouse tables.' },
      { t: 'Promote models through environments',           d: 'Tag models in MLflow with stage (Staging, Production) and let Pipelines fetch by alias \u2014 don\u2019t hard-code versions.' },
      { t: 'Mind PII in feature stores',                    d: 'Apply sensitivity labels and OneLake folder-level security to feature tables. Strip identifiers before training when possible.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/data-science/data-science-overview' },

    // ---------- Power BI ----------
    { product: 'Power BI', tips: [
      { t: 'Default to Direct Lake on OneLake',             d: 'Skip imports and DirectQuery when reading Fabric Lakehouses / Warehouses. Direct Lake gives import-speed reads without refreshes.' },
      { t: 'Build one shared semantic model per domain',    d: 'Avoid one model per report. A curated, certified semantic model = consistent measures across the org.' },
      { t: 'Use calculation groups and field parameters',   d: 'Drop hundreds of near-duplicate measures. Calculation groups + field parameters keep models lean and authoring fast.' },
      { t: 'Validate models with the Best Practice Analyzer', d: 'Run Tabular Editor BPA (or Fabric\u2019s built-in semantic model checks) in CI to catch perf and modeling anti-patterns.' },
      { t: 'Promote and certify carefully',                 d: 'Promoted = author vouches for it. Certified = central team verified. Reserve certification for production-grade assets.' },
      { t: 'Mind row-level security at the model layer',    d: 'Define RLS roles on the semantic model so all consuming reports inherit it \u2014 don\u2019t filter security in visuals.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview' },

    // ---------- Databases (Fabric SQL DB) ----------
    { product: 'Databases', tips: [
      { t: 'Use Fabric SQL DB for app + analytics together', d: 'OLTP writes go to SQL DB; auto-mirroring keeps an analytical copy in OneLake \u2014 no separate ETL pipeline.' },
      { t: 'Right-size with autoscale',                     d: 'Enable serverless / autoscale for variable app workloads. Reserve provisioned compute for steady-state production.' },
      { t: 'Treat schema changes as versioned migrations',  d: 'Use DACPAC / SqlPackage / dbt / Liquibase \u2014 not ad-hoc ALTER statements in the portal.' },
      { t: 'Enable Microsoft Defender for SQL',             d: 'Vulnerability assessment + advanced threat protection is one toggle. Turn it on in non-prod too.' },
      { t: 'Lean on system-versioned temporal tables',      d: 'Free, automatic row-level history is invaluable for auditing and time-machine queries.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/database/sql/overview' },

    // ---------- Mirroring ----------
    { product: 'Mirroring', tips: [
      { t: 'Use Mirroring for analytics replicas',          d: 'Mirroring lands a near-real-time, read-only copy of operational data in OneLake \u2014 free of storage and ingestion cost.' },
      { t: 'Pick selective table mirroring',                d: 'Mirror only tables that drive analytics. Avoid mirroring chatty audit tables or BLOBs you\u2019ll never query.' },
      { t: 'Monitor replication lag',                       d: 'Check the Replication status pane regularly. Treat sustained lag > minutes as an alert, not a curiosity.' },
      { t: 'Don\u2019t write to mirrored tables',           d: 'They are read-only by design. Build derived gold tables in a separate Lakehouse / Warehouse.' },
      { t: 'Pair Mirroring with shortcuts',                 d: 'Shortcut mirrored tables into other workspaces for sharing rather than re-mirroring.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/database/mirrored-database/overview' },

    // ---------- AI / Copilot ----------
    { product: 'AI / Copilot', tips: [
      { t: 'Enable Copilot at capacity, then per-workspace', d: 'Admin enables Copilot on capacities; workspace admins control which surfaces use it. Default to opt-in per domain.' },
      { t: 'Ground Copilot with curated semantic models',   d: 'Copilot answers are only as good as the model. Use certified semantic models with clear measure names and descriptions.' },
      { t: 'Add table & column descriptions',               d: 'Descriptions are prompts. Investing 30 min in metadata pays back 10x in Copilot answer quality.' },
      { t: 'Review AI Skills before publishing',            d: 'AI Skills let users chat with your data \u2014 test prompts for hallucinations, RLS leakage, and ambiguous joins before sharing.' },
      { t: 'Keep humans in the loop for sensitive answers', d: 'Use sensitivity labels to gate AI surfaces over restricted data. Never let Copilot summarize raw PII without policy review.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview' },

    // ---------- Security & Governance ----------
    { product: 'Security & Governance', tips: [
      { t: 'Workspace roles \u2260 item permissions',       d: 'Use workspace roles (Admin / Member / Contributor / Viewer) for broad access; add item-level shares only where finer control is needed.' },
      { t: 'Apply Microsoft Purview sensitivity labels',    d: 'Labels propagate from source through Lakehouses, semantic models, and Power BI exports. Set them at ingest.' },
      { t: 'Use OneLake security for row/column/folder controls', d: 'Define security at the storage layer once \u2014 it\u2019s honored by Spark, SQL endpoint, Power BI, and KQL.' },
      { t: 'Bring your own keys for regulated data',        d: 'Enable customer-managed keys (CMK) on capacities holding regulated workloads.' },
      { t: 'Audit with the Fabric activity log + Purview',  d: 'Stream activity events to Log Analytics / Sentinel for retention, and use Purview DLP policies for proactive controls.' },
      { t: 'Use private links for sensitive tenants',       d: 'Lock down ingress with private endpoints + Tenant restrictions; turn off public internet access if your data classification demands it.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/governance/governance-compliance-overview' },

    // ---------- Capacity & FinOps ----------
    { product: 'Capacity & FinOps', tips: [
      { t: 'Right-size, then autoscale',                    d: 'Start with the smallest SKU that holds peak. Use autoscale or pause/resume schedules for dev/test capacities.' },
      { t: 'Monitor with the Capacity Metrics app',         d: 'The Microsoft Fabric Capacity Metrics app shows CU consumption, throttling, and per-item attribution \u2014 install it day one.' },
      { t: 'Separate dev/test/prod capacities',             d: 'A runaway notebook in dev should never throttle production reports. Use distinct capacities, sized accordingly.' },
      { t: 'Move bursty workloads to off-peak schedules',   d: 'Schedule large Spark jobs and OPTIMIZE / VACUUM jobs off-peak to avoid stealing CU from interactive workloads.' },
      { t: 'Use reservations for steady-state',             d: 'F-SKU reservations (1-yr / 3-yr) deliver substantial savings vs. pay-as-you-go on capacities you\u2019ll keep running.' },
      { t: 'Tag everything for showback',                   d: 'Use workspace naming conventions + domains for cost attribution back to business units.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/enterprise/optimize-capacity' },

    // ---------- CI/CD & DevOps ----------
    { product: 'CI/CD & DevOps', tips: [
      { t: 'Connect workspaces to Git',                     d: 'Use Fabric Git integration (Azure DevOps or GitHub) for notebooks, pipelines, semantic models, and reports. PR reviews catch real bugs.' },
      { t: 'Use Deployment Pipelines for stages',           d: 'Promote dev \u2192 test \u2192 prod with parameter rules instead of manual exports. Capture release notes per deployment.' },
      { t: 'Externalize environment-specific values',       d: 'Use variable libraries, key vault references, and pipeline parameters \u2014 never hardcode connection strings or workspace IDs.' },
      { t: 'Run model BPA + notebook lint in CI',           d: 'Hook Tabular Editor CLI, notebookutils tests, and SqlPackage publish into your build to fail fast on regressions.' },
      { t: 'Use APIs / Fabric CLI for repeatable setup',    d: 'Workspace creation, role assignments, capacity binding \u2014 all scriptable through Fabric REST APIs and the Fabric CLI.' },
    ], learn: 'https://learn.microsoft.com/en-us/fabric/cicd/cicd-overview' },
  ];

  // ---- Tiny inline SVG icon set ----
  const ICONS = {
    lake:      '<path d="M3 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M3 21c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M12 3l4 5H8z"/>',
    spark:     '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    pipeline:  '<rect x="3" y="10" width="6" height="4"/><rect x="15" y="10" width="6" height="4"/><path d="M9 12h6"/>',
    warehouse: '<path d="M3 21V9l9-6 9 6v12"/><rect x="9" y="13" width="6" height="8"/>',
    bolt:      '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    flask:     '<path d="M9 2v7L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-11V2"/><path d="M9 2h6"/>',
    chart:     '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M3 20h18"/>',
    db:        '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/>',
    mirror:    '<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/><path d="M12 2v20"/>',
    sparkle:   '<path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
    shield:    '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>',
    gauge:     '<path d="M3 18a9 9 0 1 1 18 0"/><path d="M12 18l4-6"/>',
    branch:    '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8"/><path d="M8 6h4a4 4 0 0 1 4 4v2"/>',
  };

  function svg(name) {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.spark}</svg>`;
  }

  // ---- Render filter chips ----
  let active = 'All';
  const products = Array.from(new Set(PRACTICES.map(p => p.product)));
  const chips = ['All', ...products];

  function renderFilter() {
    FILTER.innerHTML = chips.map(label => {
      const isActive = label === active;
      const meta = PRODUCT_META[label];
      const dot = meta ? `<span class="bp-chip-dot" style="background:${meta.accent}"></span>` : '';
      return `<button type="button" class="bp-chip${isActive ? ' is-active' : ''}" data-label="${escapeAttr(label)}" aria-pressed="${isActive}">${dot}${escapeHtml(label)}</button>`;
    }).join('');
  }

  function renderGrid() {
    const list = active === 'All' ? PRACTICES : PRACTICES.filter(p => p.product === active);
    GRID.innerHTML = list.map(cardHTML).join('');
  }

  function cardHTML(p) {
    const meta = PRODUCT_META[p.product] || { accent: '#117865', icon: 'spark' };
    const tips = p.tips.map(t =>
      `<li><strong>${escapeHtml(t.t)}</strong><span>${escapeHtml(t.d)}</span></li>`
    ).join('');
    const learn = p.learn
      ? `<a class="bp-card-learn" href="${p.learn}" target="_blank" rel="noopener">Microsoft Learn \u2197</a>`
      : '';
    return `
      <article class="bp-card" style="--accent:${meta.accent};">
        <header class="bp-card-head">
          <span class="bp-card-icon">${svg(meta.icon)}</span>
          <h3>${escapeHtml(p.product)}</h3>
        </header>
        <ol class="bp-tips">${tips}</ol>
        ${learn}
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ---- Wire interactions ----
  FILTER.addEventListener('click', (e) => {
    const btn = e.target.closest('.bp-chip');
    if (!btn) return;
    active = btn.dataset.label;
    renderFilter();
    renderGrid();
  });

  // ---- Initial render ----
  renderFilter();
  renderGrid();
})();
