import { teams } from './statics.js';

// Sample data
const pool = [
  {
    player: "Chris",
    teamList: [
        {
            shortName: "NAME",
            cost: 999
        },
    ],
    totalPoints: "?"
  },
  {
    player: "Eileen",
    teamList: [
        {
            shortName: "NAME",
            cost: 999
        },
    ],
    totalPoints: "?"
    },
  {
    player: "Emma",
    teamList: [
        {
            shortName: "NAME",
            cost: 999
        },
    ],
    totalPoints: "?"
    },
  {
    player: "Erika",
    teamList: [
        {
            shortName: "NAME",
            cost: 999
        },
    ],
    totalPoints: "?"
    },
];

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

// Populate week dropdown (example: weeks 1–3)
const weekSelect = document.querySelector("#week-select");
[1, 2, 3].forEach(week => {
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
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team}</td>
      <td>OPPONENT</td>        <!-- Placeholder for opponent -->
      <td>SCORE</td>           <!-- Placeholder for score -->
      <td>RESULT</td>          <!-- Placeholder for W/L -->
      <td>POINTS</td>          <!-- Placeholder for points -->
    `;
    playerTableBody.appendChild(row);
  });
}

// Initial population for the first player
if (pool.length > 0) {
  populatePlayerTable(pool[0].player);
}

// Event listener for player dropdown
playerSelect.addEventListener("change", (e) => {
  populatePlayerTable(e.target.value);
});

