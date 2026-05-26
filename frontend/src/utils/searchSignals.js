const SEARCH_SIGNAL_KEY = "vshopSearchSignals";
const MAX_SEARCH_SIGNALS = 8;

const normalizeSearch = (value) => value?.toString().trim().toLowerCase() || "";

export const getSearchSignals = () => {
  try {
    const savedSignals = JSON.parse(localStorage.getItem(SEARCH_SIGNAL_KEY) || "[]");
    return Array.isArray(savedSignals) ? savedSignals.filter(Boolean) : [];
  } catch {
    localStorage.removeItem(SEARCH_SIGNAL_KEY);
    return [];
  }
};

export const saveSearchSignal = (value) => {
  const query = normalizeSearch(value);

  if (!query) {
    return getSearchSignals();
  }

  const nextSignals = [
    query,
    ...getSearchSignals().filter((item) => item !== query),
  ].slice(0, MAX_SEARCH_SIGNALS);

  localStorage.setItem(SEARCH_SIGNAL_KEY, JSON.stringify(nextSignals));
  return nextSignals;
};

export const hasEnoughSearchSignals = () => getSearchSignals().length >= 2;

