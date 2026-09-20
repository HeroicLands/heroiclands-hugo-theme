---
"@heroiclands/hugo-theme": minor
---

**Breaking.** A package-build site is its home page and its pages; nothing
generated sits between them.

- **A package-build site that declared sections gets no landings.** The
  theme's per-type catalog pages and knowledgebase landing are gone — an
  index between the home page and a note is a page the consumer writes by
  hand, with a content table over its own material. This reaches only a
  consumer whose build disables Hugo's `section`, `taxonomy` and `term`
  kinds; a site that keeps them enabled (one that is not a package-build
  consumer) still gets a landing for a hand-curated section or a tag, from a
  much smaller generic layout.
- **The home page renders at the package root as a page.** A home page
  carrying `type: homepage` gets the hero from its `banner:` and then its
  body, in the same shape a note's page gets — a homepage and a page read as
  one family. A home page with no `type` still renders the featured grid.
- **Breadcrumbs read `Home › {Title}`.** The middle crumb naming a package
  and a catalog is gone, along with the section it used to link to.
