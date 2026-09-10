# Design System

Vintage sports aesthetic, closer to a 1960s program or magazine masthead than a modern sports app. Reference images live locally at `docs/design/inspo-local/` (gitignored, not part of the repo since they're copyrighted scans).

## Principles

- **Black by default.** Every rule, border, and word of body copy is ink on cream paper. Color is reserved for content, a team, a status, a result, never used for chrome or navigation.
- **Minimal.** Default to the fewest text elements and zero motion. Don't split one message across multiple type treatments when it can be one line. Don't add a rule, label, or animation without a concrete functional reason. When in doubt, cut.
- **No self-explanation.** A page shows its content; it doesn't narrate itself with section labels, meta captions, or explanatory copy about what something is for.

## Color

| Token | Hex | Role |
|---|---|---|
| Paper | `#f6efd9` | Background, the only ground color |
| Ink | `#16130d` | Default structural color: text, rules, borders |
| Navy | `#1e3a5c` | Content color |
| Gold | `#a8791a` | Content color |
| Brick | `#a5382a` | Content color |
| Forest | `#2c5a3b` | Content color |
| Plum | `#5a3a72` | Content color |

The five content colors exist only to represent something real (a team, a leader, a warning). They never appear as generic UI accents.

On the pick-helper, over-budget and under-budget states use Brick and Forest directly (`--over`, `--under`). Each team's badge is bordered in that team's own dominant brand color, extracted from its logo, rather than drawn from the five-color set. This is a specific instance of the same rule (color represents something real), not an exception to it. The leaderboard's rank 1/2/3 numbers (gold/silver/bronze) follow the same pattern: real medal colors, not drawn from the five-color set, because they represent an actual placement.

## Type

Two typefaces, both from Google Fonts:

- **Display: [Oswald](https://fonts.google.com/specimen/Oswald)**, weight 500-600, uppercase where used. A modern revival of Alternate Gothic, the condensed sans seen on vintage American sports posters and team programs. Used for headlines, the wordmark, section labels, and any large or emphasized numeral (the countdown, prices), with `font-variant-numeric: tabular-nums` wherever digits line up.
- **Body/UI: [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda)**, weights 400-700, italic used for emphasis. High-contrast Didone serif, the same face historically paired with Vogue magazine's own masthead. Used for everything meant to be read at length: body copy, team names, filter labels, captions.

See [decisions.md](../decisions.md) for how this pairing (and which face carries "big" vs. "small" text) was arrived at.

## Wordmark

`SNAP-COUNT`, all caps, hyphen (not a dot or space), set in the display face.

## Reference implementation

`team-picker.html` (the Phase 1 pick-helper) is the original reference implementation: fonts loaded via `<link>`, tokens as CSS custom properties, real vintage team logo badges bordered in each team's extracted brand color, a hand-drawn circle (not a checkmark) as the selection indicator.

`index.html` (the gameday/leaderboard page) established a few patterns of its own once the leaderboard and graph were built: the scorebug for live/final games (badge, name, big tabular score, leading team in ink vs. trailing team dimmed to ink-soft), a hand-rolled inline SVG trajectory graph with no charting library (persistent colored dots only for the highlighted lines, hover/tap tooltips instead of always-visible labels to avoid collisions when players are tied), and a single nav row that doubles as in-page tabs (current item bold, everything else underlined, no separate tab-bar treatment).

## What this superseded

v1 used a pixel font (Press Start 2P) on a dark green background (`css/style.css`), an 8-bit retro-arcade look. That direction was explicitly rejected in favor of this one, see `docs/decisions.md`.
