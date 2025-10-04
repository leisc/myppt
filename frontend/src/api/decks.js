const defaultHeaders = {
  "Content-Type": "application/json"
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const listDecks = () => request("/api/decks");

export const fetchDeck = (deckId) => request(`/api/decks/${deckId}`);

export const generateDeck = (payload) =>
  request("/api/decks", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchDefaultDeck = () => request("/api/deck");
