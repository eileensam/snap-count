import { state } from './state.js';
import {
  pool,
  pointsBySeason,
  NFL_LOGO,
  colors,
  characters,
  gameOutcome,
  gameState,
  playoffPointsByRound
} from './statics.js';

// Cached DOM elements
const leaderboardTable = document.querySelector("#leaderboard-table tbody");
const playerSelect = document.querySelector("#player-select");
const weekSelect = document.querySelector("#week-select");
const playerTableBody = document.querySelector("#player-table tbody");
const leaderboardCanvas = document.getElementById("leaderboardChart");

let leaderboardChart = null;

// ===============================
// Helper: Get points for a single game
// ===============================
function getPointsForGame(game) {
  if (game.state !== gameState.POST) return 0;

  // Playoffs: use round if available
  if (game.round) {
    if (game.score > game.opponentScore) return playoffPointsByRound[game.round] ?? 0;
    if (game.score === game.opponentScore) return 0.5 * (playoffPointsByRound[game.round] ?? 0);
    return 0;
  }

  // Regular season
  if (game.score > game.opponentScore) return pointsBySeason["Regular Season"];
  if (game.score === game.opponentScore) return 0.5 * pointsBySeason["Regular Season"];
  return 0;
}

// ===============================
// Helper: Get cumulative points for a player up to a given week
// ===============================
function getCumulativePoints(playerObj, upToWeek) {
  let total = 0;
  for (let w = 1; w <= upToWeek; w++) {
    const games = state.totalGames[w] || [];
    playerObj.teamList.forEach(team => {
      const game = games.find(g => g.team === team);
      if (!game) return;

      total += getPointsForGame(game);
    });
  }
  return total;
}

// ===============================
// Helper: Get player's previous rank
// ===============================
function getLastWeekRanks() {
  if (state.selectedWeek <= 1) return {};

  const ranks = {};
  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);

  const pointsByPlayer = {};
  filtered.forEach(p => {
    pointsByPlayer[p.player] = getCumulativePoints(p, state.selectedWeek - 1);
  });

  const sorted = filtered.slice().sort((a, b) => pointsByPlayer[b.player] - pointsByPlayer[a.player]);

  let lastScore = null;
  let lastRank = 0;
  sorted.forEach((p, idx) => {
    const score = pointsByPlayer[p.player];
    let rank = score === lastScore ? lastRank : idx + 1;
    if (rank !== lastRank) lastRank = rank;
    lastScore = score;
    ranks[p.player] = rank;
  });

  return ranks;
}

