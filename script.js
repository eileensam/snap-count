import { pool, pointsBySeason, players } from './statics.js';
import { populateWeekInfo } from './header.js';

// ==========================
// State variables
// ==========================
let totalGames = JSON.parse(localStorage.getItem("totalGames") || "{}");
let weekList = Object.keys(totalGames).map(Number).sort((a, b) => a - b);

let seasonType = localStorage.getItem("seasonType") || "";
let currentWeek = Number(localStorage.getItem("currentWeek")) || null;

let selectedPlayer = null;
let selectedWeek = currentWeek;

// Toggle for small group / full league
let showSmallGroup = true;

// Points by player
let pointsByPlayer = Object.fromEntries(Object.keys(players).map(p => [players[p], 0]));

// ==========================
// DOM references
// ==========================
const leaderboardTable = document.querySelector("#leaderboard-table tbody");
const playerSelect = document.querySelector("#player-select");
const weekSelect = document.querySelector("#week-select");
const playerTableBody = document.querySelector("#player-table tbody");

// Loading screen
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
loadingScreen.textContent = "Loading scores...";
Object.assign(loadingScreen.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  fontSize: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "9999"
});
document.body.appendChild(loadingScreen);

function showLoading() { loadingScreen.style.display = "flex"; }
function hideLoading() { loadingScreen.style.display = "none"; }

// ==========================
// Populate player dropdown
// ==========================
function populatePlayerDropdown() {
  playerSelect.innerHTML = "";
  const filtered = pool.filter(p => showSmallGroup ? p.inSnapCount : true);

  filtered.forEach((p, index) => {
    const option = document.createElement("option");
    option.value = p.player;
    option.textContent = p.player;
    playerSelect.appendChild(option);

    if (index === 0 && (!selectedPlayer || !filtered.some(f => f.player === selectedPlayer))) {
      selectedPlayer = p.player;
      playerSelect.value = p.player;
    }
  });
}

