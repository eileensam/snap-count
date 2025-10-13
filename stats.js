// stats.js
import { pool, teamCosts, pointsBySeason } from './statics.js';

const statsContainer = document.getElementById("stats-container");

// Retrieve stored data or initialize
let totalGames = JSON.parse(localStorage.getItem("totalGames") || "{}");
let currentWeek = Number(localStorage.getItem("currentWeek")) || null;
let seasonType = localStorage.getItem("seasonType") || null;

// ==========================
// Fetch all weeks if needed
// ==========================
async function fetchAllWeeks() {
    if (currentWeek && Object.keys(totalGames).length >= currentWeek) return;

    try {
        // Fetch current week first
        const resp = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
        const data = await resp.json();
        currentWeek = data["week"]["number"];
        seasonType = data["leagues"][0]["season"]["type"]["name"];

        localStorage.setItem("currentWeek", currentWeek);
        localStorage.setItem("seasonType", seasonType);

        // Generate week list
        const weeks = Array.from({length: currentWeek}, (_, i) => i + 1);

        // Fetch scores for each week
        for (const week of weeks) {
            if (!totalGames[week]) {
                const respWeek = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?&week=${week}`);
                const dataWeek = await respWeek.json();
                totalGames[week] = dataWeek.events.flatMap(event => {
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
            }
        }

        // Save to localStorage
        localStorage.setItem("totalGames", JSON.stringify(totalGames));

    } catch (err) {
        console.error("Error fetching weeks:", err);
    }
}

// ==========================
// Calculate cumulative team points
// ==========================
function calculateTeamPoints() {
    const pointsByTeam = {};

    // Initialize all team points
    teamCosts.forEach(tc => pointsByTeam[tc.name] = 0);

    // Sum points across all weeks
    Object.values(totalGames).forEach(games => {
        games.forEach(game => {
            if (game.state === "post") {
                const points = game.score > game.opponentScore ? pointsBySeason[seasonType] :
                               (game.score === game.opponentScore ? 0.5 * pointsBySeason[seasonType] : 0);
                pointsByTeam[game.team] += points;
            }
        });
    });

    return pointsByTeam;
}

// ==========================
// Render stats sections
// ==========================
// ==========================
// Render stats sections
// ==========================
function renderStats(pointsByTeam) {
    // ---- Shared Calculations ----
    const roiByTeam = {};
    for (const [team, pts] of Object.entries(pointsByTeam)) {
        const teamObj = teamCosts.find(t => t.name === team);
        if (!teamObj) continue;
        roiByTeam[team] = pts / teamObj.cost;
    }

    // ---- Heaviest Hitter ----
    const maxPoints = Math.max(...Object.values(pointsByTeam));
    const topScorers = Object.entries(pointsByTeam).filter(([_, pts]) => pts === maxPoints);

    const hitterSection = document.createElement("section");
    hitterSection.className = "stat-section";
    hitterSection.innerHTML = `
        <h2 title="Calculated as sum of points each team earned across all weeks">
            Heaviest Hitter${topScorers.length > 1 ? 's' : ''}
        </h2>
        ${topScorers.map(([team, pts]) => `<p>${team} — ${pts} points</p>`).join('')}
    `;
    statsContainer.appendChild(hitterSection);

    // ---- Most Valuable Team ----
    const highestRoi = Math.max(...Object.values(roiByTeam));
    const mvtList = Object.entries(roiByTeam).filter(([_, roi]) => roi === highestRoi);

    const mvtSection = document.createElement("section");
    mvtSection.className = "stat-section";
    mvtSection.innerHTML = `
        <h2 title="Calculated as (total points ÷ cost)">
            Most Valuable Team${mvtList.length > 1 ? 's' : ''}
        </h2>
        ${mvtList.map(([team, roi]) => {
            const teamObj = teamCosts.find(t => t.name === team);
            const points = pointsByTeam[team];
            return `<p>${team} — ${points} points, cost $${teamObj.cost} → value ${roi.toFixed(2)}</p>`;
        }).join('')}
    `;
    statsContainer.appendChild(mvtSection);

    // ---- Least Valuable Team ----
    const lowestRoi = Math.min(...Object.values(roiByTeam));
    const lvtList = Object.entries(roiByTeam).filter(([_, roi]) => roi === lowestRoi);

    const lvtSection = document.createElement("section");
    lvtSection.className = "stat-section";
    lvtSection.innerHTML = `
        <h2 title="Calculated as (total points ÷ cost)">
            Least Valuable Team${lvtList.length > 1 ? 's' : ''}
        </h2>
        ${lvtList.map(([team, roi]) => {
            const teamObj = teamCosts.find(t => t.name === team);
            const points = pointsByTeam[team];
            return `<p>${team} — ${points} points, cost $${teamObj.cost} → value ${roi.toFixed(2)}</p>`;
        }).join('')}
    `;
    statsContainer.appendChild(lvtSection);

    // ---- Biggest Upset by Cost ----
    let biggestUpset = null;
    let maxDisparity = -Infinity;

    Object.values(totalGames).forEach(games => {
        games.forEach(game => {
            if (game.state !== "post") return;

            let winner, loser;
            let winnerScore = game.score;
            let loserScore = game.opponentScore;

            if (game.score > game.opponentScore) {
                winner = game.team;
                loser = game.opponent;
            } else if (game.score < game.opponentScore) {
                winner = game.opponent;
                loser = game.team;
                // swap scores
                [winnerScore, loserScore] = [loserScore, winnerScore];
            } else {
                return; // skip ties
            }

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
        upsetSection.className = "stat-section";
        upsetSection.innerHTML = `
            <h2>Biggest Upset by Cost</h2>
            <p>${biggestUpset.winner} defeated ${biggestUpset.loser} — ${biggestUpset.winnerScore}-${biggestUpset.loserScore} (disparity: $${biggestUpset.disparity})</p>
        `;
        statsContainer.appendChild(upsetSection);
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
