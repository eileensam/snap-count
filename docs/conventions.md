# Conventions

## Version control

- Commit directly to `main`. No feature branches unless there's a specific reason (e.g. a rewrite that would leave `main` undeployable for a while). GitHub Pages deploys on every push to `main`, so keep each commit self-contained and deployable.
- Commit message prefixes: `[feat]`, `[fix]`, `[docs]`, `[chore]`.
- **Committing locally is fine on its own. Pushing to origin is not automatic, ask each time before `git push`.** GitHub Pages deploys whatever's on `origin/main` live, so a push is a publish, not just a save point.

## Docs

- `docs/` is canonical. A docs update lands in the same commit as the code change it describes.
- `CLAUDE.md` stays a thin pointer into `docs/`, not a duplicate of it.

## Tooling

- No build step, package manager, or framework by default (matches v1). Introduce one only when there's a concrete reason for that specific piece of work; decide per-feature, not as a blanket rule change.

## Writing

- No em dashes, anywhere: docs, commit messages, UI copy, chat replies. No punchy ad-copy fragments or slogans. Full, natural sentences. See [design/system.md](design/system.md) for how this extends to visual design (minimal, no unnecessary elements).

## Discuss before building

Agreeing on data and rules (what a feature must do, budget caps, scoring, filters) is not the same as agreeing on UX (how it looks and behaves: layout, interaction model, control scheme, visual hierarchy). Both need to be discussed before writing code for a new page or nontrivial feature. Reaching alignment on the first kind doesn't license building past the second.

Applying [design/system.md](design/system.md) is also part of this default, for every feature, including a "function first" MVP, not something to defer silently. If visual polish is genuinely being deferred on purpose, say so explicitly rather than shipping off-system styling (or none) by default.

## Visual iteration

Any visual/UI change gets rendered and actually looked at before it's shown to the user, not guessed at from CSS. Iterate until it looks right, then present it. Since Snap-Count is mobile-first, confirm the mobile layout specifically, not just a desktop-width render.

**Use real mobile emulation (puppeteer-core), not the raw Chrome CLI flags.** `chrome --headless --window-size=<narrow>,<h> --screenshot=...` does not reliably produce a real narrow layout viewport on macOS: the screenshot gets cropped to the requested size, but the actual CSS layout can still run at a wider viewport underneath (observed ~500px floor), silently clipping content out of frame rather than reflowing it. This looks exactly like a layout bug (e.g. content missing/cut off) but isn't one, and cost real time to misdiagnose. `puppeteer-core` driving the same local Chrome install with `page.setViewport({ width, height, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })` sets a real emulated viewport and doesn't have this problem.

One-time setup in a scratch directory (not part of the repo, this is a dev tool, not site code):
```
npm init -y && npm install puppeteer-core
```

Render script (adjust width/height per device):
```js
import puppeteer from 'puppeteer-core';
import path from 'path';

const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.goto('file://' + path.resolve('<path-to-file.html>'), { waitUntil: 'networkidle0' });
await page.screenshot({ path: '<output.png>' });
await browser.close();
```

Read the resulting PNG back to actually see it. `page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)` is a cheap automated check for horizontal overflow.

**For interactive features, simulate real taps and assert on the result**, not just a static screenshot. `page.evaluate(() => document.querySelector('.thing').click())` plus reading back DOM state (text content, class names) catches logic bugs a screenshot alone won't, click a control, filter, remove a selection, reload and confirm persistence, etc.

