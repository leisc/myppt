const fs = require("fs");
const express = require("express");
const path = require("path");
const { deck, slides } = require("./backend/slidesData");
const { DeckStore } = require("./backend/deckStore");
const { generateDeckWithOpenAI } = require("./backend/llmService");

const deckStore = new DeckStore({
  persistPath: path.join(__dirname, "backend", "data", "decks.json")
});
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

app.put("/api/decks/:id", (req, res) => {
  const deckId = req.params.id;
  const { title, subtitle, slides: requestedSlides, theme, notes } = req.body || {};

  if (!Array.isArray(requestedSlides)) {
    return res.status(400).json({ message: "slides array is required" });
  }

  const normalizedSlides = [];

  for (let index = 0; index < requestedSlides.length; index += 1) {
    const slide = requestedSlides[index];
    if (!slide || typeof slide !== "object") {
      return res.status(400).json({ message: `Slide at index ${index} is invalid` });
    }

    if (!slide.id || typeof slide.id !== "string") {
      return res.status(400).json({ message: `Slide at index ${index} is missing an id` });
    }

    if (!slide.layout || typeof slide.layout !== "string") {
      return res.status(400).json({ message: `Slide ${slide.id} is missing a layout` });
    }

    if (slide.content == null || typeof slide.content !== "object") {
      return res.status(400).json({ message: `Slide ${slide.id} must include content` });
    }

    normalizedSlides.push({
      ...slide,
      subtitle: slide.subtitle ?? null,
      notes: slide.notes ?? null
    });
  }

  try {
    const updatePayload = {
      slides: normalizedSlides
    };

    if (typeof title === "string") {
      updatePayload.title = title;
    }

    if (subtitle === null || typeof subtitle === "string") {
      updatePayload.subtitle = subtitle ?? null;
    }

    if (typeof theme === "string") {
      updatePayload.theme = theme;
    }

    if (typeof notes === "string") {
      updatePayload.notes = notes;
    }

    const updated = deckStore.update(deckId, updatePayload);

    if (!updated) {
      return res.status(404).json({ message: "Deck not found" });
    }

    return res.json({ deck: updated });
  } catch (error) {
    console.error("Failed to update deck", error);
    return res.status(500).json({ message: "Failed to update deck", detail: error.message });
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
