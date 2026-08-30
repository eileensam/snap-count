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

2026 team prices live in the `teams` array in `index.html`.

## Phase 2: full v2 rebuild (after 2026-09-09)

- Leaderboard and stats pages, rebuilt with cleaner scoring logic (fixes v1's playoff-round and tie-handling bugs).
- New stat ideas to explore: all-time archive (since 1997), rivalry tracker (head-to-head between two players over the years), nail-biters (biggest live win-probability swings), bandwagon index (cost vs. points), rank volatility (biggest week-over-week swing), playoff swing (points gained/lost in postseason relative to regular-season standing).

Phase 1 replaces `index.html` (the current homepage) directly, see [decisions.md](decisions.md).

## Status

- Phase 1 pick-helper is built and live at `index.html`, on the [design system](design/system.md): cream paper, Oswald/Bodoni Moda type, vintage NFL logo badges.
- Built: countdown, budget-tracked catalog with conference/division filters and sort, coverage report, share picks, saved lineups (with duplicate-name prevention and in-place editing).
- Working through a testing/feedback pass on the shipped feature set before the 2026-09-09 deadline.

## Open items

None currently open for Phase 1.
