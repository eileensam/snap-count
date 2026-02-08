// pages/index.js
import { state, saveState } from '../core/state.js';
import { fetchWeekGames } from '../core/api.js';
import { loadHeader, initHeader, highlightActiveNav } from '../core/header.js';
import * as render from '../core/render.js';
import {showLoading, hideLoading} from '../core/loading.js'

// --------------------
// Main initialization
// --------------------
async function initLeaderboardPage() {
  showLoading();

  // 1️⃣ Load header HTML
  await loadHeader();

  // 2️⃣ Initialize header info and highlight nav
  await initHeader();
  highlightActiveNav("index");

  // 3️⃣ Fetch all weeks if not in state
  if (!state.totalGames || Object.keys(state.totalGames).length === 0) {
    state.totalGames = {};
    for (let week = 1; week <= state.currentWeek; week++) {
      try {
        const games = await fetchWeekGames(week);
        state.totalGames[week] = games;
      } catch (err) {
        console.error(`Failed to fetch week ${week}:`, err);
      }
    }
    saveState();
  }

  // 4️⃣ Render page components
  render.renderWeekDropdown();
  render.renderPlayerDropdown();
  render.renderLeaderboardTable();
  render.renderPlayerBreakdown();
  render.renderLeaderboardChart();

  // 5️⃣ Attach event listeners now that DOM exists
  attachEventListeners();

  hideLoading();
}

// --------------------
// Event listeners
// --------------------
function attachEventListeners() {
  const playerSelect = document.querySelector("#player-select");
  const weekSelect = document.querySelector("#week-select");
  const groupRadios = document.querySelectorAll('input[name="leaderboard-group"]');

  playerSelect?.addEventListener("change", e => {
    state.selectedPlayer = e.target.value;
    render.renderPlayerBreakdown();
  });

  weekSelect?.addEventListener("change", e => {
    state.selectedWeek = Number(e.target.value);
    render.renderPlayerBreakdown();
    render.renderLeaderboardChart();
    render.renderLeaderboardTable();
  });

  groupRadios.forEach(radio => {
    radio.addEventListener("change", e => {
      state.showSmallGroup = e.target.value === "snap";
      render.renderPlayerDropdown();
      render.renderLeaderboardTable();
      render.renderPlayerBreakdown();
      render.renderLeaderboardChart();
    });
  });
}

// --------------------
// Auto-run page init
// --------------------
initLeaderboardPage();
