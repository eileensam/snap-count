# Conventions

## Version control

- Commit directly to `main`. No feature branches unless there's a specific reason (e.g. a rewrite that would leave `main` undeployable for a while) — GitHub Pages deploys on every push to `main`, so keep each commit self-contained and deployable.
- Commit message prefixes: `[feat]`, `[fix]`, `[docs]`, `[chore]`.

## Docs

- `docs/` is canonical. A docs update lands in the same commit as the code change it describes.
- `CLAUDE.md` stays a thin pointer into `docs/`, not a duplicate of it.

## Tooling

- No build step, package manager, or framework by default (matches v1). Introduce one only when there's a concrete reason for that specific piece of work — decide per-feature, not as a blanket rule change.
