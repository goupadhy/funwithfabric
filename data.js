/* =============================================
   Fun With Fabric – Microsoft Fabric Workloads
   `fabricSamples` powers the Curated Collection grid.
   `resources` powers the Useful Resources band.
   Schema preserved for script.js compatibility:
     fabricSamples[i] = { id, name, type, color, colorHex, weight, uses[], description, tags[] }
     resources[i]     = { id, title, category, description, url, icon }
   ============================================= */

const fabricSamples = [
  {
    id: 1,
    name: "Data Engineering",
    type: "Data Engineering",
    color: "Fabric Teal",
    colorHex: "#117865",
    weight: "GA",
    uses: ["Lakehouse", "Spark notebooks", "Delta tables", "ETL"],
    description:
      "Build and operate Lakehouses on OneLake with Apache Spark notebooks, jobs, and Delta-Parquet tables — the foundation for big-data engineering in Microsoft Fabric.",
    tags: ["spark", "lakehouse", "delta", "onelake"],
  },
  {
    id: 2,
    name: "Data Factory",
    type: "Data Factory",
    color: "Fabric Blue",
    colorHex: "#0364B8",
    weight: "GA",
    uses: ["Pipelines", "Copy Job", "Dataflows Gen2", "Orchestration"],
    description:
      "Cloud-scale data integration. Build pipelines, run Copy Jobs across 170+ connectors, and shape data with low-code Dataflows Gen2.",
    tags: ["integration", "copy-job", "pipelines", "dataflow"],
  },
  {
    id: 3,
    name: "Data Warehouse",
    type: "Data Warehouse",
    color: "Deep Navy",
    colorHex: "#005A9E",
    weight: "GA",
    uses: ["T-SQL", "Cross-database queries", "BI marts"],
    description:
      "A fully managed, lake-native SQL warehouse with autonomous scale-out compute, full T-SQL support, and open Delta-Parquet storage on OneLake.",
    tags: ["t-sql", "warehouse", "serverless", "delta"],
  },
  {
    id: 4,
    name: "Real-Time Intelligence",
    type: "Real-Time Intelligence",
    color: "Signal Orange",
    colorHex: "#D83B01",
    weight: "GA",
    uses: ["Eventstreams", "Eventhouse / KQL", "Real-Time Dashboards"],
    description:
      "Ingest, transform, and analyze high-volume streaming and event data using Eventstreams, Eventhouse (KQL), and Real-Time Dashboards.",
    tags: ["streaming", "kql", "eventstream", "iot"],
  },
  {
    id: 5,
    name: "Power BI",
    type: "Power BI",
    color: "Fabric Yellow",
    colorHex: "#F2C811",
    weight: "GA",
    uses: ["Reports", "Semantic models", "Direct Lake"],
    description:
      "The industry-leading BI experience — now natively reading OneLake tables with Direct Lake for blazing-fast reports without imports or DirectQuery latency.",
    tags: ["bi", "reports", "direct-lake", "semantic-model"],
  },
  {
    id: 6,
    name: "Data Science",
    type: "Data Science",
    color: "Indigo",
    colorHex: "#6B69D6",
    weight: "GA",
    uses: ["ML models", "MLflow", "SynapseML", "Notebooks"],
    description:
      "End-to-end ML on OneLake: notebooks, AutoML, SynapseML, model registry with MLflow, and one-click batch scoring back to Lakehouses.",
    tags: ["ml", "mlflow", "automl", "notebooks"],
  },
  {
    id: 7,
    name: "OneLake",
    type: "OneLake",
    color: "OneLake Teal",
    colorHex: "#0E5C4F",
    weight: "Foundation",
    uses: ["Unified storage", "Shortcuts", "Cross-cloud data"],
    description:
      "The OneDrive for data. A single SaaS data lake for the whole tenant — open Delta-Parquet, with shortcuts to ADLS Gen2, S3, GCS, and Dataverse.",
    tags: ["lake", "shortcuts", "delta", "storage"],
  },
  {
    id: 8,
    name: "Mirroring",
    type: "Mirroring",
    color: "Mirror Silver",
    colorHex: "#7A7A7A",
    weight: "GA",
    uses: ["Azure SQL DB", "Snowflake", "Cosmos DB", "PostgreSQL"],
    description:
      "Near-real-time replication of operational databases into OneLake as Delta tables — no ETL, no ingestion cost, ready for analytics in minutes.",
    tags: ["mirroring", "cdc", "replication", "delta"],
  },
  {
    id: 9,
    name: "Fabric SQL Database",
    type: "Databases",
    color: "Fabric Cobalt",
    colorHex: "#1F47B5",
    weight: "GA",
    uses: ["OLTP", "Apps", "Auto-mirrored to OneLake"],
    description:
      "A developer-friendly Azure SQL-based operational database built into Fabric — automatically mirrored to OneLake so app data is instantly analytics-ready.",
    tags: ["sql-db", "oltp", "mirroring", "apps"],
  },
  {
    id: 10,
    name: "Data Activator",
    type: "Real-Time Intelligence",
    color: "Activator Magenta",
    colorHex: "#B146C2",
    weight: "GA",
    uses: ["Detect & react", "Alerts", "Power Automate", "Teams"],
    description:
      "No-code data observability — watch streams and Power BI visuals for patterns, then trigger Teams alerts, emails, or Power Automate flows automatically.",
    tags: ["reflex", "alerts", "no-code", "events"],
  },
  {
    id: 11,
    name: "Copilot in Fabric",
    type: "AI",
    color: "Copilot Violet",
    colorHex: "#8661C5",
    weight: "GA",
    uses: ["Natural-language queries", "Code generation", "Report authoring"],
    description:
      "Generative-AI assistance across every Fabric workload — author DAX and notebooks, summarize datasets, build reports, and chat with your data.",
    tags: ["copilot", "ai", "genai", "natural-language"],
  },
  {
    id: 12,
    name: "Purview in Fabric",
    type: "Governance",
    color: "Governance Green",
    colorHex: "#107C10",
    weight: "Foundation",
    uses: ["Catalog", "Lineage", "Sensitivity labels", "DLP"],
    description:
      "Built-in governance powered by Microsoft Purview: automatic lineage, sensitivity labels, data loss prevention, and tenant-wide discovery.",
    tags: ["governance", "lineage", "purview", "security"],
  },
];

