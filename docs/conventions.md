# Conventions

## Version control

- Commit directly to `main`. No feature branches unless there's a specific reason (e.g. a rewrite that would leave `main` undeployable for a while). GitHub Pages deploys on every push to `main`, so keep each commit self-contained and deployable.
- Commit message prefixes: `[feat]`, `[fix]`, `[docs]`, `[chore]`.

## Docs

- `docs/` is canonical. A docs update lands in the same commit as the code change it describes.
- `CLAUDE.md` stays a thin pointer into `docs/`, not a duplicate of it.

## Tooling

- No build step, package manager, or framework by default (matches v1). Introduce one only when there's a concrete reason for that specific piece of work; decide per-feature, not as a blanket rule change.

## Writing

- No em dashes, anywhere: docs, commit messages, UI copy, chat replies. No punchy ad-copy fragments or slogans. Full, natural sentences. See [design/system.md](design/system.md) for how this extends to visual design (minimal, no unnecessary elements).

## Visual iteration

Any visual/UI change gets rendered and actually looked at before it's shown to the user, not guessed at from CSS. Iterate until it looks right, then present it.

Local headless Chrome renders any HTML file to a screenshot without needing a dev server or a browser tool:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=<width>,<height> \
  --screenshot=<output.png> --virtual-time-budget=3000 \
  "file://<path-to-file.html>"
```

Read the resulting PNG back to actually see it. For anything with animation or interaction (JS-driven state), check the static states that matter, `virtual-time-budget` controls how long the page runs before the screenshot is taken.