// ===============================
// Leaderboard table
// ===============================
export function renderLeaderboardTable() {
  leaderboardTable.innerHTML = "";

  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);

  const pointsByPlayer = {};
  filtered.forEach(player => pointsByPlayer[player.player] = getCumulativePoints(player, state.selectedWeek));

  const sorted = filtered.slice().sort((a, b) => pointsByPlayer[b.player] - pointsByPlayer[a.player]);

  const lastWeekRanks = getLastWeekRanks();
  let lastScore = null;
  let lastRank = 0;

  sorted.forEach((p, idx) => {
    const score = pointsByPlayer[p.player];
    let rank = score === lastScore ? lastRank : idx + 1;
    if (rank !== lastRank) lastRank = rank;
    lastScore = score;

    const prevRank = lastWeekRanks[p.player] ?? rank;
    const diff = prevRank - rank;
    let movement = characters.DASH;
    if (diff > 0) movement = `+${diff}`;
    else if (diff < 0) movement = `${diff}`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rank}</td>
      <td>${p.player}</td>
      <td>${score}</td>
      <td>${movement}</td>
    `;

    if (movement.startsWith(characters.PLUS)) row.cells[3].style.color = colors.GREEN;
    if (movement.startsWith(characters.DASH) && diff < 0) row.cells[3].style.color = colors.RED;

    leaderboardTable.appendChild(row);
  });
}

// ===============================
// Player dropdown
// ===============================
export function renderPlayerDropdown() {
  playerSelect.innerHTML = "";
  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);

  filtered.forEach((p, idx) => {
    const option = document.createElement("option");
    option.value = p.player;
    option.textContent = p.player;
    playerSelect.appendChild(option);

    if (idx === 0 && (!state.selectedPlayer || !filtered.some(f => f.player === state.selectedPlayer))) {
      state.selectedPlayer = p.player;
      playerSelect.value = p.player;
    }
  });
}

// ===============================
// Week dropdown
// ===============================
export function renderWeekDropdown() {
  weekSelect.innerHTML = "";
  const weeks = Object.keys(state.totalGames).map(Number).sort((a, b) => b - a);

  weeks.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = `Week ${w}`;
    weekSelect.appendChild(opt);
  });

  weekSelect.value = state.selectedWeek;
}

// ===============================
// Player breakdown table
// ===============================
export function renderPlayerBreakdown() {
  playerTableBody.innerHTML = "";
  if (!state.selectedPlayer || !state.totalGames[state.selectedWeek]) return;

  const playerObj = pool.find(p => p.player === state.selectedPlayer);
  if (!playerObj) return;

  playerObj.teamList.forEach(team => {
    const game = state.totalGames[state.selectedWeek].find(g => g.team === team);
    if (!game) return;

    const opponent = game.opponent ?? characters.N_A;

    const fullScore = (() => {
      if (game.state === gameState.PRE) return game.status;

      let scoreText = `${game.score}-${game.opponentScore}`;
      if (game.score !== game.opponentScore) {
        const winnerTeam = game.score > game.opponentScore ? game.team : game.opponent;
        const winnerLogo = state.teamLogos[winnerTeam] || NFL_LOGO;
        scoreText += ` <img src="${winnerLogo}" class="team-cell-logo" alt="${winnerTeam} logo"> ${winnerTeam}`;
      }
      return scoreText;
    })();

    let result = characters.QUESTION_MARK;
    let points = characters.QUESTION_MARK;

    if (game.state === gameState.POST) {
      if (game.score > game.opponentScore) { result = gameOutcome.W; points = getPointsForGame(game); }
      else if (game.score < game.opponentScore) { result = gameOutcome.L; points = 0; }
      else { result = gameOutcome.T; points = getPointsForGame(game); }
    }

    let wpDisplay = characters.DASH;
    if (game.state === gameState.IN && game.wp != null) {
      wpDisplay = (game.wp / 100).toFixed(2);
    }

    const teamLogo = state.teamLogos[team] || NFL_LOGO;
    const opponentLogo = state.teamLogos[opponent] || NFL_LOGO;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${teamLogo}" class="team-cell-logo" alt="${team} logo"> ${team}</td>
      <td><img src="${opponentLogo}" class="team-cell-logo" alt="${opponent} logo"> ${opponent}</td>
      <td>${fullScore}</td>
      <td>${result}</td>
      <td>${points}</td>
      <td>${wpDisplay}</td>
    `;

    if (result === gameOutcome.W) row.cells[3].style.color = colors.GREEN;
    if (result === gameOutcome.L) row.cells[3].style.color = colors.RED;
    if (game.state === gameState.IN && wpDisplay !== characters.DASH) {
      const wpNum = parseFloat(wpDisplay);
      row.cells[5].style.color = wpNum > 0.5 ? colors.GREEN : colors.RED;
    }

    playerTableBody.appendChild(row);
  });
}

// ===============================
// Leaderboard chart
// ===============================
export function renderLeaderboardChart() {
  if (!leaderboardCanvas) return;

  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);
  const playersList = filtered.map(p => p.player);

  const weeks = Object.keys(state.totalGames).map(Number).filter(w => w <= state.selectedWeek);
  const colorsArr = ["#FF4C4C","#4CFF4C","#4C4CFF","#FFD700","#FF7F50","#8A2BE2"];

  const datasets = playersList.map((player, idx) => {
    let cumulative = 0;
    const data = weeks.map(w => {
      const games = state.totalGames[w] || [];
      games.forEach(g => {
        const playerObj = pool.find(p => p.player === player);
        if (playerObj?.teamList.includes(g.team)) cumulative += getPointsForGame(g);
      });
      return cumulative;
    });

    return {
      label: player,
      data,
      fill: false,
      borderColor: colorsArr[idx % colorsArr.length],
      backgroundColor: colorsArr[idx % colorsArr.length],
      tension: 0.2
    };
  });

  if (leaderboardChart) leaderboardChart.destroy();

  leaderboardChart = new Chart(leaderboardCanvas.getContext("2d"), {
    type: "line",
    data: { labels: weeks.map(w => `Week ${w}`), datasets },
    options: { responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } }
  });
}
