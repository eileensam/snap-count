import { pool, teams } from './statics.js';

let teamGames = [];

// Populate leaderboard
const leaderboardTable = document.querySelector("#leaderboard-table tbody");
pool.forEach(p => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${p.player}</td><td>${p.totalPoints}</td>`;
  leaderboardTable.appendChild(row);
});

// Populate player dropdown
const playerSelect = document.querySelector("#player-select");
pool.forEach(p => {
  const option = document.createElement("option");
  option.value = p.player;
  option.textContent = p.player;
  playerSelect.appendChild(option);
});

// Populate week dropdown (example: week 1)
const weekSelect = document.querySelector("#week-select");
[1].forEach(week => {
  const option = document.createElement("option");
  option.value = week;
  option.textContent = `Week ${week}`;
  weekSelect.appendChild(option);
});

// Player table reference
const playerTableBody = document.querySelector("#player-table tbody");

// Function to populate player table
function populatePlayerTable(playerName) {
  // Clear existing rows
  playerTableBody.innerHTML = "";

  // Find the selected player
  const selectedPlayer = pool.find(p => p.player === playerName);
  if (!selectedPlayer) return;

  // Populate table with their teams
  selectedPlayer.teamList.forEach(team => {
    const game = teamGames.find(g => g.team === team);
    if (!game) return;
    const opponent = game?.opponent ?? "N/A";

    // Determine winner
    const winner = game.score >= game.opponentScore ? game.team : game.opponent;

    // Full score string
    const fullScore = `${game.score}-${game.opponentScore} ${winner}`;

    // Result for the player’s team
    const result = game.score > game.opponentScore ? "W" : (game.score < game.opponentScore ? "L" : "T");

    const points = "?"; // Your scoring logic

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team}</td>
      <td>${opponent}</td>
      <td>${fullScore}</td>
      <td>${result}</td>
      <td>${points}</td>
    `;
    playerTableBody.appendChild(row);
  });
}

// Fetch the entire ESPN scoreboard
async function fetchScores() {
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
          status: event.status.type.shortDetail
        },
        {
          team: away.team.name,
          score: parseInt(away.score),
          opponent: home.team.name,
          opponentScore: parseInt(home.score),
          status: event.status.type.shortDetail
        }
      ];
    });

    console.log("Team games:", teamGames);

    // Populate the first player table after data is loaded
    if (pool.length > 0) {
      populatePlayerTable(pool[0].player);
    }

  } catch (err) {
    console.error("Error fetching scores:", err);
  }
}

// Actually call fetchScores
fetchScores();

// Event listener for player dropdown
playerSelect.addEventListener("change", (e) => {
  populatePlayerTable(e.target.value);
});
