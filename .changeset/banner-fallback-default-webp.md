---
"@heroiclands/hugo-theme": patch
---

`hero-banner.html` falls back to `default.webp` when a banner has not been drawn.

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
