import { pool, teams, pointsBySeason, players, weekList } from './statics.js';

let teamGamesForWeek = [];
let totalGames = {};
let season = "REG";

let selectedPlayer = null;
let selectedWeek = null;

// Initialize pointsByPlayer
let pointsByPlayer = {
  [players.EILEEN]: 0,
  [players.EMMA]: 0,
  [players.ERIKA]: 0,
  [players.CHRIS]: 0,
};

// DOM references
const leaderboardTable = document.querySelector("#leaderboard-table tbody");
const playerSelect = document.querySelector("#player-select");
const weekSelect = document.querySelector("#week-select");
const playerTableBody = document.querySelector("#player-table tbody");

// Loading screen
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
loadingScreen.textContent = "Loading scores...";
loadingScreen.style.position = "fixed";
loadingScreen.style.top = "0";
loadingScreen.style.left = "0";
loadingScreen.style.width = "100%";
loadingScreen.style.height = "100%";
loadingScreen.style.backgroundColor = "rgba(0,0,0,0.5)";
loadingScreen.style.color = "#fff";
loadingScreen.style.fontSize = "2rem";
loadingScreen.style.display = "flex";
loadingScreen.style.alignItems = "center";
loadingScreen.style.justifyContent = "center";
loadingScreen.style.zIndex = "9999";
document.body.appendChild(loadingScreen);

function showLoading() {
  loadingScreen.style.display = "flex";
}

function hideLoading() {
  loadingScreen.style.display = "none";
}

// ==========================
// Populate dropdowns with defaults
// ==========================
pool.forEach((p, index) => {
  const option = document.createElement("option");
  option.value = p.player;
  option.textContent = p.player;
  playerSelect.appendChild(option);

  if (index === 0) {
    playerSelect.value = p.player;
    selectedPlayer = p.player;
  }
});

weekList
  .slice()
  .sort((a, b) => b - a) // sort descending
  .forEach((week, index) => {
    const option = document.createElement("option");
    option.value = week;
    option.textContent = `Week ${week}`;
    weekSelect.appendChild(option);

    if (index === 0) {
      weekSelect.value = week;
      selectedWeek = Number(week);
    }
  });


// ==========================
// Leaderboard table
// ==========================
function populateLeaderboard() {
  leaderboardTable.innerHTML = "";
  const sortedPool = [...pool].sort((a, b) => pointsByPlayer[b.player] - pointsByPlayer[a.player]);
  sortedPool.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.player}</td><td>${pointsByPlayer[p.player]}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// ==========================
// Player breakdown table
// ==========================
function populatePlayerTable() {
  playerTableBody.innerHTML = "";

  const playerObj = pool.find(p => p.player === selectedPlayer);
  if (!playerObj) return;

  const gamesThisWeek = totalGames[selectedWeek];
  if (!gamesThisWeek) return;

  playerObj.teamList.forEach(team => {
    const game = gamesThisWeek.find(g => g.team === team);
    if (!game) return;

    const opponent = game.opponent ?? "N/A";
    const winner = game.score >= game.opponentScore ? game.team : game.opponent;

    let fullScore;
    if (game.state === "pre") {
      fullScore = game.status;
    } else {
      fullScore = `${game.score}-${game.opponentScore}`;
      if (game.score !== game.opponentScore) {
        fullScore += " " + winner;
      }
    }

    let result = "?";
    let points = "?";
    if (game.state === "post") {
      if (game.score > game.opponentScore) {
        result = "W";
        points = pointsBySeason[season];
      } else if (game.score < game.opponentScore) {
        result = "L";
        points = 0;
      } else {
        result = "T";
        points = 0.5 * pointsBySeason[season];
      }
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team}</td>
      <td>${opponent}</td>
      <td>${fullScore}</td>
      <td>${result}</td>
      <td>${points.toString()}</td>
    `;
    if (result === "W") row.cells[3].style.color = "green";
    if (result === "L") row.cells[3].style.color = "red";

    playerTableBody.appendChild(row);
  });
}

// ==========================
// Calculate points for all players
// ==========================
function calculateAllPoints() {
  // Reset points
  Object.keys(pointsByPlayer).forEach(p => pointsByPlayer[p] = 0);

  pool.forEach(player => {
    player.teamList.forEach(team => {
      // Iterate over all weeks
      Object.values(totalGames).forEach(gamesThisWeek => {
        const game = gamesThisWeek.find(g => g.team === team);
        if (!game || game.state !== "post") return;

        const result = game.score > game.opponentScore ? "W" :
                       (game.score < game.opponentScore ? "L" : "T");
        const points = result === "W" ? pointsBySeason[season] :
                       (result === "T" ? 0.5 * pointsBySeason[season] : 0);
        pointsByPlayer[player.player] += points;
      });
    });
  });

  populateLeaderboard();
}


// ==========================
// Fetch scores from ESPN
// ==========================
async function fetchScores(weekNumber) {
  showLoading();
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?&week=${weekNumber}`);
    const data = await response.json();

    teamGamesForWeek = data['events'].flatMap(event => {
      const [home, away] = event.competitions[0].competitors;
      return [
        {
          team: home.team.name,
          score: parseInt(home.score),
          opponent: away.team.name,
          opponentScore: parseInt(away.score),
          state: event.status.type.state,
          status: event.status.type.shortDetail
        },
        {
          team: away.team.name,
          score: parseInt(away.score),
          opponent: home.team.name,
          opponentScore: parseInt(home.score),
          state: event.status.type.state,
          status: event.status.type.shortDetail
        }
      ];
    });

    totalGames[weekNumber] = teamGamesForWeek;
  } catch (err) {
    console.error("Error fetching scores:", err);
  } finally {
    hideLoading();
  }
}

// ==========================
// Initialize app
// ==========================
async function init() {
  // Fetch all weeks sequentially
  for (const week of weekList) {
    await fetchScores(week);
  }

  calculateAllPoints();
  populatePlayerTable();
}

init();

// ==========================
// Event listeners
// ==========================
playerSelect.addEventListener("change", (e) => {
  selectedPlayer = e.target.value;
  populatePlayerTable();
});

weekSelect.addEventListener("change", (e) => {
  selectedWeek = Number(e.target.value);
  populatePlayerTable();
});
