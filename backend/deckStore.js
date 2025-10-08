const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

class DeckStore {
  constructor({ persistPath } = {}) {
    this.decks = new Map();
    this.persistPath = persistPath || null;
    this._loadFromDisk();
  }

  _loadFromDisk() {
    if (!this.persistPath || !fs.existsSync(this.persistPath)) {
      return;
    }

    try {
      const raw = fs.readFileSync(this.persistPath, "utf8");
      if (!raw.trim()) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      parsed.forEach((entry) => {
        if (entry && entry.id) {
          const fallback = new Date().toISOString();
          this.decks.set(entry.id, {
            ...entry,
            createdAt: entry.createdAt || fallback,
            updatedAt: entry.updatedAt || entry.createdAt || fallback
          });
        }
      });
    } catch (error) {
      console.error("Failed to load decks from disk", error);
    }
  }

  _persist() {
    if (!this.persistPath) {
      return;
    }

    try {
      fs.mkdirSync(path.dirname(this.persistPath), { recursive: true });
      const payload = Array.from(this.decks.values());
      fs.writeFileSync(this.persistPath, JSON.stringify(payload, null, 2), "utf8");
    } catch (error) {
      console.error("Failed to persist decks", error);
    }
  }

  seed(deck) {
    if (!deck || !deck.id || this.decks.has(deck.id)) return;

    const now = new Date().toISOString();
    this.decks.set(deck.id, {
      ...deck,
      createdAt: deck.createdAt || now,
      updatedAt: deck.updatedAt || deck.createdAt || now
    });

    this._persist();
  }

  create(deck) {
    const id = deck.id || randomUUID();
    const now = new Date().toISOString();
    const stored = {
      ...deck,
      id,
      createdAt: deck.createdAt || now,
      updatedAt: deck.updatedAt || deck.createdAt || now
    };

    this.decks.set(id, stored);
    this._persist();

    return stored;
  }

  update(id, updates) {
    const existing = this.decks.get(id);
    if (!existing) {
      return null;
    }

    const next =
      typeof updates === "function" ? updates({ ...existing }) : { ...existing, ...updates };

    if (!next || next.id !== undefined && next.id !== id) {
      throw new Error("Deck update must preserve original id");
    }

    const now = new Date().toISOString();
    const stored = {
      ...existing,
      ...next,
      id,
      createdAt: existing.createdAt || now,
      updatedAt: now
    };

    this.decks.set(id, stored);
    this._persist();

    return stored;
  }

  list() {
    return Array.from(this.decks.values()).map(
      ({ id, title, subtitle, slides = [], createdAt, updatedAt }) => ({
        id,
        title,
        subtitle: subtitle || null,
        slideCount: slides.length,
        createdAt,
        updatedAt: updatedAt || createdAt || null
      })
    );
  }

  get(id) {
    return this.decks.get(id) || null;
  }
}

module.exports = { DeckStore };
