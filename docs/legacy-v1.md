# v1 Architecture (pre-rebuild reference)

This describes the codebase as it exists today, carried over from v1 (tagged `v1-2025-season`). It will be superseded piece by piece as v2's phases land — update or delete sections here as their code gets replaced, rather than letting this drift.

Static, client-side NFL pool tracker. No backend, build step, package manager, or test suite — plain HTML/CSS/JS served as-is. Game data comes live from ESPN's public scoreboard API and is cached in `localStorage`.

## Running / deploying

No build or install step. Open `index.html` directly, or serve the directory with any static file server (e.g. `python3 -m http.server`) since ES module imports require `http(s)://`, not `file://`.

Deployment is automatic: `.github/workflows/jekyll-gh-pages.yml` builds and publishes to GitHub Pages on every push to `main`. There is no test or lint command in this repo.

## Architecture

**Two independent pages**, each with its own init flow — `index.html` (leaderboard) and `stats.html` (derived stats). `js/bootstrap.js` defines a shared page-router (`loadHeaderAndInit` + switch on pathname) but is **not currently referenced by either HTML file**; each page instead loads its own `js/pages/*.js` entrypoint directly and self-inits at the bottom of the file (`initLeaderboardPage()` / `initStats()` called unconditionally on module load). Keep this in mind before assuming `bootstrap.js` runs — it's dead code until something wires it up.

**`js/core/` modules:**
- `state.js` — the single mutable `state` object (current week, season type, `totalGames` keyed by week number, selected player/week, team logos). `loadState()`/`saveState()` mirror it to `localStorage`. `pages/stats.js` reads/writes `localStorage` directly instead of going through `state.js` — the two pages do not share a live state object, only the persisted keys.
- `api.js` — all ESPN calls (`site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`). `fetchWeekGames(week)` flattens each event into two per-team game records (home + away) with score, opponent, status, and live win-probability when a game is in progress. `fetchCurrentWeekInfo()` detects season type and offsets postseason week numbers by +18 (`REGULAR_SEASON_WEEKS`) so playoff weeks continue the regular-season numbering used everywhere else in the app.
- `statics.js` — all hardcoded league config: `players`, `teams`, the `pool` (each player's roster for the season, plus an `inSnapCount` flag distinguishing the "Small Group" from the "Full League"), scoring constants (`pointsBySeason`, `playoffPointsByRound`), and the fantasy-style `teamCosts`/`BUDGET` used only by the stats page. Changing the roster/scoring for a new season means editing this file directly. Note: this file's roster shape assumed a fixed 4-team pick — [decisions.md](decisions.md) confirms there's actually no team-count cap, only the $250 budget.
- `render.js` — all DOM rendering for the leaderboard page plus `getPointsForGame()`, the single source of truth for scoring a game (regular season vs. playoff round, win/tie/loss), imported by `pages/stats.js` too. Rank-delta arrows are computed by re-running the cumulative-points ranking as of `selectedWeek - 1` and diffing.
- `header.js` — fetches and injects the shared `header.html` fragment, and fetches current week/season info on first load if not already cached in `state`.
- `loading.js` — a single shared full-screen loading overlay singleton created at module-import time.

**`js/pages/`:**
- `index.js` — leaderboard: fetches all weeks up to `currentWeek` on first load (skips refetch if `state.totalGames` is already populated — data only gets fresher via a hard `localStorage` clear), then renders table/dropdowns/chart (Chart.js, loaded via CDN in `index.html`) and wires up player/week/group-toggle listeners.
- `stats.js` — derived "fun stats" built on top of the `teamCosts` fantasy layer, independent of the actual pool scoring: Heaviest Hitter, Most/Least Valuable (points ÷ cost), Biggest Upset (largest cost disparity where the cheaper team won), and Perfect Lineup (brute-force recursive subset search over all 32 teams for the best point total under `BUDGET` — O(2^32) worst case, a known perf risk).

**Feedback widget** (`bugnub.html`/`js/core/bugnub.js`): a floating modal loaded independently, submits free-text feedback via EmailJS (service/template/public keys are hardcoded client-side).

## Data model gotchas

- `state.totalGames[week]` is a flat array of per-team game rows (not per-matchup) — every game appears twice, once from each team's perspective.
- Season week numbering is unified across regular season and postseason via the +18 offset in `fetchCurrentWeekInfo`; `game.round` (used in `getPointsForGame`) distinguishes playoff scoring but is not set anywhere in `api.js`'s current fetch logic — check before relying on playoff-round point values. This is the likely source of the playoff-scoring bugs [roadmap.md](roadmap.md) cites as motivation for the v2 rebuild.
- Team logos are opportunistically populated into `state.teamLogos` as weeks are fetched and persisted separately from `totalGames`, so a team you haven't seen play yet has no cached logo (falls back to `NFL_LOGO`).
