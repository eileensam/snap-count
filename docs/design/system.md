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

## Type

Two typefaces, both from Google Fonts:

- **Display: [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda)**, weight 700, italic. High-contrast Didone serif. Used for headlines and the wordmark, sparingly, this carries the page's one big visual moment.
- **Body/UI: [Jost](https://fonts.google.com/specimen/Jost)**, weights 400-600. Geometric sans in the spirit of Vogue's own 1930s masthead face. Used for everything meant to be read or used: body copy, labels, numerals (with `font-variant-numeric: tabular-nums` wherever digits line up).

Origin: the pairing is a deliberate echo of Vogue magazine's own historical identity, which combined Bodoni display type with a geometric sans.

## Wordmark

`SNAP-COUNT`, all caps, hyphen (not a dot or space), set in the display face. The interpunct collided visually with Bodoni's italic swashes; the hyphen sits cleanly.

## Texture

A faint paper-grain overlay (`feTurbulence` SVG, ~5% opacity, `mix-blend-mode: multiply`) on the page background. Subtle enough to not affect readability.

## Reference implementation

`index.html` is the first real page built on this system, a single static line of Bodoni italic on cream paper. Use it as the starting point for structure (fonts loaded via `<link>`, tokens as CSS custom properties, the grain overlay as a `body::before`).

## What this superseded

v1 used a pixel font (Press Start 2P) on a dark green background (`css/style.css`), an 8-bit retro-arcade look. That direction was explicitly rejected in favor of this one, see `docs/decisions.md`.
