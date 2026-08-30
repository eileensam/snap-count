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
  - Sortable/filterable by price, division, conference.
  - Each team links out to its ESPN team page.
  - Mobile-first: this is the primary use case, players will use this on their phones.

2026 team prices: TBD where these live in code, see open item below.

## Phase 2: full v2 rebuild (after 2026-09-09)

- Leaderboard and stats pages, rebuilt with cleaner scoring logic (fixes v1's playoff-round and tie-handling bugs).
- New stat ideas to explore: all-time archive (since 1997), rivalry tracker (head-to-head between two players over the years), nail-biters (biggest live win-probability swings), bandwagon index (cost vs. points), rank volatility (biggest week-over-week swing), playoff swing (points gained/lost in postseason relative to regular-season standing).

Phase 1 replaces `index.html` (the current homepage) directly, see [decisions.md](decisions.md).

## Status

- `index.html` has been redesigned on the new [design system](design/system.md): a static "Season 2026 loading..." placeholder, cream paper and Bodoni italic type, replacing v1's pixel-font page.
- Countdown and pick-helper are not yet built.

## Open items

- Where 2026 team prices/config live in code (not yet built).
