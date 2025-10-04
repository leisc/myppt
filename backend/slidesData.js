const slides = [
  {
    id: "intro",
    title: "AI in Cross-Country E-commerce",
    subtitle: "Scaling Global Operations with Machine Intelligence",
    layout: "title",
    content: {
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
];

const deck = {
  id: "ai-cross-country-commerce",
  title: "AI in Cross-Country E-commerce",
  subtitle: "Scaling global operations with machine intelligence",
  theme: "noir",
  slides
};

module.exports = { deck, slides };
