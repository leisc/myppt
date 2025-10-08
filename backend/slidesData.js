const slides = [
  {
    id: "cover",
    title: "AI in Cross-Country E-commerce",
    subtitle: "Scaling Global Operations with Machine Intelligence",
    layout: "cover",
    content: {
      tagline: "Prepared for your team — concise briefing"
    },
    notes: "Quickly introduce the deck and objectives."
  },
  {
    id: "intro",
    title: "AI in Cross-Country E-commerce",
    subtitle: "Scaling Global Operations with Machine Intelligence",
    layout: "text",
    content: {
      items: ["[Your SaaS Logo Here]"],
      tagline: "[Your SaaS Logo Here]"
    },
    notes:
      "Open with the scale of cross-border commerce and why AI orchestration matters for every region at once."
  },
  {
    id: "global-ecommerce-matrix",
    title: "The Global E-commerce Matrix",
    subtitle: "Key Challenges AI Solves",
    layout: "bullets",
    content: {
      bullets: [
        {
          label: "Localization Lag",
          description: "Language barriers and culturally relevant messaging slow down launches."
        },
        {
          label: "Dynamic Pricing",
          description: "Currency swings and local competitors demand constant repricing."
        },
        {
          label: "Logistics Complexity",
          description: "Demand forecasting and cross-border shipping windows remain volatile."
        },
        {
          label: "Customer Experience",
          description: "24/7 support and personalization across every time zone."
        }
      ]
    },
    notes:
      "Make this slide interactive by asking which of these challenges is most painful for the audience today."
  },
  {
    id: "ai-orchestration-hub",
    title: "AI Orchestration Ecosystem",
    subtitle: "How intelligence connects every global function",
    layout: "hub",
    content: {
      core: "AI Orchestration Core",
      spokes: [
        { label: "Marketing", description: "Localized campaigns and A/B testing automation" },
        { label: "Sales", description: "Dynamic product recommendations by region" },
        { label: "Operations", description: "Forecasting and inventory optimization" },
        { label: "Support", description: "Multilingual chatbots and sentiment routing" },
        { label: "Finance", description: "Automated tax and FX reconciliation" },
        { label: "Data Science", description: "Model retraining and monitoring pipelines" }
      ]
    },
    notes:
      "Show how AI orchestrates all key business functions from a single, learning center."
  },
  {
    id: "language-barrier",
    title: "AI Challenge 1: The Language Barrier",
    layout: "two-column",
    content: {
      left: {
        subtitle: "Solution: Neural Translation",
        bullets: [
          {
            label: "Product Descriptions",
            description: "Localized tone and compliance checks before content goes live."
          },
          {
            label: "SEO",
            description: "AI generates long-tail keywords per locale for faster organic growth."
          },
          {
            label: "User Reviews",
            description: "Summaries keep merchandising teams aware of sentiment in any language."
          }
        ]
      },
      right: {
        metrics: [
          {
            value: "95%",
            label: "Drop in localization errors after rollout"
          },
          {
            value: "40+",
            label: "Languages orchestrated in parallel"
          }
        ]
      }
    },
    notes:
      "Share a customer story that highlights how translation quality drove conversion."
  },
  {
    id: "dynamic-pricing",
    title: "AI Challenge 2: Dynamic Pricing & Demand",
    layout: "two-column",
    content: {
      left: {
        metrics: [
          {
            value: "12%",
            label: "Average revenue lift from AI pricing"
          },
          {
            value: "40M+",
            label: "Automated price calibrations per day"
          }
        ]
      },
      right: {
        subtitle: "Solution: Predictive Optimization",
        bullets: [
          {
            label: "Competitor Monitoring",
            description: "Regional price changes trigger intelligent counter moves."
          },
          {
            label: "Forecasting",
            description: "Models anticipate demand spikes around holidays, weather, and news."
          },
          {
            label: "Custom Duties",
            description: "Tariffs auto-roll into the final price shown to shoppers."
          }
        ]
      }
    },
    notes:
      "Call out integrations with pricing or ERP systems the audience already uses."
  },
  {
    id: "regional-expansion-playbook",
    title: "Regional Expansion Playbook",
    subtitle: "Focus areas for the next three markets",
    layout: "three-column",
    content: {
      columns: [
        {
          title: "Market Readiness",
          items: [
            "Assess regulatory requirements",
            "Localize compliance workflows",
            "Validate demand signals with pilot data"
          ]
        },
        {
          title: "Experience Localization",
          items: [
            {
              label: "Messaging",
              description: "Translate value props with culturally relevant tone"
            },
            {
              label: "Catalog",
              description: "Adjust assortment for local preferences"
            },
            "Automate in-language support responses"
          ]
        },
        {
          title: "Operational Scaling",
          items: [
            "Sync inventory and fulfillment SLAs",
            "Instrument KPIs and alerting for each region",
            "Enable multi-currency billing & tax automation"
          ]
        }
      ]
    },
    notes:
      "Use this slide to assign swim-lane owners across GTM, product, and operations."
  },
  {
    id: "ai-performance-radar",
    title: "AI Capability Performance",
    subtitle: "Benchmarking across global operations",
    layout: "radar",
    content: {
      axes: ["Translation Quality", "Demand Forecast", "Dynamic Pricing", "Personalization", "Support Automation"],
      values: [85, 80, 90, 70, 75],
      maxValue: 100
    },
    notes:
      "Use this to show which AI capabilities are strongest and where next investments should go."
  },
  {
    id: "maturity-pyramid",
    title: "AI Maturity Model",
    subtitle: "Path to global AI excellence",
    layout: "pyramid",
    content: {
      levels: [
        {
          title: "Level 1 — Automation",
          description: "Task-level efficiency using rules and scripts."
        },
        {
          title: "Level 2 — Intelligence",
          description: "Predictive analytics embedded into regional workflows."
        },
        {
          title: "Level 3 — Orchestration",
          description: "Coordinated, adaptive AI across all markets and functions."
        }
      ]
    },
    notes:
      "Explain how clients move from local pilots to enterprise-wide orchestration."
  },
  {
    id: "ai-rollout-flow",
    title: "Intelligent Rollout Lifecycle",
    subtitle: "End-to-end flow of AI enablement",
    layout: "flow",
    content: {
      steps: [
        { title: "Assess", description: "Identify regional readiness and AI gaps" },
        { title: "Configure", description: "Tune language, pricing, and logistics models" },
        { title: "Deploy", description: "Launch pilot markets with control dashboards" },
        { title: "Measure", description: "Track KPIs and retrain models continuously" }
      ]
    },
    notes:
      "Use this to emphasize continuous improvement and measurable ROI."
  },
  {
    id: "rollout-timeline",
    title: "90-Day Intelligent Rollout",
    subtitle: "Structured phases to launch and learn",
    layout: "timeline",
    content: {
      phases: [
        {
          phase: "Phase 1",
          title: "Discover & Align",
          activities: [
            "Executive kickoff & goal setting",
            "Audit data coverage and integrations",
            "Define localization success metrics"
          ]
        },
        {
          phase: "Phase 2",
          title: "Configure & Train",
          activities: [
            "Deploy translation & pricing models",
            "Run playbooks on sandbox orders",
            "Enable success teams with guided flows"
          ]
        },
        {
          phase: "Phase 3",
          title: "Launch & Optimize",
          activities: [
            "Soft launch in two priority markets",
            "Monitor leading indicators & feedback",
            "Iterate pricing guardrails every week"
          ]
        }
      ]
    },
    notes: "Highlight milestones and owners, then align on exit criteria before full rollout."
  }
  ,
  {
    id: "product-visual",
    title: "Product Experience Snapshot",
    subtitle: "Visual tour of the user flow",
    layout: "image-left",
    content: {
      image: {
        src: "./1.png",
        alt: "Product screenshot or concept art"
      },
      caption: "Overview of the storefront and localized checkout",
      text: {
        heading: "Local checkout in action",
        bullets: [
          { label: "Localized UX", description: "Region-specific pricing and labels" },
          { label: "Auto-currency", description: "Display prices in local currencies" }
        ]
      }
    },
    notes: "Use this slide to point out UX patterns and localization features."
  },
  {
    id: "hero-image",
    title: "AI-Powered Insights",
    subtitle: "Data-driven personalization",
    layout: "image-center",
    content: {
      image: {
        src: "./1.jpeg",
        alt: "Illustration representing insights"
      },
      caption: "Models run continuously to personalize the storefront"
    },
    notes: "A strong visual to break up dense content and re-engage the audience."
  }
];

const deck = {
  id: "ai-cross-country-commerce",
  title: "AI in Cross-Country E-commerce",
  subtitle: "Scaling global operations with machine intelligence",
  theme: "noir",
  slides
};

module.exports = { deck, slides };
