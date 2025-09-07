// Sample data
const pool = [
  { player: "Chris", totalPoints: "?" },
  { player: "Eileen", totalPoints: "?" },
  { player: "Emma", totalPoints: "?" },
  { player: "Erika", totalPoints: "?" },
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
