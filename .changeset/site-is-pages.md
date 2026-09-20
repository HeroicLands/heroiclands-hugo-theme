---
"@heroiclands/hugo-theme": minor
---

**Breaking.** A site is its home page and its pages; nothing generated sits
between them.

- **A site that declared sections gets no landings.** The theme has no list
  layout, no per-type catalog page, and no knowledgebase landing — an index
  between the home page and a note is a page the consumer writes by hand,
  with a content table over its own material.
- **The home page renders at the package root as a page.** A home page
  carrying `type: homepage` gets the hero from its `banner:` and then its
  body, in the same shape a note's page gets — a homepage and a page read as
  one family. A home page with no `type` still renders the featured grid.
- **Catalog, list and tag pages are not rendered.** A site that relied on one
  of these needs an authored page in its place.
- **Breadcrumbs read `Home › {Title}`.** The middle crumb naming a package
  and a catalog is gone, along with the section it used to link to.