// ==========================
// Leaderboard table with ties
// ==========================
function populateLeaderboard() {
  leaderboardTable.innerHTML = "";

  const filtered = pool.filter(p => showSmallGroup ? p.inSnapCount : true);
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

// ==========================
// Player breakdown table
// ==========================
function populatePlayerTable() {
  playerTableBody.innerHTML = "";

  const playerObj = pool.find(p => p.player === selectedPlayer);
  if (!playerObj || !totalGames[selectedWeek]) return;

  playerObj.teamList.forEach(team => {
    const game = totalGames[selectedWeek].find(g => g.team === team);
    if (!game) return;

    const opponent = game.opponent ?? "N/A";
    const winner = game.score >= game.opponentScore ? game.team : game.opponent;
    const fullScore = game.state === "pre" ? game.status : `${game.score}-${game.opponentScore}${game.score !== game.opponentScore ? " " + winner : ""}`;

    let result = "?";
    let points = "?";
    if (game.state === "post") {
      if (game.score > game.opponentScore) { result = "W"; points = pointsBySeason[seasonType]; }
      else if (game.score < game.opponentScore) { result = "L"; points = 0; }
      else { result = "T"; points = 0.5 * pointsBySeason[seasonType]; }
    }

    const row = document.createElement("tr");
    row.innerHTML = `<td>${team}</td><td>${opponent}</td><td>${fullScore}</td><td>${result}</td><td>${points}</td>`;
    if (result === "W") row.cells[3].style.color = "green";
    if (result === "L") row.cells[3].style.color = "red";

    playerTableBody.appendChild(row);
  });
}

// ==========================
// Calculate points for all players
// ==========================
function calculateAllPoints() {
  Object.keys(pointsByPlayer).forEach(p => pointsByPlayer[p] = 0);

  pool.forEach(player => {
    player.teamList.forEach(team => {
      Object.values(totalGames).forEach(games => {
        const game = games.find(g => g.team === team);
        if (!game || game.state !== "post") return;

        const pts = game.score > game.opponentScore ? pointsBySeason[seasonType] :
                    (game.score === game.opponentScore ? 0.5 * pointsBySeason[seasonType] : 0);
        pointsByPlayer[player.player] += pts;
      });
    });
  });

  populateLeaderboard();
}

// ==========================
// Chart.js integration
// ==========================
let leaderboardChart = null;

function drawLeaderboardChart() {
  const ctx = document.getElementById("leaderboardChart")?.getContext("2d");
  if (!ctx) return;

  const filtered = pool.filter(p => showSmallGroup ? p.inSnapCount : true);
  const playersList = filtered.map(p => p.player);

  const weeks = weekList.filter(w => w <= selectedWeek);
  const colors = ["#FF4C4C","#4CFF4C","#4C4CFF","#FFD700","#FF7F50","#8A2BE2"];

  const datasets = playersList.map((player, idx) => {
    let cumulative = 0;
    const data = weeks.map(w => {
      (totalGames[w] || []).forEach(g => {
        if (pool.find(p => p.player === player)?.teamList.includes(g.team)) {
          if (g.state === "post") {
            cumulative += g.score > g.opponentScore ? pointsBySeason[seasonType] :
                          (g.score === g.opponentScore ? 0.5 * pointsBySeason[seasonType] : 0);
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

  leaderboardChart = new Chart(ctx, {
    type: "line",
    data: { labels: weeks.map(w => `Week ${w}`), datasets },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" }, title: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ==========================
// Initialize leaderboard page
// ==========================
export async function initLeaderboard() {
  showLoading();

  // Make sure week info is populated in DOM if available
  populateWeekInfo();

  // If totalGames is empty, fetch scores for all weeks
  if (!Object.keys(totalGames).length && currentWeek) {
    for (let week = 1; week <= currentWeek; week++) {
      try {
        const resp = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?&week=${week}`);
        const data = await resp.json();

        totalGames[week] = data.events.flatMap(e => {
          const [home, away] = e.competitions[0].competitors;
          return [
            { team: home.team.name, score: +home.score, opponent: away.team.name, opponentScore: +away.score, state: e.status.type.state, status: e.status.type.shortDetail },
            { team: away.team.name, score: +away.score, opponent: home.team.name, opponentScore: +home.score, state: e.status.type.state, status: e.status.type.shortDetail }
          ];
        });
      } catch (err) {
        console.error(`Error fetching week ${week}:`, err);
      }
    }
    localStorage.setItem("totalGames", JSON.stringify(totalGames));
    weekList = Object.keys(totalGames).map(Number).sort((a, b) => a - b);
  }

  // Populate week select dropdown
  weekSelect.innerHTML = "";
  weekList.slice().sort((a, b) => b - a).forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = `Week ${w}`;
    weekSelect.appendChild(opt);
  });
  weekSelect.value = selectedWeek;

  // -------------------------
  // Determine initial group toggle
  // -------------------------
  showSmallGroup = document.querySelector('input[name="leaderboard-group"]:checked').value === "snap";

  // -------------------------
  // Populate leaderboard and player data
  // -------------------------
  calculateAllPoints();          // fills pointsByPlayer and leaderboard table
  populatePlayerDropdown();      // fills player select dropdown
  populatePlayerTable();         // fills player breakdown table
  drawLeaderboardChart();        // renders Chart.js graph

  hideLoading();
}

// ==========================
// Event listeners
// ==========================
playerSelect.addEventListener("change", e => {
  selectedPlayer = e.target.value;
  populatePlayerTable();
});

weekSelect.addEventListener("change", e => {
  selectedWeek = Number(e.target.value);
  populatePlayerTable();
  drawLeaderboardChart();
});

// Toggle group
document.querySelectorAll('input[name="leaderboard-group"]').forEach(radio => {
  radio.addEventListener("change", e => {
    showSmallGroup = e.target.value === "snap";
    populatePlayerDropdown();
    populateLeaderboard();
    drawLeaderboardChart();
    populatePlayerTable();
  });
});
