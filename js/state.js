// state.js
export const state = {
  totalGames: {},
  weekList: [],
  seasonType: "",
  currentWeek: null,
  selectedWeek: null,
  selectedPlayer: null,
  showSmallGroup: true,
};

export function loadStateFromLocalStorage() {
  state.totalGames = JSON.parse(localStorage.getItem("totalGames") || "{}");
  state.weekList = Object.keys(state.totalGames).map(Number).sort((a, b) => a - b);
  state.seasonType = localStorage.getItem("seasonType") || "";
  state.currentWeek = Number(localStorage.getItem("currentWeek")) || null;
  state.selectedWeek = state.currentWeek;
}

export function saveStateToLocalStorage() {
  localStorage.setItem("totalGames", JSON.stringify(state.totalGames));
  localStorage.setItem("seasonType", state.seasonType);
  localStorage.setItem("currentWeek", state.currentWeek);
}
