// core/api.js
import { state, saveState } from './state.js';

export const teamLogos = {}

export async function fetchWeekGames(week) {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.events.flatMap(event => {
      const [home, away] = event.competitions[0].competitors;

      // update team logos in state
      state.teamLogos[home.team.name] = home.team.logo;
      state.teamLogos[away.team.name] = away.team.logo;

      // persist logos immediately
      saveState();

      // Grab in-progress win probability safely
      let homeWP = null;
      let awayWP = null;
      if (event.status.type.state === "in") {
        try {
          const prob = event.competitions[0].situation?.lastPlay?.probability;
          if (prob) {
            homeWP = +prob.homeWinPercentage * 100;
            awayWP = +prob.awayWinPercentage * 100;
          }
        } catch (err) {
          console.warn(`Failed to get live WP for ${home.team.name} vs ${away.team.name}`);
        }
      }

      return [
        {
          team: home.team.name,
          score: +home.score,
          opponent: away.team.name,
          opponentScore: +away.score,
          state: event.status.type.state,
          status: event.status.type.shortDetail,
          wp: homeWP
        },
        {
          team: away.team.name,
          score: +away.score,
          opponent: home.team.name,
          opponentScore: +home.score,
          state: event.status.type.state,
          status: event.status.type.shortDetail,
          wp: awayWP
        }
      ];
    });
  } catch (err) {
    console.error(`Error fetching NFL week ${week}:`, err);
    return [];
  }
};

// New function: fetch current week and season info
export async function fetchCurrentWeekInfo() {
  try {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      currentWeek: data.week.number,
      seasonType: data.leagues[0].season.type.name
    };
  } catch (err) {
    console.error("Failed to fetch current week info:", err);
    return null;
  }
}
