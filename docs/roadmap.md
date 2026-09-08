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
- All three cross-link in the header, Rules first whenever it's an option.

## Phase 2: full v2 rebuild (after 2026-09-09)

- Leaderboard and stats pages, rebuilt with cleaner scoring logic (fixes v1's playoff-round and tie-handling bugs).
- New stat ideas to explore: all-time archive (since 1997), rivalry tracker (head-to-head between two players over the years), nail-biters (biggest live win-probability swings), bandwagon index (cost vs. points, i.e. value/underperformance), rank volatility (biggest week-over-week swing), playoff swing (points gained/lost in postseason relative to regular-season standing), ideal lineup in hindsight (best possible $250 roster after the fact, distinct from legacy's pre-pick Perfect Lineup: retrospective trivia once picks are locked, not a recommendation, so it doesn't reopen the "not a recommendation engine" decision in [decisions.md](decisions.md)).

Phase 1 replaced `index.html` (the original homepage) directly when it first shipped; as of the day-one gameday launch above, `index.html` is the gameday view and the pick-helper lives at `team-picker.html` instead. See [decisions.md](decisions.md).

## Status

- Phase 1 pick-helper is built, on the [design system](design/system.md): cream paper, Oswald/Bodoni Moda type, vintage NFL logo badges. Live at `team-picker.html`.
- Built: countdown, budget-tracked catalog with conference/division filters and sort, coverage report, share picks, saved lineups (with duplicate-name prevention and in-place editing).
- Day-one gameday launch (above) is built: live games list with point stakes, leaderboard shell, rules page, cross-page nav.

## Open items

- Wire real leaderboard data once the commissioner sends this season's picks.
- Postseason point-stake display (3/3/5/5) on the games list, not needed until the playoffs.
- Trajectory graph and team cards, designed but not built, waiting on real pick data to have anything to show (see design/system.md's reference implementation notes for what's been prototyped).
- Link the source Forbes article on `rules.html` once the actual URL is confirmed.
- Decommission `team-picker.html` once picks settle for the season.
