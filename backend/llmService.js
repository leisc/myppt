const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiBaseUrl = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

let openaiClient = null;

if (openaiApiKey) {
  openaiClient = new OpenAI({ apiKey: openaiApiKey, baseURL: openaiBaseUrl });
}

const buildSystemPrompt = () => `You are an expert sales enablement designer.
Create concise slide decks in JSON following this schema:
{
  "title": string,
  "subtitle": string,
  "slides": [
    {
      "id": kebab-case string,
      "title": string,
      "subtitle"?: string,
      "layout": "title" | "bullets" | "two-column" | "three-column" | "timeline",
      "content": object matching the layout,
      "notes"?: string
    }
  ]
}

Rules:
- Provide 4 to 8 slides covering the storyline: problem, solution, metrics, next steps.
- For "title" layout, include { "tagline": string } inside content.
- For "bullets", include { "bullets": [{ "label": string, "description": string }] }.
- For "two-column", include { "left": {"subtitle"?, "bullets"?, "metrics"?}, "right": { ... } } with metrics array of { value, label }.
- For "three-column", include { "columns": [{ "title": string, "items": [string | { "label": string, "description": string }] }] }.
- For "timeline", include { "phases": [{ "phase": string, "title": string, "activities": [string] }] } describing sequential phases.
- Ensure all strings are plain text (no markdown).
- Keep slides engaging, business-focused, and aligned with the given context.
- Return only JSON; do not wrap in markdown.`;

const stubDeckFromPrompt = (prompt, { title, subtitle } = {}) => {
  const context = [title, subtitle, prompt].filter(Boolean).join(" - ");
  const topic = context.trim() ? context.trim() : "AI Strategy";
  const baseId = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60) || "generated-deck";

  const slides = [
    {
      id: `${baseId}-overview`,
      title: `${topic} Overview`,
      subtitle: "Executive Summary",
      layout: "title",
      content: {
        tagline: "Auto-generated demo deck"
      },
      notes: `Set the stage for ${topic} and highlight the opportunity.`
    },
    {
      id: `${baseId}-challenges`,
      title: "Key Challenges Today",
      subtitle: null,
      layout: "bullets",
      content: {
        bullets: [
          {
            label: "Fragmented Processes",
            description: "Teams rely on manual workarounds that do not scale." },
          {
            label: "Visibility Gaps",
            description: "Leaders lack real-time insight into core metrics." },
          {
            label: "Customer Expectations",
            description: "Modern buyers demand personalization and speed." }
        ]
      },
      notes: "Confirm these resonate with the audience and invite input."
    },
    {
      id: `${baseId}-solution`,
      title: "Solution Blueprint",
      layout: "two-column",
      content: {
        left: {
          subtitle: "Capabilities",
          bullets: [
            {
              label: "Automation",
              description: "Streamline repetitive workflows end-to-end." },
            {
              label: "Intelligence",
              description: "Surface predictions and recommendations in context." },
            {
              label: "Integration",
              description: "Connect existing tools with minimal change management." }
          ]
        },
        right: {
          metrics: [
            { value: "65%", label: "Cycle time reduction" },
            { value: "40%", label: "Service cost savings" }
          ]
        }
      },
      notes: "Walk through the experience and show how it maps to their goals."
    },
    {
      id: `${baseId}-workstreams`,
      title: "Enablement Workstreams",
      subtitle: "Three parallel tracks for transformation",
      layout: "three-column",
      content: {
        columns: [
          {
            title: "Automation",
            items: [
              "Map manual workflows",
              "Prioritize quick wins",
              "Track savings and adoption"
            ]
          },
          {
            title: "Intelligence",
            items: [
              "Unify data sources",
              {
                label: "Models",
                description: "Tailor forecasts to operational KPIs"
              },
              "Deliver insights inside daily tools"
            ]
          },
          {
            title: "Change Management",
            items: [
              "Train champions by function",
              "Communicate milestones weekly",
              "Instrument feedback loops"
            ]
          }
        ]
      },
      notes: "Assign an owner per column before leaving the meeting."
    },
    {
      id: `${baseId}-next-steps`,
      title: "Next Steps",
      layout: "bullets",
      content: {
        bullets: [
          { label: "Workshop", description: "Co-design the deployment roadmap." },
          { label: "Pilot", description: "Launch with a focused team to prove value." },
          { label: "Rollout", description: "Scale across the organization." }
        ]
      },
      notes: "Close with timeline expectations and decision makers required."
    },
    {
      id: `${baseId}-timeline`,
      title: "90-Day Rollout",
      layout: "timeline",
      content: {
        phases: [
          {
            phase: "Phase 1",
            title: "Plan",
            activities: [
              "Kickoff with executive sponsors",
              "Document vision & success metrics",
              "Audit data and tool readiness"
            ]
          },
          {
            phase: "Phase 2",
            title: "Pilot",
            activities: [
              "Enable pilot team with guided workflows",
              "Launch localized messaging experiments",
              "Measure leading indicators weekly"
            ]
          },
          {
            phase: "Phase 3",
            title: "Scale",
            activities: [
              "Roll out automations company-wide",
              "Formalize operating reviews",
              "Publish case study and ROI summary"
            ]
          }
        ]
      },
      notes: "Use this roadmap to confirm owners, checkpoints, and data instrumentation."
    }
  ];

  return {
    title: `${topic} Strategy Deck`,
    subtitle: "Generated via local template (LLM fallback)",
    slides
  };
};

const generateDeckWithOpenAI = async (prompt, { title, subtitle } = {}) => {
  if (!openaiClient) {
    return stubDeckFromPrompt(prompt, { title, subtitle });
  }

  const userPrompt = [title && `Title: ${title}`, subtitle && `Subtitle: ${subtitle}`, prompt]
    .filter(Boolean)
    .join("\n\n");

  const completion = await openaiClient.chat.completions.create({
    model: openaiModel,
    temperature: 0.6,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userPrompt }
    ]
  });

  const message = completion.choices?.[0]?.message?.content;

  if (!message) {
    throw new Error("Model returned no content");
  }

  let parsed = null;
  try {
    parsed = JSON.parse(message);
  } catch (error) {
    throw new Error("Failed to parse deck JSON from model response");
  }

  if (!parsed || !Array.isArray(parsed.slides)) {
    throw new Error("Model response missing slides array");
  }

  return parsed;
};

module.exports = {
  generateDeckWithOpenAI,
  stubDeckFromPrompt
};
