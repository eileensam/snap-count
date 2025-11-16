// core/api.js
export async function fetchWeekGames(week) {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.events.flatMap(event => {
      const [home, away] = event.competitions[0].competitors;
      return [
        {
          team: home.team.name,
          score: +home.score,
          opponent: away.team.name,
          opponentScore: +away.score,
          state: event.status.type.state,
          status: event.status.type.shortDetail
        },
        {
          team: away.team.name,
          score: +away.score,
          opponent: home.team.name,
          opponentScore: +home.score,
          state: event.status.type.state,
          status: event.status.type.shortDetail
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
