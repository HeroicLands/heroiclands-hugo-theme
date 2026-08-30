# Contributing to the Heroic Lands Hugo theme

This repository is the shared Hugo theme every Heroic Lands site renders through —
[`/sohl`](https://github.com/HeroicLands/Song-of-Heroic-Lands-FoundryVTT),
[`/thalorna`](https://github.com/HeroicLands/sohl-thalorna), and
[heroiclands.org](https://github.com/HeroicLands/heroiclands-site). It carries
**layout, not addresses**: URLs, menus, and branding come from each consuming
site's configuration.

## Filing an issue

**This repository tracks its own work.** File theme issues here — but read
[§9 of the issue-reporting standard](.github/ISSUE_REPORTING.md#9-which-repository-does-an-issue-belong-in)
first. It matters more here than anywhere else in the project, because a theme
fault and a consumer fault look identical in a browser. The short version:

- **Reproduces on more than one site?** Probably the theme. File here.
- **Reproduces on exactly one?** That site is feeding the theme different input.
  File it there.
- **About a URL, menu entry, title, or branding?** File it in the consumer,
  always.

Every issue is classified on four axes — **type**, **priority**, **labels**, and
**milestone**:

- [Issue Reporting standard](.github/ISSUE_REPORTING.md)
- [Open an issue](https://github.com/HeroicLands/heroiclands-hugo-theme/issues/new/choose)

Exploitable weaknesses go to a **private advisory**, never a public issue — see
[SECURITY.md](SECURITY.md).

## Making a change

`main` is protected: it takes no direct pushes. Every change lands through a pull
request, squash-merged.

1. **Find or file the tracking issue.** Pure repo housekeeping (`chore/*`) may skip
   this; anything else gets an issue first, so you have its number for the branch.
2. **Branch off current `main`**, named `<type>/<issue_#>_<short-kebab-summary>` —
   e.g. `bug/4_polity-peoples-links`. Issue-free housekeeping is `chore/<slug>`.
3. **Make the change**, keeping it small and focused — one feature, one fix, or one
   documentation improvement per pull request.
4. **Verify it against a real consumer.** The theme does not build on its own; it
   renders when a site uses it. Point a consuming site's `themes/` submodule at your
   branch and build that site. **Check more than one consumer** for anything touching
   a shared partial.
5. `npm run lint` must pass — it asserts `.github/labels.yml` and §3 of the standard
   still agree, and that every banner `data/banners.yaml` declares is actually
   published. (`npm install` also installs the `commit-msg` hook.)
6. **Declare the bump**: `npx changeset`, or `npx changeset add --empty` if the
   change ships nothing to consumers. See [Releasing](#releasing) — a pull request
   without one fails the **Changeset declared** check.
7. **Commit** in Conventional-Commits style, and **open a pull request** with
   `Closes #<n>` and a what/why description.

## Releasing

Releasing runs from [changesets](https://github.com/changesets/changesets).
**Nothing is published by hand, and no one runs a release command.**

1. **Your pull request declares its bump** as a `.changeset/*.md` file — `npx
   changeset` writes one. A change that ships nothing to consumers declares that
   too, with `npx changeset add --empty`. The **Changeset declared** check fails a
   pull request carrying neither.
2. **Merging it to `main`** runs `.github/workflows/release.yml`, which opens (or
   updates) a **`chore(release): version packages`** pull request: the version bump
   plus the rewritten `CHANGELOG.md`.
3. **Merging _that_** publishes: `npm publish` over
   [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC — there
   is no `NPM_TOKEN` in this repository), the `v<version>` tag, and the GitHub
   Release with the changelog section as its body.

An unreleased state is therefore **an open pull request, not an absence**. That is
the whole point of the arrangement: the number of human decisions is unchanged, but
forgetting one is now visible. Publishing is idempotent — a re-run against a version
already on the registry is a no-op — and an ordinary push to `main` with no
changesets pending releases nothing.

`workflow_dispatch` on that workflow is **recovery only**, for a version that is
merged and versioned but did not reach the registry. Reaching for it as the normal
path is what produced 0.2.0: on npm, with no tag and no GitHub Release behind it.

**The workflow's file name is load-bearing.** npm binds the trusted publisher to
this repository _and_ `.github/workflows/release.yml`. Renaming or moving that file
revokes the credential until the trusted publisher is reconfigured on npm — which is
how this repository's first OIDC release failed (#27). Keep `id-token: write` and
the npm-upgrade step for the same reason.

### Which bump — this package is on `0.x`

The bump table is in [`.changeset/README.md`](.changeset/README.md); the rule worth
repeating here is the one that surprises people:

> **A breaking change is a `minor`, not a `major`.**

On `0.x` a major bump means declaring 1.0, and whether the theme's contract is
stable enough for that is the maintainer's call — not a side effect of one pull
request removing a partial. Never write `major` in a changeset. If you think the
theme has reached 1.0, say so in the issue.

### A release does not reach consumers on its own

Three sites render through this theme, each pinning a range in its own
`package.json`. `^0.2.0` on a `0.x` version means `>=0.2.0 <0.3.0` — **a caret never
crosses a minor while the major is zero.** So:

- **A `patch` is in range.** No consumer edits its manifest — but its **lockfile
  still has to move**, because `npm ci` installs what is locked. Dependabot raises
  that bump; until it is merged, the site keeps rendering the old theme on a green
  build.
- **A `minor` is _out_ of range.** Dependabot will not offer it, because it is not a
  version the declared range admits. Someone has to widen the pin in each consuming
  repository — `@heroiclands/hugo-theme: ^0.2.0` → `^0.3.0` — and that is a pull
  request per consumer, made by hand.

This is not hypothetical drift. At the time of writing, `heroiclands-site` and
`sohl-thalorna` both pin `^0.1.2` and are locked at `0.1.2`; **neither has ever
received 0.2.0**, and nothing in either repository is going to tell them so. Only
`Song-of-Heroic-Lands-FoundryVTT` was moved to `^0.2.0`, by hand.

So when you land a `minor`, say in the pull request that consumers need a range
bump, and follow it through. Publishing is automated; **arriving is not**.

## Two standing rules

**The theme names no consumer address.** Site URLs, menu entries, brand strings,
and the CDN root are supplied by each consuming site — `[menu]`,
`params.cdnBaseURL`, `brand`, `home` — and resolved through partials like
`cdn-url.html`. If your change needs to know an address, add a parameter and let
each consumer set it; do not hardcode one, and do not special-case a consumer by
name.

The deliberate exceptions are **third-party** hosts for shared web resources —
the Google Fonts stylesheet and the Font Awesome CDN in `baseof.html`, and the
Creative Commons badge in `footer.html`. Those are not consumer addresses. Adding
another external host is a change worth justifying in the PR, since it is a new
third-party dependency on every site at once.

**Changes land in every consumer at once.** There is no per-site branch, and a
partial's parameters, required front matter, and class names are a public contract.
Anything a consumer would have to change to keep working is a `breaking-change`;
label it and say so in the PR.

**No AI/assistant attribution** in commit messages, pull-request titles or bodies,
or issues. A committed `commit-msg` hook (activated by `npm install`) rejects such
commits locally, and the **No Attribution** GitHub Actions check fails any pull
request carrying it.
