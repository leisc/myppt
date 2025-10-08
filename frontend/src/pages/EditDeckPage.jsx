import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchDeck, listDecks, updateDeck } from "../api/decks.js";

const layoutOptions = [
  "cover",
  "text",
  "bullets",
  "two-column",
  "three-column",
  "timeline",
  "hub",
  "image-left",
  "image-center",
  "ring",
  "pyramid",
  "radar",
  "flow"
];

const toEditableSlide = (slide) => ({
  ...slide,
  subtitle: slide?.subtitle ?? "",
  notes: slide?.notes ?? "",
  _contentText: JSON.stringify(slide?.content ?? {}, null, 2)
});

export default function EditDeckPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckMeta, setDeckMeta] = useState({ title: "", subtitle: "", theme: "" });
  const [slides, setSlides] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const loadDecks = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await listDecks();
      setDecks(data);
      if (data.length > 0) {
        const requestedId = searchParams.get("deckId");
        const fallbackId = requestedId && data.some((item) => item.id === requestedId)
          ? requestedId
          : data[0].id;
        setSelectedDeckId(fallbackId);
      } else {
        setSelectedDeckId(null);
        setSlides([]);
      }
    } catch (err) {
      console.error("Failed to load decks", err);
      setError("Failed to load deck list.");
    } finally {
      setLoadingList(false);
    }
  }, [searchParams]);

  const loadDeck = useCallback(async (id) => {
    if (!id) return;
    setLoadingDeck(true);
    try {
      const data = await fetchDeck(id);
      setDeckMeta({
        title: data.title || "",
        subtitle: data.subtitle || "",
        theme: data.theme || ""
      });
      setSlides((data.slides || []).map(toEditableSlide));
      setSelectedSlideIndex(0);
      setError(null);
      setStatus(null);
    } catch (err) {
      console.error("Failed to load deck", err);
      setError("Unable to load selected deck.");
    } finally {
      setLoadingDeck(false);
    }
  }, []);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  useEffect(() => {
    if (selectedDeckId) {
      loadDeck(selectedDeckId);
    } else {
      setDeckMeta({ title: "", subtitle: "", theme: "" });
      setSlides([]);
    }
  }, [selectedDeckId, loadDeck]);

  useEffect(() => {
    if (selectedDeckId) {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("deckId", selectedDeckId);
        return next;
      });
    } else {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.delete("deckId");
        return next;
      });
    }
  }, [selectedDeckId, setSearchParams]);

  const sidebarContent = useMemo(() => {
    if (loadingList) {
      return <p className="meta">Loading decks…</p>;
    }

    if (!decks.length) {
      return <p className="meta">No decks yet. Generate one from the Create page.</p>;
    }

    return (
      <ul className="deck-list">
        {decks.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={item.id === selectedDeckId ? "active" : undefined}
              onClick={() => setSelectedDeckId(item.id)}
            >
              <strong>{item.title || "Untitled deck"}</strong>
              <span className="meta">{item.slideCount} slides</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [decks, selectedDeckId, loadingList]);

  const currentSlide = slides[selectedSlideIndex] || null;

  const handleSlideChange = (field, value) => {
    setSlides((prev) =>
      prev.map((slide, index) =>
        index === selectedSlideIndex ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleContentChange = (value) => {
    setSlides((prev) =>
      prev.map((slide, index) =>
        index === selectedSlideIndex ? { ...slide, _contentText: value } : slide
      )
    );
  };

  const handleSave = async () => {
    if (!selectedDeckId) {
      return;
    }

    const slidesPayload = [];

    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index];
      if (!slide.id || !slide.id.trim()) {
        setSelectedSlideIndex(index);
        setStatus({ tone: "error", message: "Each slide needs an id." });
        return;
      }

      if (!slide.layout || !slide.layout.trim()) {
        setSelectedSlideIndex(index);
        setStatus({ tone: "error", message: `Slide ${slide.id} is missing a layout.` });
        return;
      }

      let parsedContent;
      try {
        parsedContent = slide._contentText ? JSON.parse(slide._contentText) : {};
      } catch (err) {
        setSelectedSlideIndex(index);
        setStatus({ tone: "error", message: `Slide ${slide.id} content is not valid JSON.` });
        return;
      }

      slidesPayload.push({
        id: slide.id.trim(),
        title: slide.title || "",
        subtitle: slide.subtitle?.trim() ? slide.subtitle.trim() : null,
        layout: slide.layout.trim(),
        content: parsedContent,
        notes: slide.notes?.trim() ? slide.notes.trim() : null
      });
    }

    const payload = {
      title: deckMeta.title,
      subtitle: deckMeta.subtitle?.trim() ? deckMeta.subtitle.trim() : null,
      slides: slidesPayload
    };

    if (deckMeta.theme?.trim()) {
      payload.theme = deckMeta.theme.trim();
    }

    setSaving(true);
    setStatus({ tone: "pending", message: "Saving changes…" });

    try {
      const response = await updateDeck(selectedDeckId, payload);
      const updated = response.deck;
      setDeckMeta({
        title: updated.title || "",
        subtitle: updated.subtitle || "",
        theme: updated.theme || ""
      });
      setSlides((updated.slides || []).map(toEditableSlide));
      setStatus({ tone: "success", message: "Deck updated successfully." });
      setDecks((prev) =>
        prev.map((item) =>
          item.id === selectedDeckId
            ? {
                ...item,
                title: updated.title || item.title,
                subtitle: updated.subtitle || item.subtitle,
                slideCount: updated.slides?.length ?? item.slideCount,
                updatedAt: updated.updatedAt || item.updatedAt
              }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update deck", err);
      setStatus({ tone: "error", message: err.message || "Failed to update deck." });
    } finally {
      setSaving(false);
    }
  };

  const slideList = useMemo(() => {
    if (!slides.length) {
      return <p className="meta">No slides in this deck.</p>;
    }

    return (
      <ul className="deck-list slide-selector">
        {slides.map((slide, index) => (
          <li key={slide.id || index}>
            <button
              type="button"
              className={index === selectedSlideIndex ? "active" : undefined}
              onClick={() => setSelectedSlideIndex(index)}
            >
              <span className="slide-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{slide.title || slide.id}</strong>
                <span className="meta">{slide.layout}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [slides, selectedSlideIndex]);

  return (
    <div className="deck-layout deck-editor">
      <aside className="deck-sidebar">
        <div className="viewer-header">
          <h2>Decks</h2>
          <button className="button-secondary" onClick={loadDecks} disabled={loadingList}>
            Refresh
          </button>
        </div>
        {sidebarContent}
      </aside>

      <div className="panel deck-editor-main">
        {error && <div className="status error">{error}</div>}
        {status && <div className={`status ${status.tone}`}>{status.message}</div>}

        {!selectedDeckId && <p className="meta">Select a deck to start editing.</p>}

        {selectedDeckId && (
          <>
            <div className="deck-metadata-form">
              <label>
                Deck title
                <input
                  value={deckMeta.title}
                  onChange={(event) => setDeckMeta((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Deck title"
                />
              </label>
              <label>
                Deck subtitle
                <input
                  value={deckMeta.subtitle}
                  onChange={(event) =>
                    setDeckMeta((prev) => ({ ...prev, subtitle: event.target.value }))
                  }
                  placeholder="Deck subtitle"
                />
              </label>
              <label>
                Theme (optional)
                <input
                  value={deckMeta.theme}
                  onChange={(event) => setDeckMeta((prev) => ({ ...prev, theme: event.target.value }))}
                  placeholder="Theme"
                />
              </label>
            </div>

            <div className="slide-editor-grid">
              <div className="slide-editor-list">
                <div className="viewer-header compact">
                  <h3>Slides</h3>
                  <span className="meta">{slides.length} total</span>
                </div>
                {loadingDeck ? <p className="meta">Loading deck…</p> : slideList}
              </div>

              <div className="slide-editor-form">
                {loadingDeck && <p className="meta">Loading slide…</p>}
                {!loadingDeck && !currentSlide && <p className="meta">Choose a slide to edit.</p>}
                {!loadingDeck && currentSlide && (
                  <div className="form slide-form">
                    <label>
                      Slide title
                      <input
                        value={currentSlide.title || ""}
                        onChange={(event) => handleSlideChange("title", event.target.value)}
                        placeholder="Slide title"
                      />
                    </label>

                    <label>
                      Slide subtitle
                      <input
                        value={currentSlide.subtitle || ""}
                        onChange={(event) => handleSlideChange("subtitle", event.target.value)}
                        placeholder="Slide subtitle"
                      />
                    </label>

                    <label>
                      Slide id
                      <input
                        value={currentSlide.id || ""}
                        onChange={(event) => handleSlideChange("id", event.target.value)}
                        placeholder="unique-slide-id"
                      />
                    </label>

                    <label>
                      Layout
                      <select
                        value={currentSlide.layout || ""}
                        onChange={(event) => handleSlideChange("layout", event.target.value)}
                      >
                        <option value="">Select a layout</option>
                        {layoutOptions.map((layout) => (
                          <option key={layout} value={layout}>
                            {layout}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Notes
                      <textarea
                        value={currentSlide.notes || ""}
                        onChange={(event) => handleSlideChange("notes", event.target.value)}
                        placeholder="Speaker notes"
                        rows={3}
                      />
                    </label>

                    <label>
                      Content (JSON)
                      <textarea
                        value={currentSlide._contentText}
                        onChange={(event) => handleContentChange(event.target.value)}
                        rows={14}
                        spellCheck={false}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="editor-actions">
              <button
                className="button-primary"
                type="button"
                onClick={handleSave}
                disabled={saving || loadingDeck}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
