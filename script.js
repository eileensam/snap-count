import { pool, teams, pointsBySeason, players } from './statics.js';

let teamGames = [];
let season = "REG";

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

// Populate player dropdown
pool.forEach(p => {
  const option = document.createElement("option");
  option.value = p.player;
  option.textContent = p.player;
  playerSelect.appendChild(option);
});

// Populate week dropdown (example: week 1)
[1, 2].forEach(week => { // TODO add all weeks
  const option = document.createElement("option");
  option.value = week;
  option.textContent = `Week ${week}`;
  weekSelect.appendChild(option);
});

function populateLeaderboard() {
  leaderboardTable.innerHTML = ""; // Clear previous rows
  const sortedPool = [...pool].sort((a, b) => pointsByPlayer[b.player] - pointsByPlayer[a.player]);
  sortedPool.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.player}</td><td>${pointsByPlayer[p.player]}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// Function to populate player table
function populatePlayerTable(playerName) {
  playerTableBody.innerHTML = ""; // Clear existing rows

  const selectedPlayer = pool.find(p => p.player === playerName);
  if (!selectedPlayer) return;

  selectedPlayer.teamList.forEach(team => {
    const game = teamGames.find(g => g.team === team);
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
    if (result === "W") {
      row.cells[3].style.color = "green";
    } else if (result === "L") {
      row.cells[3].style.color = "red";
    }
    playerTableBody.appendChild(row);

  });
}

// Calculate points for all players
function calculateAllPoints() {
  Object.keys(pointsByPlayer).forEach(p => pointsByPlayer[p] = 0);

  pool.forEach(player => {
    player.teamList.forEach(team => {
      const game = teamGames.find(g => g.team === team);
      if (!game || game.state !== "post") return;

      const result = game.score > game.opponentScore ? "W" : (game.score < game.opponentScore ? "L" : "T");
      const points = result === "W" ? pointsBySeason[season] : (result === "T" ? 0.5 * pointsBySeason[season] : 0);
      pointsByPlayer[player.player] += points;
    });
  });

  populateLeaderboard();
}

// Fetch the entire ESPN scoreboard
async function fetchScores() {
  showLoading();
  try {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
    const data = await response.json();

    teamGames = data['events'].flatMap(event => {
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

    console.log("Team games:", teamGames);

    calculateAllPoints();

    if (pool.length > 0) {
      populatePlayerTable(pool[0].player);
    }

  } catch (err) {
    console.error("Error fetching scores:", err);
  } finally {
    hideLoading();
  }
}

// Event listener for player dropdown
playerSelect.addEventListener("change", (e) => {
  populatePlayerTable(e.target.value);
});

// Start fetching scores
fetchScores();
