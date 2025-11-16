import { state, saveState } from './state.js';
import { fetchCurrentWeekInfo } from './api.js';

// Populate week and season info in the DOM
export function populateWeekInfo() {
  const weekEl = document.getElementById("current-week");
  const seasonEl = document.getElementById("season-type");

  if (state.currentWeek && weekEl) {
    weekEl.textContent = `Week ${state.currentWeek}`;
  }

  if (state.seasonType && seasonEl) {
    seasonEl.textContent = state.seasonType;
  }
}

// Highlight active navigation link
export function highlightActiveNav(page) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });
}

// Load header.html into #header-container
export async function loadHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  try {
    const res = await fetch('header.html');
    const html = await res.text();
    container.innerHTML = html;
    populateWeekInfo(); // after injecting
  } catch (err) {
    console.error('Failed to load header:', err);
  }
}

// Initialize header info (week + season)
export async function initHeader() {
  if (!state.currentWeek || !state.seasonType) {
    const info = await fetchCurrentWeekInfo();
    if (info) {
      state.currentWeek = info.currentWeek;
      state.seasonType = info.seasonType;
      state.selectedWeek = info.currentWeek;
      saveState();
    }
  }
  populateWeekInfo();
}
