# @heroiclands/hugo-theme

## 0.3.0

### Minor Changes

- 772ab17: `landing.cards` can express a landing that is a section, not the home page.
  
  `source: sections` derived its cards from `.Site.Sections`, which is the site's
  top-level list. A package that mounts its content tree one level down — what
  `publish.address.prefix` produces — has exactly one top-level section, so the
  option rendered a single card pointing at the page the reader was already on.
  The derivation now reads the **rendering page's own** `.Sections`. On a home
  page the two lists are the same object, so every existing landing derives
  exactly what it derived before.
  
  Three additions let a nested landing say what a flat derived list could not, and
  `layouts/landing/list.html` renders one from a section's own `_index.md` under
  `type: landing`:
  
  - **`banners: true`** gives each derived card its section's `banner:` as a card
    image, resolved by the same order, the same `params.cdnBaseURL` indirection
    and the same declared-inventory guard as a hero band — that resolution now
    lives in `partials/banner-url.html`, which `hero-banner.html` calls too, so
    there is one implementation rather than two that can drift. Opt-in, because a
    landing that lists its sections as text cards should not silently become a
    wall of imagery on upgrade.
  - **`exclude`** keeps named sections off the landing. Stated as an exclusion so
    that deriving keeps its promise: a section nobody has said anything about
    still appears.
  - **`groups`** gathers derived cards under editorial headings, each group naming
    the sections it takes. Declared on the landing rather than on each section
    because it is editorial — every card is a sibling section under one mount, and
    nothing in the hierarchy distinguishes "Actors" from "Gear". Anything no group
    named renders in a row after them, the same gap-filling promise
    `_default/list.html` makes about orphaned pages.
  
  An authored `items` card may now carry `banner:` too. Card markup is unchanged
  for a card without one, so `/sohl/` and `/thalorna/` render byte-identically;
  the stylesheet gains `.door-with-image`, `.door-image`, `.door-body`,
  `.doors-groups` and `.doors-group` and changes nothing it already had.
  
  Closes #41.

### Patch Changes

- 489e01e: `hero-banner.html` falls back to `default.webp` when a banner has not been drawn.
  
  A subtype default resolved to `images/banners/<subtype>.webp` and was emitted into
  a `background-image` unchecked, so a page with a type got its subtype's name
  whether or not that file had ever been published — and the failure was silent: the
  band rendered with its title, palette and gradient intact behind a dead URL. 29 of
  the 37 distinct banner addresses in use across the three consumers were 404ing.
  `data/banners.yaml` now declares what is published, the template substitutes
  `default.webp` for anything absent from it and logs one deduplicated warning, and
  `banner: none` renders the band with no image rather than resolving to
  `images/none`. `npm run lint:banners` fetches every declared name so the list
  cannot rot.
  
  Declared here rather than on its own pull request because it merged (#36, #37)
  before this repository had a changesets pipeline, and so is sitting on `main`
  unpublished — exactly the state #30 exists to make visible.

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
