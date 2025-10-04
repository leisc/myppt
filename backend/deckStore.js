const { randomUUID } = require("crypto");

class DeckStore {
  constructor() {
    this.decks = new Map();
  }

  seed(deck) {
    if (!deck || !deck.id) return;
    this.decks.set(deck.id, {
      ...deck,
      createdAt: deck.createdAt || new Date().toISOString()
    });
  }

  create(deck) {
    const id = deck.id || randomUUID();
    const stored = {
      ...deck,
      id,
      createdAt: deck.createdAt || new Date().toISOString()
    };
    this.decks.set(id, stored);
    return stored;
  }

  list() {
    return Array.from(this.decks.values()).map(({ id, title, subtitle, slides = [], createdAt }) => ({
      id,
      title,
      subtitle: subtitle || null,
      slideCount: slides.length,
      createdAt
    }));
  }

  get(id) {
    return this.decks.get(id) || null;
  }
}

module.exports = { DeckStore };
