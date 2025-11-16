// ===============================
// Global app state
// ===============================

export const state = {
  currentWeek: null,
  seasonType: "",
  totalGames: {},       // { weekNumber: [game objects] }
  selectedWeek: null,
  selectedPlayer: null,
  showSmallGroup: true,
  teamLogos: JSON.parse(localStorage.getItem("teamLogos") || "{}")
};

// ===============================
// Load state from localStorage
// ===============================

export function loadState() {
  const savedGames = localStorage.getItem("totalGames");
  if (savedGames) state.totalGames = JSON.parse(savedGames);

  const savedWeek = localStorage.getItem("currentWeek");
  if (savedWeek) state.currentWeek = Number(savedWeek);

  const savedSeason = localStorage.getItem("seasonType");
  if (savedSeason) state.seasonType = savedSeason;

  const savedLogos = localStorage.getItem("teamLogos");
  if (savedLogos) state.teamLogos = JSON.parse(savedLogos);

  // Defaults for page
  state.selectedWeek = state.currentWeek || 1;
}

// ===============================
// Persist state to localStorage
// ===============================

export function saveState() {
  localStorage.setItem("totalGames", JSON.stringify(state.totalGames));
  localStorage.setItem("teamLogos", JSON.stringify(state.teamLogos));
  if (state.currentWeek) localStorage.setItem("currentWeek", state.currentWeek);
  if (state.seasonType) localStorage.setItem("seasonType", state.seasonType);
}