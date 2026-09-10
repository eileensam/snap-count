# Roadmap

v1 (the 2025-season codebase) is archived at git tag `v1-2025-season`, history only, not browsable on the live site. v2 is being built in this same repo, same GitHub Pages hosting.

**Why a rebuild:** v1 required weekly hand-maintenance and had scoring-logic bugs, particularly around playoff round handling and ties. v2 also aims for a more polished, more fun design and stat set than v1 had.

## Phase 1: pick-helper (in progress)

**Deadline: kickoff of the first regular-season game, Wednesday 2026-09-09, 7:20pm CT.** Picks and the $25 entry are due to the commissioner by then.

Scope:
- Countdown to the deadline.
- Pick-helper: an exploration/comparison tool, not a recommender. No "ideal lineup" suggestion.
  - All 32 teams, this season's prices.
  - Running budget total against the $250 cap as the player builds a hypothetical roster (no team-count limit).
  - Sortable (price high/low, name A-Z/Z-A) and filterable (conference, division).
  - Each team links out to its ESPN team page.
  - Mobile-first: this is the primary use case, players will use this on their phones.

Shipped beyond the original minimal scope, from mid-build brainstorming:
- Coverage report: conference/division breakdown of the current picks.
- Share picks: native share sheet (falls back to a blank-recipient `mailto:` draft) so a player can send their picks to the commissioner without the app knowing or storing anyone's email.
- Saved lineups: name and store multiple hypothetical rosters in `localStorage`, reload any of them onto the board, update a loaded lineup in place or save changes as a new one, duplicate names rejected.

2026 team prices live in the `teams` array in `team-picker.html`.

## Day-one gameday launch (2026-09-08, ahead of full Phase 2)

Not everyone has picks in by kickoff, so rather than wait for the full Phase 2 rebuild (or ship a throwaway placeholder), the site split into three pages. See [decisions.md](decisions.md) for why.

- `index.html`: games this week (live from ESPN's scoreboard API, never hardcoded) with the point stake for a win, and a leaderboard shell that reads "Awaiting picks…" until real rosters exist. Games section sits above the leaderboard for now, since the leaderboard has nothing to show yet; reorder once it does.
- `team-picker.html`: the Phase 1 pick-helper, unchanged, just renamed. Stays reachable until picks settle for the season, then gets decommissioned.
- `rules.html`: plain Scoring/Prizes reference, no Entry or Groups sections, no family name (public page).
- All three cross-link in the header. **Superseded 2026-09-09**: nav order is now Leaderboard · Games · Rules, see the "Live leaderboard & graph" section below and [decisions.md](decisions.md).

## Live leaderboard & graph (2026-09-09, once picks were in)

Once the commissioner sent this season's picks, `index.html` went from the day-one shell above to a real leaderboard:

- All 20 players' actual rosters wired in, Small Group flagged (Chris R., Eileen, Emma, Erika, Sean R.).
- Real scoring from ESPN results: 1 pt/win, 0.5 pt/tie, regular season only for now (see postseason open item below). Only finished games count; live games poll every 30s so scores/standings update without a reload.
- Leaderboard rows: rank (ties share a rank, 1/2/3 colored gold/silver/bronze), name, points, tap to expand and see that player's picks.
- Trajectory graph (cumulative points by week) lives at the top of the Leaderboard tab: Full League lines are faint unlabeled background context, Small Group lines use the five design-system content colors. No persistent end labels (they collided whenever players were tied, which is common); instead every point on every line has a hover/tap target showing player and points, positioned to flip sides near the chart edges so it's never clipped.
- Live/final games render as a scorebug (badge, name, big score, leading team in ink vs. trailing team dimmed) instead of an inline score; upcoming games keep the simpler matchup row. Live games get a green dot + green clock text.
- Nav and tabs merged into one row: **Leaderboard · Games · Rules**, same style everywhere, current one bold. "Home" retired as a concept; Leaderboard/Games act as in-page tabs on `index.html` and as links (`index.html` / `index.html?tab=games`) from `rules.html` and `team-picker.html`.
- `rules.html` also shows the live "Week N · Regular Season" subtitle now, not just `index.html`.
- Team Picker link removed from nav (page itself untouched, still reachable by URL for stragglers).

## Phase 2: full v2 rebuild (after 2026-09-09)

- Leaderboard and stats pages, rebuilt with cleaner scoring logic (fixes v1's playoff-round and tie-handling bugs).
- New stat ideas to explore: all-time archive (since 1997), rivalry tracker (head-to-head between two players over the years), nail-biters (biggest live win-probability swings), bandwagon index (cost vs. points, i.e. value/underperformance), rank volatility (biggest week-over-week swing), playoff swing (points gained/lost in postseason relative to regular-season standing), ideal lineup in hindsight (best possible $250 roster after the fact, distinct from legacy's pre-pick Perfect Lineup: retrospective trivia once picks are locked, not a recommendation, so it doesn't reopen the "not a recommendation engine" decision in [decisions.md](decisions.md)).

Phase 1 replaced `index.html` (the original homepage) directly when it first shipped; as of the day-one gameday launch above, `index.html` is the gameday view and the pick-helper lives at `team-picker.html` instead. See [decisions.md](decisions.md).

## Status

- Phase 1 pick-helper is built, on the [design system](design/system.md): cream paper, Oswald/Bodoni Moda type, vintage NFL logo badges. Live at `team-picker.html`.
- Built: countdown, budget-tracked catalog with conference/division filters and sort, coverage report, share picks, saved lineups (with duplicate-name prevention and in-place editing).
- Day-one gameday launch is built: live games list with point stakes, rules page, cross-page nav.
- Live leaderboard & graph (above) is built: real picks, real scoring, tap-to-expand picks, trajectory graph with hover/tap detail, scorebug for live/final games, unified Leaderboard/Games/Rules nav.

## Open items

- Postseason point-stake display (3/3/5/5) on the games list, not needed until the playoffs.
- Fun stats (see Phase 2 stat ideas below) and the fun-fact blurb (a short editorial note, like v1 had, restyled on-system) are still unbuilt.
- Link the source Forbes article on `rules.html` once the actual URL is confirmed.
- Decommission `team-picker.html` once picks settle for the season (nav link to it is already removed; the page itself is still live for stragglers).
