# Changesets

Every pull request declares the release it intends, as a file in this directory.
`npx changeset` writes one for you; the **Changeset declared** check fails a pull
request that has none.

Full narrative — the pipeline, and what a consumer has to do to receive a release
— is in [CONTRIBUTING.md](../CONTRIBUTING.md#releasing). This file is the card you
want open while writing one.

## Which bump

This package is on **0.x**, where the ordinary semver reading does not apply.

| The change …                                                                                                                 | Bump      |
| ---------------------------------------------------------------------------------------------------------------------------- | --------- |
| Fixes a fault; renders differently but breaks no consumer                                                                    | `patch`   |
| Adds a layout, a partial, a parameter, a class — additive                                                                    | `minor`   |
| **Breaks a consumer** — removes or renames a partial, a parameter, a required front-matter key, or a class a consumer styles | `minor`   |
| Ships nothing to consumers (CI, docs, repo housekeeping)                                                                     | _(empty)_ |

**A breaking change is a `minor`, not a `major`.** On 0.x a major bump means
declaring 1.0, and that is the maintainer's call about the theme's stability —
not a side effect of one pull request removing a partial. Never write `major` in
a changeset here; if you believe the theme has reached 1.0, say so in the issue
and let the maintainer decide.

Say so plainly in the summary when the bump is a breaking one, label the pull
request `breaking-change`, and name what a consumer must change.

## A change that ships nothing

Repo housekeeping — a workflow, a lint script, `CONTRIBUTING.md` — reaches no
consumer: the published tarball is `layouts`, `static`, `data`, `theme.toml` and
`CHANGELOG.md`, nothing else. Declare that explicitly rather than skipping the
step:

```bash
npx changeset add --empty
```

That writes a changeset with no package listed. It satisfies the check, consumes
no version, and leaves a record that the omission was a decision.

## Why `privatePackages` is declared

`config.json` sets `privatePackages.version` even though this package is public
and always will be. In Changesets 3 the default is `false`, and a private package
then versions **nothing while reporting success** — the same silent stall this
pipeline exists to remove (hit for real in
HeroicLands/Song-of-Heroic-Lands-FoundryVTT#1653). Declaring it means adding
`"private": true` to `package.json` some day cannot quietly stop releases.
