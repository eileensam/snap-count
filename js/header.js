// header.js
import { state, saveStateToLocalStorage } from './state.js';

// ==========================
// Fetch week info and store in state
// ==========================
export async function fetchAndStoreWeek() {
  try {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
    const data = await res.json();

    const week = data.week.number;
    const seasonType = data.leagues[0].season.type.name;

    // Update state
    state.currentWeek = week;
    state.seasonType = seasonType;
    state.selectedWeek = week;

    // Persist to localStorage
    saveStateToLocalStorage();

    return { week, seasonType };
  } catch (err) {
    console.error("Error fetching week:", err);
    return null;
  }
}

// ==========================
// Populate week info in DOM
// ==========================
export function populateWeekInfo() {
  const currentWeekEl = document.getElementById("current-week");
  const seasonTypeEl = document.getElementById("season-type");

  if (state.currentWeek && currentWeekEl)
    currentWeekEl.textContent = `Week ${state.currentWeek}`;
  if (state.seasonType && seasonTypeEl)
    seasonTypeEl.textContent = state.seasonType;
}

// ==========================
// Highlight active nav link
// ==========================
export function highlightActiveNav(page) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });
}

// ==========================
// Initialize header (called externally, not auto)
// ==========================
export async function initHeader() {
  if (!state.currentWeek || !state.seasonType) {
    await fetchAndStoreWeek();
  }
  populateWeekInfo();
}
