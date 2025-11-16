import { state } from './state.js';
import { pool, pointsBySeason, players } from './statics.js';

// Cached DOM elements
const leaderboardTable = document.querySelector("#leaderboard-table tbody");
const playerSelect = document.querySelector("#player-select");
const weekSelect = document.querySelector("#week-select");
const playerTableBody = document.querySelector("#player-table tbody");
const leaderboardCanvas = document.getElementById("leaderboardChart");

let leaderboardChart = null;

// ===============================
// Leaderboard table with ties
// ===============================

export function renderLeaderboardTable() {
  leaderboardTable.innerHTML = "";

  // Filter based on small group toggle
  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);

  // Calculate points
  const pointsByPlayer = {};
  filtered.forEach(p => pointsByPlayer[p.player] = 0);
  filtered.forEach(player => {
    player.teamList.forEach(team => {
      Object.values(state.totalGames).forEach(games => {
        const game = games.find(g => g.team === team);
        if (!game || game.state !== "post") return;

        const pts = game.score > game.opponentScore
          ? pointsBySeason[state.seasonType]
          : game.score === game.opponentScore
            ? 0.5 * pointsBySeason[state.seasonType]
            : 0;

        pointsByPlayer[player.player] += pts;
      });
    });
  });

  // Sort by points descending
  const sorted = filtered.sort((a, b) => pointsByPlayer[b.player] - pointsByPlayer[a.player]);

  let lastScore = null;
  let lastRank = 0;

  sorted.forEach((p, idx) => {
    const score = pointsByPlayer[p.player];
    let rank = score === lastScore ? lastRank : idx + 1;
    if (rank !== lastRank) lastRank = rank;
    lastScore = score;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${rank}</td><td>${p.player}</td><td>${score}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// ===============================
// Player dropdown
// ===============================

export function renderPlayerDropdown() {
  playerSelect.innerHTML = "";

  const filtered = pool.filter(p => state.showSmallGroup ? p.inSnapCount : true);

  filtered.forEach((p, index) => {
    const option = document.createElement("option");
    option.value = p.player;
    option.textContent = p.player;
    playerSelect.appendChild(option);

    if (index === 0 && (!state.selectedPlayer || !filtered.some(f => f.player === state.selectedPlayer))) {
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

  // Set currently selected week
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

    const opponent = game.opponent ?? "N/A";
    const winner = game.score >= game.opponentScore ? game.team : game.opponent;
    const fullScore = (() => {
      if (game.state === "pre") return game.status;

      let scoreText = `${game.score}-${game.opponentScore}`;

      if (game.score !== game.opponentScore) {
        const winnerTeam = game.score > game.opponentScore ? game.team : game.opponent;
        const winnerLogo = state.teamLogos[winnerTeam] || "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png";
        scoreText += ` <img src="${winnerLogo}" class="team-cell-logo" alt="${winnerTeam} logo"> ${winnerTeam}`;
      }

      return scoreText;
    })();


    let result = "?";
    let points = "?";
    if (game.state === "post") {
      if (game.score > game.opponentScore) { result = "W"; points = pointsBySeason[state.seasonType]; }
      else if (game.score < game.opponentScore) { result = "L"; points = 0; }
      else { result = "T"; points = 0.5 * pointsBySeason[state.seasonType]; }
    }

    const teamLogo = state.teamLogos[team] || "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png";
    const opponentLogo = state.teamLogos[opponent] || "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${teamLogo}" class="team-cell-logo" alt="${team} logo"> ${team}</td>
      <td><img src="${opponentLogo}" class="team-cell-logo" alt="${opponent} logo"> ${opponent}</td>
      <td>${fullScore}</td>
      <td>${result}</td>
      <td>${points}</td>
    `;

    if (result === "W") row.cells[3].style.color = "green";
    if (result === "L") row.cells[3].style.color = "red";

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
  const colors = ["#FF4C4C","#4CFF4C","#4C4CFF","#FFD700","#FF7F50","#8A2BE2"];

  const datasets = playersList.map((player, idx) => {
    let cumulative = 0;
    const data = weeks.map(w => {
      (state.totalGames[w] || []).forEach(g => {
        const playerObj = pool.find(p => p.player === player);
        if (playerObj?.teamList.includes(g.team)) {
          if (g.state === "post") {
            cumulative += g.score > g.opponentScore
              ? pointsBySeason[state.seasonType]
              : g.score === g.opponentScore
                ? 0.5 * pointsBySeason[state.seasonType]
                : 0;
          }
        }
      });
      return cumulative;
    });

    return {
      label: player,
      data,
      fill: false,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
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
