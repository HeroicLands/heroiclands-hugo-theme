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
   still agree. (`npm install` also installs the `commit-msg` hook.)
6. **Commit** in Conventional-Commits style, and **open a pull request** with
   `Closes #<n>` and a what/why description.

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
