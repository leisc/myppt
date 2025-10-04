import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Generate decks with AI",
    description:
      "Describe your audience, goal, and story beats. Our assistant drafts slides, content, and notes tailored to your brief.",
    action: { label: "Start creating", to: "/create" }
  },
  {
    title: "Present with confidence",
    description:
      "Navigate with keyboard shortcuts, reference speaker notes, and jump using the slide overview in a polished presenter view.",
    action: { label: "Open presenter", to: "/present" }
  },
  {
    title: "Stay in sync",
    description:
      "Generated decks remain available for later editing or presenting. Switch decks instantly without leaving the presenter.",
    action: { label: "View decks", to: "/present" }
  }
];

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero">
        <span className="brand-badge">New</span>
        <h1>Craft AI-powered story decks in minutes</h1>
        <p>
          MyPPT combines an LLM-powered deck generator with a modern presenter experience. Generate
          tailored slides, iterate quickly, and deliver your message anywhere.
        </p>
        <div className="hero-actions">
          <Link to="/create" className="button-primary">
            Create a new
          </Link>
          <Link to="/present" className="button-secondary">
            Present an existing
          </Link>
        </div>
      </section>

      <section className="card-grid">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link to={item.action.to} className="link-button">
              {item.action.label}
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
