---
"@heroiclands/hugo-theme": minor
---

**Breaking.** A page's infoboxes come from its own `infoboxes:` front matter and
are drawn by one generic renderer, `partials/infobox.html`. The per-type
partials that decided what each box held are gone, along with the two dispatches
that chose between them.

**What a consumer must change**

- **Build the site with a toolchain that emits `infoboxes:`** —
  `@heroiclands/package-build` settles which boxes a page carries, which fields
  each holds, in what order and under what labels. A page whose front matter
  declares none renders no box and no rail.
- **A consumer calling any of these partials must stop**: `info-sidebar`,
  `sidebars/being`, `sidebars/gear`, `sidebars/equipment`, `sidebars/mystical`,
  `sidebars/impact`, `infobox/polity`, `infobox/region`, `infobox/continent`,
  `infobox/settlement`, `infobox/affiliation`.
- **A consumer reading `hugo.Data.sohl`** — the shortcode-to-display-name
  mappings — must ship its own `data/sohl.yaml`. Names and skill families now
  come from the content index.
- **A consumer styling `.info-portrait` or `.info-portrait-link`** has nothing
  to style: a box carries no image. A portrait is authored in the page body,
  where its position in the prose governs.

**What a reader sees**

- **Every page carries a Profile box**, and one box per game system its kind of
  page reaches. A system box with nothing to show says why — _Not available_
  where that system compiled no document for the page, _Nothing beyond the
  profile_ where what it compiled says nothing the profile has not. A system
  with no such concept for the page draws no box at all.
- **A box opens and closes.** Closed it is a single line, so a page carrying
  three boxes costs three headings rather than three panels above the prose.
- **The boxes sit in a rail beside the text**, and above it on a narrow screen.
  A page's contents list joins the foot of the same rail.
- **Rows follow the page's own declared fields**, so facts that were authored
  and never shown — a settlement's lore, a being's home, a polity's domains,
  economy and population, a weapon's heft and strike modes — are on the page.
- Skills, spells and carried gear **link to the entries they name**, and are
  titled rather than abbreviated.
