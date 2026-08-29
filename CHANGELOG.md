# @heroiclands/hugo-theme

## 0.2.0

### Minor Changes

- A landing layout for package homepages. `layouts/index.html` branches to a new
  `partials/landing.html` when the page declares `type: homepage` or carries a
  `landing:` block, and to the existing `params.home` featured grid otherwise;
  `partials/site-url.html` resolves a consumer-supplied URL against the site, and
  the landing classes were added to `static/css/style.css`. Additive — the `www`
  featured grid renders byte-for-byte unchanged — but the `landing.*` front-matter
  contract is a new public interface, which is more than a patch. (#33, #34, #35)

  No GitHub Release was cut for this version: it reached npm through a manual
  `workflow_dispatch`, so there is no `v0.2.0` tag and no release notes but these.
  That is the gap [#30](https://github.com/HeroicLands/heroiclands-hugo-theme/issues/30)
  closed.

## 0.1.2

### Patch Changes

- Style `.sohl-unresolved-link`, the class the SoHL content builds wrap around a
  wikilink whose target no package publishes. The span previously arrived with no
  rule at all, so the marking existed in the HTML and communicated nothing on the
  page. The dark value is pinned rather than taken from `light-dark()`, and exposed
  as `--unresolved-link` for a consumer to override. (#28, #29 —
  [release notes](https://github.com/HeroicLands/heroiclands-hugo-theme/releases/tag/v0.1.2))

## 0.1.1

### Patch Changes

- The Related partial no longer renders an empty block. A page with no `related`
  front matter — or whose `backlinks` and `mentions` are both empty — now emits no
  Related markup at all, instead of a heading over an empty list; 1,648 published
  pages across the three consumers were emitting it. (#24, #25 —
  [release notes](https://github.com/HeroicLands/heroiclands-hugo-theme/releases/tag/v0.1.1))

## 0.1.0

### Minor Changes

- First npm release. The theme ships as `@heroiclands/hugo-theme` so consumers can
  drop the git submodule: `layouts`, `static`, `data` and `theme.toml`, with no
  runtime dependencies. (#19, #20 —
  [release notes](https://github.com/HeroicLands/heroiclands-hugo-theme/releases/tag/v0.1.0))

---

Everything above `0.2.1` was versioned and released by hand, before this
repository ran a changesets pipeline; those entries were reconstructed from the
pull requests and GitHub Releases behind them, so they are summaries rather than
the changesets that were never written. From `0.2.1` on, this file is generated —
edit a `.changeset/*.md` entry, never this file.
