import { useMemo, useState } from "react";
import { generateDeck } from "../api/decks.js";

const steps = [
  {
    label: "Prepare instructions",
    pending: "Waiting to start",
    active: "Preparing LLM instructions…",
    complete: "Instructions ready"
  },
  {
    label: "Send request",
    pending: "Awaiting request",
    active: "Sending to deck service…",
    complete: "Request delivered"
  },
  {
    label: "Generate slides",
    pending: "Awaiting generation",
    active: "Deck service is generating slides…",
    complete: "Slides generated"
  },
  {
    label: "Finalize deck",
    pending: "Awaiting finalization",
    active: "Finalizing deck output…",
    complete: "Deck ready"
  }
];

export default function CreateDeckPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState({
    message: "Describe your deck and click Generate to start.",
    tone: "info"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [deck, setDeck] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const presenterUrl = useMemo(() => {
    if (!deck?.id || typeof window === "undefined") return null;
    const url = new URL(window.location.origin + "/present");
    url.searchParams.set("deckId", deck.id);
    return url.toString();
  }, [deck?.id]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setStatus({ message: "Please describe what the deck should cover.", tone: "error" });
      return;
    }

    setIsGenerating(true);
    setStatus({ message: "Preparing instructions…", tone: "pending" });
    setCurrentStep(1);

    try {
      const payload = {
        prompt: prompt.trim(),
        title: title.trim() || undefined,
        subtitle: subtitle.trim() || undefined
      };
      setCurrentStep(2);
      setStatus({ message: "Sending instructions to generation service…", tone: "pending" });

      setCurrentStep(3);
      setStatus({ message: "Deck service is generating slides…", tone: "pending" });
      const response = await generateDeck(payload);

      setDeck(response.deck);
      setStatus({ message: "Deck generated successfully!", tone: "success" });
      setCurrentStep(steps.length + 1);
    } catch (error) {
      console.error("Deck generation failed", error);
      setStatus({ message: error.message || "Failed to generate deck", tone: "error" });
      setCurrentStep(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="layout-split stack-on-small">
      <section className="panel">
        <div>
          <h1>Create a new deck</h1>
          <p>
            Provide context about your audience, the narrative you want to tell, and any data points
            you would like to highlight. The generator will craft slides, bullet points, and speaker
            notes automatically.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <label>
            Deck title (optional)
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="AI in Global Commerce"
              maxLength={120}
            />
          </label>

          <label>
            Deck subtitle (optional)
            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="What transformation are you pitching?"
              maxLength={160}
            />
          </label>

          <label>
            Creative brief / prompt
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Explain the objective, target audience, and key points to cover..."
              required
            />
          </label>

          <button className="button-primary" type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating…" : "Generate deck"}
          </button>
        </form>

        <div className="meta">Keyboard shortcut tips: use clear, concise prompts for best decks.</div>
      </section>

      <section className="panel preview-panel">
        <h2>Generation progress</h2>
        <div className="generation-progress">
          {currentStep > 0 && currentStep <= steps.length && (
            <div className="spinner" aria-hidden="true" />
          )}
          <div className={`status ${status.tone}`}>{status.message}</div>

          <ol className="stepper">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isActive = currentStep === stepNumber;
              const statusLabel = isCompleted
                ? step.complete
                : isActive
                ? step.active
                : step.pending;
              return (
                <li
                  key={step.label}
                  className={`step ${isCompleted ? "completed" : ""} ${
                    isActive ? "active" : ""
                  }`}
                >
                  <span className="step-circle" aria-hidden="true">
                    {isCompleted ? "✓" : stepNumber}
                  </span>
                  <div>
                    <strong>{step.label}</strong>
                    <span className="meta">{statusLabel}</span>
                  </div>
                </li>
              );
            })}
          </ol>

          {deck && (
            <div className="generation-summary">
              <strong>{deck.title || "Generated deck"}</strong>
              {deck.subtitle && <span>{deck.subtitle}</span>}
              <span>{deck.slides?.length || 0} slides ready</span>
            </div>
          )}

          {presenterUrl && (
            <a className="link-button" href={presenterUrl} target="_blank" rel="noreferrer">
              Open in presenter
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
