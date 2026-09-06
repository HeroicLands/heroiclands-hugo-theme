---
---

**The protected-branch hooks were shadowed away here.** This repository points
git at `.githooks` through the `prepare` script, and a repository-local
`core.hooksPath` replaces the global one outright rather than adding to it — so
shipping only `commit-msg` did not leave the global `pre-commit` in place, it
disabled it. Committing on `main` was unguarded, and the refusal arrived at
push time, once the commit already existed and had to be moved off the branch.

`pre-commit`, `pre-merge-commit`, and `protected-branch.sh` now sit alongside
`commit-msg`, byte-identical to the copies in the system repository and
`package-build`. Two hooks and not one because git runs `pre-merge-commit`
_instead of_ `pre-commit` for a merge, so guarding only the latter still lets a
stray `git pull` on `main` write a merge commit.

They are an accident guard, not a control: `git commit --no-verify` bypasses
them, `git config hooks.allowCommitOnMain true` opts a checkout out
permanently, and a rebase is deliberately unaffected.

Nothing a consumer of the theme sees changes, so this ships no version.
