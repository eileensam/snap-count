import { pool, teamCosts, pointsBySeason } from '../core/statics.js';
import { fetchCurrentWeekInfo, fetchWeekGames } from '../core/api.js';

const statsContainer = document.getElementById("stats-container");

// State storage
let totalGames = JSON.parse(localStorage.getItem("totalGames") || "{}");
let currentWeek = Number(localStorage.getItem("currentWeek")) || null;
let seasonType = localStorage.getItem("seasonType") || null;

// --------------------
// Fetch all weeks using api.js
// --------------------
async function fetchAllWeeks() {
    if (currentWeek && Object.keys(totalGames).length >= currentWeek) return;

    // 1️⃣ Fetch current week info
    const info = await fetchCurrentWeekInfo();
    if (info) {
        currentWeek = info.currentWeek;
        seasonType = info.seasonType;

        localStorage.setItem("currentWeek", currentWeek);
        localStorage.setItem("seasonType", seasonType);
    }

    // 2️⃣ Fetch all weeks
    for (let week = 1; week <= currentWeek; week++) {
        if (!totalGames[week]) {
            totalGames[week] = await fetchWeekGames(week);
        }
    }

    localStorage.setItem("totalGames", JSON.stringify(totalGames));
}

// --------------------
// Calculate cumulative team points
// --------------------
function calculateTeamPoints() {
    const pointsByTeam = {};
    teamCosts.forEach(tc => pointsByTeam[tc.name] = 0);

    Object.values(totalGames).forEach(games => {
        games.forEach(game => {
            if (game.state === "post") {
                const points = game.score > game.opponentScore
                    ? pointsBySeason[seasonType]
                    : (game.score === game.opponentScore ? 0.5 * pointsBySeason[seasonType] : 0);
                pointsByTeam[game.team] += points;
            }
        });
    });

    return pointsByTeam;
}

// --------------------
// Render stats
// --------------------
function renderStats(pointsByTeam) {
    statsContainer.innerHTML = ""; // clear previous content

    const roiByTeam = {};
    for (const [team, pts] of Object.entries(pointsByTeam)) {
        const teamObj = teamCosts.find(t => t.name === team);
        if (!teamObj) continue;
        roiByTeam[team] = pts / teamObj.cost;
    }

    // Heaviest Hitter
    const maxPoints = Math.max(...Object.values(pointsByTeam));
    const topScorers = Object.entries(pointsByTeam).filter(([_, pts]) => pts === maxPoints);

    const hitterSection = document.createElement("section");
    hitterSection.className = "stat-card";
    hitterSection.innerHTML = `
        <h2 title="Sum of points each team earned across all weeks">
            Heaviest Hitter${topScorers.length > 1 ? 's' : ''}
        </h2>
        ${topScorers.map(([team, pts]) => `<p>${team} — ${pts} points</p>`).join('')}
    `;
    statsContainer.appendChild(hitterSection);

    // Most/Least Valuable Teams
    const highestRoi = Math.max(...Object.values(roiByTeam));
    const lowestRoi = Math.min(...Object.values(roiByTeam));

    const renderRoiSection = (title, list) => {
        const section = document.createElement("section");
        section.className = "stat-card";
        section.innerHTML = `
            <h2>${title}</h2>
            ${list.map(([team, roi]) => {
                const teamObj = teamCosts.find(t => t.name === team);
                return `<p>${team} — ${pointsByTeam[team]} points, cost $${teamObj.cost} → value ${roi.toFixed(2)}</p>`;
            }).join('')}
        `;
        statsContainer.appendChild(section);
    };

    renderRoiSection("Most Valuable Team", Object.entries(roiByTeam).filter(([_, roi]) => roi === highestRoi));
    renderRoiSection("Least Valuable Team", Object.entries(roiByTeam).filter(([_, roi]) => roi === lowestRoi));

    // Biggest Upset by Cost
    let biggestUpset = null;
    let maxDisparity = -Infinity;

    Object.values(totalGames).forEach(games => {
        games.forEach(game => {
            if (game.state !== "post") return;

            let winner, loser;
            let winnerScore = game.score;
            let loserScore = game.opponentScore;

            if (game.score > game.opponentScore) {
                winner = game.team; loser = game.opponent;
            } else if (game.score < game.opponentScore) {
                winner = game.opponent; loser = game.team;
                [winnerScore, loserScore] = [loserScore, winnerScore];
            } else return;

            const winnerObj = teamCosts.find(t => t.name === winner);
            const loserObj = teamCosts.find(t => t.name === loser);
            if (!winnerObj || !loserObj) return;

            const disparity = loserObj.cost - winnerObj.cost;
            if (disparity > maxDisparity) {
                maxDisparity = disparity;
                biggestUpset = { winner, loser, winnerScore, loserScore, disparity };
            }
        });
    });

    if (biggestUpset) {
        const upsetSection = document.createElement("section");
        upsetSection.className = "stat-card";
        upsetSection.innerHTML = `
            <h2>Biggest Upset by Cost</h2>
            <p>${biggestUpset.winner} defeated ${biggestUpset.loser} — ${biggestUpset.winnerScore}-${biggestUpset.loserScore}
            (disparity: $${biggestUpset.disparity})</p>
        `;
        statsContainer.appendChild(upsetSection);
    }
}

// --------------------
// Initialize stats page
// --------------------
async function initStats() {
    await fetchAllWeeks();
    const pointsByTeam = calculateTeamPoints();
    renderStats(pointsByTeam);
}

initStats();
