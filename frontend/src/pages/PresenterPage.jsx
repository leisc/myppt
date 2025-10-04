import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DeckViewer from "../components/DeckViewer.jsx";
import { fetchDeck, listDecks } from "../api/decks.js";

export default function PresenterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [deck, setDeck] = useState(null);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
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
        setActiveDeckId(fallbackId);
      } else {
        setActiveDeckId(null);
        setDeck(null);
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
      setDeck(data);
      setError(null);
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
    if (activeDeckId) {
      loadDeck(activeDeckId);
    }
  }, [activeDeckId, loadDeck]);

  useEffect(() => {
    if (activeDeckId) {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("deckId", activeDeckId);
        return next;
      });
    }
  }, [activeDeckId, setSearchParams]);

  const handleSelectDeck = (id) => {
    setActiveDeckId(id);
  };

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
              className={item.id === activeDeckId ? "active" : undefined}
              onClick={() => handleSelectDeck(item.id)}
            >
              <strong>{item.title || "Untitled deck"}</strong>
              <span className="meta">{item.slideCount} slides</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [decks, activeDeckId, loadingList]);

  return (
    <div className="deck-layout">
      <aside className="deck-sidebar">
        <div className="viewer-header">
          <h2>Decks</h2>
          <button className="button-secondary" onClick={loadDecks}>
            Refresh
          </button>
        </div>
        {sidebarContent}
      </aside>

      <div className="panel">
        {error && <div className="status error">{error}</div>}
        <DeckViewer deck={deck} loading={loadingDeck} enableFullscreen />
      </div>
    </div>
  );
}
