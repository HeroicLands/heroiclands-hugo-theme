---
"@heroiclands/hugo-theme": minor
---

`landing.cards` can express a landing that is a section, not the home page.

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
