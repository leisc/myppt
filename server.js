const fs = require("fs");
const express = require("express");
const path = require("path");
const { deck, slides } = require("./backend/slidesData");
const { DeckStore } = require("./backend/deckStore");
const { generateDeckWithOpenAI } = require("./backend/llmService");

const deckStore = new DeckStore();
deckStore.seed(deck);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

app.get("/api/decks", (_req, res) => {
  res.json(deckStore.list());
});

app.post("/api/decks", async (req, res) => {
  const { prompt, title, subtitle } = req.body || {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const generated = await generateDeckWithOpenAI(prompt, { title, subtitle });

    const normalized = {
      ...generated,
      title: title || generated.title || "Generated Deck",
      subtitle: subtitle || generated.subtitle || null
    };

    const stored = deckStore.create(normalized);

    return res.status(201).json({ deckId: stored.id, deck: stored });
  } catch (error) {
    console.error("Failed to generate deck", error);
    return res.status(500).json({ message: "Failed to generate deck", detail: error.message });
  }
});

app.get("/api/deck", (_req, res) => {
  res.json(deck);
});

app.get("/api/slides", (_req, res) => {
  res.json(
    slides.map(({ id, title, subtitle, layout }) => ({
      id,
      title,
      subtitle: subtitle || null,
      layout
    }))
  );
});

app.get("/api/slides/:id", (req, res) => {
  const slide = slides.find(({ id }) => id === req.params.id);

  if (!slide) {
    return res.status(404).json({ message: "Slide not found" });
  }

  return res.json(slide);
});

app.get("/api/decks/:id", (req, res) => {
  const deck = deckStore.get(req.params.id);

  if (!deck) {
    return res.status(404).json({ message: "Deck not found" });
  }

  return res.json(deck);
});

const distDir = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

app.get("*", (_req, res) => {
  const indexPath = path.join(distDir, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res
    .status(200)
    .send("Frontend build not found. Run 'npm run build --workspace frontend' to generate it.");
});

app.listen(PORT, () => {
  console.log(`Slide deck server listening on http://localhost:${PORT}`);
});