const resources = [
  {
    id: 1,
    title: "Microsoft Fabric Overview",
    category: "Get Started",
    description:
      "Official entry point — what Microsoft Fabric is, the seven workloads, and how everything sits on OneLake.",
    url: "https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview",
    icon: "🚀",
  },
  {
    id: 2,
    title: "Fabric Learning Paths",
    category: "Learn",
    description:
      "Free, role-based training on Microsoft Learn covering every Fabric workload from beginner to expert.",
    url: "https://learn.microsoft.com/en-us/training/browse/?products=fabric",
    icon: "🎓",
  },
  {
    id: 3,
    title: "DP-600: Fabric Analytics Engineer",
    category: "Certification",
    description:
      "Prep guide for the DP-600 certification — design, build, and deploy analytics solutions on Microsoft Fabric.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-600/",
    icon: "🏅",
  },
  {
    id: 4,
    title: "End-to-End Tutorials",
    category: "Tutorials",
    description:
      "Hands-on walkthroughs: Lakehouse, Data Warehouse, Real-Time Intelligence, Data Science, and Power BI — start to finish.",
    url: "https://learn.microsoft.com/en-us/fabric/fundamentals/end-to-end-tutorials",
    icon: "🛠️",
  },
  {
    id: 5,
    title: "Fabric Decision Guides",
    category: "Reference",
    description:
      "Architecture decision guides: choose between Lakehouse vs Warehouse, Copy Job vs Pipeline, Direct Lake vs Import, and more.",
    url: "https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-data-store",
    icon: "🧭",
  },
  {
    id: 6,
    title: "Fabric REST APIs",
    category: "Developers",
    description:
      "Programmatically manage workspaces, items, capacities, jobs, and Git integration via the Microsoft Fabric REST APIs.",
    url: "https://learn.microsoft.com/en-us/rest/api/fabric/articles/",
    icon: "🔌",
  },
  {
    id: 7,
    title: "Public Roadmap",
    category: "Roadmap",
    description:
      "See what's shipping next across Data Engineering, Data Factory, Real-Time Intelligence, Power BI, Data Science, and OneLake.",
    url: "https://roadmap.fabric.microsoft.com/",
    icon: "🗺️",
  },
  {
    id: 8,
    title: "Fabric Community",
    category: "Community",
    description:
      "Forums, user groups, idea voting, and Q&A with the global Microsoft Fabric community and product team.",
    url: "https://community.fabric.microsoft.com/",
    icon: "💬",
  },
  {
    id: 9,
    title: "Microsoft Fabric Blog",
    category: "News",
    description:
      "Announcements, deep dives, and best-practice posts straight from the Microsoft Fabric engineering and PM teams.",
    url: "https://blog.fabric.microsoft.com/",
    icon: "📰",
  },
  {
    id: 10,
    title: "Capacity & Pricing",
    category: "Operations",
    description:
      "Understand Fabric capacities (F-SKUs), bursting, smoothing, and how usage maps to billing across workloads.",
    url: "https://learn.microsoft.com/en-us/fabric/enterprise/licenses",
    icon: "💳",
  },
];
