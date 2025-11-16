import { pool, teamCosts, pointsBySeason } from '../core/statics.js';
import { fetchCurrentWeekInfo, fetchWeekGames } from '../core/api.js';
import { state } from '../core/state.js';

const statsContainer = document.getElementById("stats-container");

// ==========================
// State storage
// ==========================
let totalGames = JSON.parse(localStorage.getItem("totalGames") || "{}");
let currentWeek = Number(localStorage.getItem("currentWeek")) || null;
let seasonType = localStorage.getItem("seasonType") || null;

// ==========================
// Helper: create stat box
// ==========================
function createStatBox({ title, subtitle, content, logo }) {
    const section = document.createElement("section");
    section.className = "stat-card";
    section.innerHTML = `
        <div class="stat-header">
            ${logo ? `<img src="${logo}" class="stat-logo" alt="${title} logo">` : ""}
            <div class="stat-header-text">
                <h2 class="stat-title">${title}</h2>
                ${subtitle ? `<p class="stat-subtitle">${subtitle}</p>` : ""}
            </div>
        </div>
        <div class="stat-content">${content}</div>
    `;
    statsContainer.appendChild(section);
}

// ==========================
// Fetch all weeks using api.js
// ==========================
async function fetchAllWeeks() {
    if (currentWeek && Object.keys(totalGames).length >= currentWeek) return;

    const info = await fetchCurrentWeekInfo();
    if (info) {
        currentWeek = info.currentWeek;
        seasonType = info.seasonType;

        localStorage.setItem("currentWeek", currentWeek);
        localStorage.setItem("seasonType", seasonType);
    }

    for (let week = 1; week <= currentWeek; week++) {
        if (!totalGames[week]) {
            totalGames[week] = await fetchWeekGames(week);
        }
    }

    localStorage.setItem("totalGames", JSON.stringify(totalGames));
}

// ==========================
// Calculate cumulative team points
// ==========================
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

// ==========================
// Render stats
// ==========================
function renderStats(pointsByTeam) {
    statsContainer.innerHTML = ""; // clear previous content

    const roiByTeam = {};
    for (const [team, pts] of Object.entries(pointsByTeam)) {
        const teamObj = teamCosts.find(t => t.name === team);
        if (!teamObj) continue;
        roiByTeam[team] = pts / teamObj.cost;
    }

    // Helper to render a stat card
    function createStatCard(title, subtitle, teams) {
        const section = document.createElement("section");
        section.className = "stat-card";
        section.innerHTML = `
            <h2>${title}</h2>
            <p class="stat-subtitle">${subtitle}</p>
        `;

        const listContainer = document.createElement("div");
        listContainer.className = "team-list";

        teams.forEach(team => {
            const logoUrl = team.logo || state.teamLogos[team.name] || "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png";

            const row = document.createElement("div");
            row.className = "team-row";
            row.innerHTML = `
                <img src="${logoUrl}" class="team-logo" alt="${team.name} logo">
                <div class="team-info">
                    <p class="team-name">${team.name}</p>
                    <p class="team-stats">${team.stats}</p>
                </div>
            `;
            listContainer.appendChild(row);
        });

        section.appendChild(listContainer);
        statsContainer.appendChild(section);
    }

    // --------------------
    // Heaviest Hitter
    // --------------------
    const maxPoints = Math.max(...Object.values(pointsByTeam));
    const topScorers = Object.entries(pointsByTeam)
        .filter(([_, pts]) => pts === maxPoints)
        .map(([team, pts]) => ({
            name: team,
            stats: `${pts} points`,
            logo: state.teamLogos[team] // uses dictionary
        }));

    createStatCard(
        `Heaviest Hitter${topScorers.length > 1 ? 's' : ''}`,
        "Sum of points each team earned across all weeks",
        topScorers
    );

    // --------------------
    // Most Valuable / Least Valuable
    // --------------------
    const highestRoi = Math.max(...Object.values(roiByTeam));
    const lowestRoi = Math.min(...Object.values(roiByTeam));

    const mvtList = Object.entries(roiByTeam)
        .filter(([_, roi]) => roi === highestRoi)
        .map(([team, roi]) => ({
            name: team,
            stats: `${pointsByTeam[team]} points, value ${roi.toFixed(2)}`,
            logo: state.teamLogos[team]
        }));

    const lvtList = Object.entries(roiByTeam)
        .filter(([_, roi]) => roi === lowestRoi)
        .map(([team, roi]) => ({
            name: team,
            stats: `${pointsByTeam[team]} points, value ${roi.toFixed(2)}`,
            logo: state.teamLogos[team]
        }));

    createStatCard("Most Valuable Team", "Calculated as (total points ÷ cost)", mvtList);
    createStatCard("Least Valuable Team", "Calculated as (total points ÷ cost)", lvtList);

    // --------------------
    // Biggest Upset by Cost
    // --------------------
    let biggestUpset = null;
    let maxDisparity = -Infinity;

    Object.values(totalGames).forEach(games => {
        games.forEach(game => {
            if (game.state !== "post") return;

            let winner, loser, winnerScore = game.score, loserScore = game.opponentScore;

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
                biggestUpset = {
                    winner,
                    loser,
                    winnerScore,
                    loserScore,
                    disparity,
                    logo: state.teamLogos[winner]
                };
            }
        });
    });

    if (biggestUpset) {
        createStatCard(
            "Biggest Upset by Cost",
            "Largest disparity in team cost where the underdog won",
            [{
                name: `${biggestUpset.winner} defeated ${biggestUpset.loser}`,
                stats: `${biggestUpset.winnerScore}-${biggestUpset.loserScore} (disparity: $${biggestUpset.disparity})`,
                logo: biggestUpset.logo
            }]
        );
    }
}

// ==========================
// Initialize stats page
// ==========================
async function initStats() {
    await fetchAllWeeks();
    const pointsByTeam = calculateTeamPoints();
    renderStats(pointsByTeam);
}

initStats();
