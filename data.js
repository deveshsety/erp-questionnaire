const INDUSTRIES = [
      { id: "mfg", name: "Manufacturing", w: [0.15, 0.25, 0.20, 0.15, 0.15, 0.10] },
      { id: "retail", name: "Retail & E-Comm", w: [0.15, 0.15, 0.25, 0.10, 0.20, 0.15] },
      { id: "health", name: "Healthcare & Pharma", w: [0.20, 0.20, 0.25, 0.10, 0.15, 0.10] },
      { id: "prof", name: "Prof. Services", w: [0.15, 0.10, 0.10, 0.25, 0.15, 0.25] },
      { id: "bfsi", name: "BFSI", w: [0.25, 0.15, 0.20, 0.10, 0.20, 0.10] }
    ];

    const DIMENSIONS = [
      {
        n: 1, title: "Strategy & Executive Governance",
        focus: "Executive alignment, authority & business case",
        qs: [
          "Executive leadership actively drives this project as a strategic business transformation, not an IT task.",
          "The steering committee has clear authority to resolve cross-departmental scope or budget disputes.",
          "Business case metrics, expected ROI, and success KPIs are documented and approved by executive leadership.",
          "Budget allocation includes realistic contingencies for software, implementation, training, and operational backfills.",
          "The executive team actively supports adopting standard software functionality over custom code."
        ]
      },
      {
        n: 2, title: "Business Process Maturity",
        focus: "Standardized workflows & cross-functional handoffs",
        qs: [
          "Core end-to-end operational workflows (e.g., Procure-to-Pay, Order-to-Cash) are fully documented.",
          "Processes are standardized across all business units, regional branches, and subsidiaries.",
          "Operational handoffs between functional departments occur smoothly without informal workarounds.",
          "Process owners are formally assigned and held accountable for workflow performance.",
          "Key stakeholders are open to re-engineering legacy workflows to match industry best practices."
        ]
      },
      {
        n: 3, title: "Data Management & Quality",
        focus: "Master data cleanliness, governance & single source of truth",
        qs: [
          "Master data (Customer, Vendor, SKU/Item Master, Chart of Accounts) is deduplicated and cleaned.",
          "Formal data governance rules exist defining clear ownership for data creation and maintenance.",
          "Historical data retention strategy is defined (what to migrate vs. what to archive).",
          "Operational and financial reporting relies on a single source of truth rather than disparate spreadsheets.",
          "Data structures across existing legacy systems are well-mapped and standardized."
        ]
      },
      {
        n: 4, title: "People, Culture & Change Management",
        focus: "Digital readiness, leadership support & change enablement",
        qs: [
          "A dedicated Organizational Change Management (OCM) and internal communication plan is in place.",
          "Mid-level managers actively support new system adoption and operational change.",
          "Employees across departments demonstrate high digital literacy and adaptability to new tools.",
          "Structured end-user training programs and documentation are planned and budgeted for.",
          "Cross-departmental trust and collaboration levels are high across the organization."
        ]
      },
      {
        n: 5, title: "Technology & Architecture",
        focus: "Cloud infrastructure, API readiness & cybersecurity",
        qs: [
          "Current IT infrastructure, network stability, and security standards can support real-time cloud operations.",
          "Third-party integrations (e.g., APIs to bank portals, e-commerce, CRM) are fully cataloged.",
          "The organization has clear protocols for cybersecurity, access controls, and data protection.",
          "Legacy applications targeted for retirement or retention have been audited and prioritized.",
          "Internal IT personnel have the capacity and skill set to co-manage the solution architecture."
        ]
      },
      {
        n: 6, title: "Project Management & Capacity",
        focus: "Key SME bandwidth, PMO maturity & backfill strategies",
        qs: [
          "Critical Subject Matter Experts (SMEs) can dedicate 20%–50% of their weekly time to the ERP project.",
          "A clear plan or budget exists to backfill daily duties for core project team members.",
          "An experienced Project Manager (PMO) is assigned to track scope, budget, and risk mitigation.",
          "Key project milestones, deliverables, and sign-off criteria are defined upfront.",
          "The organization has a track record of successfully executing large-scale technology transformations."
        ]
      }
    ];

    const LEVELS = [
      {
        lv: 1, name: "Ad-Hoc", range: "1.0 – 1.8", flag: "Critical Risk", c: "var(--l1)",
        desc: "Chaotic, siloed operations. Tribal knowledge dominates. Spreadsheets drive core functions."
      },
      {
        lv: 2, name: "Defined", range: "1.9 – 2.6", flag: "High Risk", c: "var(--l2)",
        desc: "Departmental rules exist but cross-functional handoffs fail. High data duplication."
      },
      {
        lv: 3, name: "Standardized", range: "2.7 – 3.4", flag: "ERP Ready", c: "var(--l3)",
        desc: "End-to-end workflows documented. Data governance active. Change plan ready."
      },
      {
        lv: 4, name: "Integrated", range: "3.5 – 4.2", flag: "Advanced", c: "var(--l4)",
        desc: "High data integrity. Cloud-ready architecture. High digital adoption across teams."
      },
      {
        lv: 5, name: "Optimized", range: "4.3 – 5.0", flag: "Industry Leader", c: "var(--l5)",
        desc: "Continuous automation, real-time analytics, AI integration, agile execution."
      }
    ];

    const PLAYBOOK = [
      {
        lv: 1, vuln: "Severe process chaos, rampant spreadsheets, no data rules.",
        act: "Halt vendor demos. Establish an Executive Steering Committee, draft basic process flowcharts for core revenues, and run an inventory / master data deduplication audit."
      },
      {
        lv: 2, vuln: "Silo friction, custom workaround mindset, duplicate records.",
        act: "Assign process owners for end-to-end handoffs (e.g., Order-to-Cash). Launch a formal Change Management strategy and build master data governance templates."
      },
      {
        lv: 3, vuln: "SME bandwidth crunch during implementation phase.",
        act: "Green light for ERP Selection / RFP. Allocate explicit backfill budgets for key SMEs (20–50% time) and build data extraction scripts."
      },
      {
        lv: 4, vuln: "Minor integration latency or legacy system debt.",
        act: "Finalize API integration mapping, conduct mock data dry-runs, and accelerate user adoption testing (UAT) with early champion networks."
      },
      {
        lv: 5, vuln: "Over-engineering or missing cutting-edge capabilities.",
        act: "Evaluate embedded AI, process mining tools, and automated testing frameworks to maximize platform ROI from Day 1."
      }
    ];

    const ROADMAP = [
      { t: "Days 0–30", d: "Steering committee charter, baseline audit, risk register" },
      { t: "Days 31–60", d: "Process flows for core revenue chains, data dedup kickoff" },
      { t: "Days 61–90", d: "Governance templates, OCM plan, vendor demo re-gate" }
    ];

    const VERDICTS = [
      { t: "Critical Risk — Not Ready", v: "Pause all software procurement. Execute the 90-day remediation roadmap before any vendor conversation. Selecting software now would multiply customization risk, cost inflation, and project failure probability." },
      { t: "High Risk — Conditionally Not Ready", v: "Withhold the RFP. Fix silo friction, assign process owners for end-to-end handoffs, and stand up change management and master data governance before entering selection." },
      { t: "ERP Ready — Proceed to Selection", v: "Green light ERP selection / RFP. Secure explicit backfill budgets for key SMEs (20–50% time) and build data extraction scripts to protect the implementation phase." },
      { t: "Advanced — Accelerate", v: "You are ready to move fast. Finalize API integration mapping, run mock data dry-runs, and drive UAT through early champion networks to compress go-live risk." },
      { t: "Industry Leader — Optimize", v: "Maximize platform ROI from Day 1. Evaluate embedded AI, process mining tools, and automated testing frameworks rather than settling for baseline functionality." }
    ];
