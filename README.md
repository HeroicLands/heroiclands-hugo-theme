# Heroic Lands Hugo theme

Shared Hugo theme for the Heroic Lands projects, so every site built on it —
the main site, the knowledgebase, and the generated API docs — reads as one
coherent whole.

It provides the brand chrome (header/footer, the Cinzel/Lora + dark palette,
base CSS in `static/css/style.css`), the content layouts, and the infobox
renderer under `layouts/partials/infobox.html`.

## The theme carries layout, not addresses

This theme is shared by every repository that renders pages, so **no host, no
absolute URL, and no root-relative path that assumes a package lives at a
particular prefix appears anywhere in it**. A site-specific address written
here would render on every consumer — and would follow a package repository
that was taken over and published somewhere else, pointing its navigation back
at the site it left.

Every such address is therefore supplied by the consuming repository's own
configuration, and internal links resolve through `relURL` / `.RelPermalink`,
so the theme renders correctly under a bare root **and** under a `baseURL`
carrying a path prefix (`https://example.org/sohl/`).

## What belongs here, and what belongs in a consumer

Three repositories render pages through this one theme, so a layout in the
wrong place costs something either way. A layout duplicated across consumers
drifts — the same failure the address rule removes at the hostname level. A
layout pushed in here that only one consumer uses makes the theme a dumping
ground and couples the others to changes they did not ask for.

The test is **whether a second consumer would need the same template**, not
whether it looks reusable (issue #1454):

- **Here:** the chrome and the generic page shapes — `baseof`, `_default/`,
  `404.html`, the home layout, hero, TOC, related, the infobox
  renderer driven by the front matter every consumer's content carries.
- **In the consumer:** templates that render one repository's content and
  nothing else's — a site-specific home page, and any data file describing
  that repository's own material.

A consumer overriding a template that is generic is the signal it belongs
here; a template here that only one consumer's content can satisfy is the
signal it should move out.

## Use

Install it, and point Hugo at where npm put it:

```bash
npm install --save-dev @heroiclands/hugo-theme
```

```toml
# hugo.toml
themesDir = "node_modules/@heroiclands"
theme = "hugo-theme"
```

Hugo looks for `<themesDir>/<theme>`, so the scope becomes the themes directory
and the package name becomes the theme name. Nothing is copied and no module
mounts are needed.

**`themesDir` is relative to the Hugo root**, which is not always the repository
root. A site rooted in a subdirectory — `hugo --source kb` — reaches back out to
the lockfile's `node_modules`:

```toml
themesDir = "../node_modules/@heroiclands"
```

The theme ships `layouts`, `static`, `data`, `theme.toml` and `CHANGELOG.md`, and
has **no runtime dependencies**.

### Upgrading

The theme is on `0.x`, where **a caret does not cross a minor**: `^0.2.0` means
`>=0.2.0 <0.3.0`. So a theme release reaches a site in one of two ways, and only
one of them is automatic.

- **A patch** is already in range. Nothing in the manifest changes — but the
  **lockfile must still move**, because `npm ci` installs what is locked.
  Dependabot raises that pull request.
- **A minor** is out of range, so Dependabot will not offer it at all. Widen the
  pin by hand in the consuming repository's `package.json`, then update the lock.

A site can therefore be several theme releases behind on entirely green builds.
`CHANGELOG.md` in the installed package says which version it actually has.

### Why not a submodule

It was one, in all three consuming repositories, and the pointers went stale
without anything saying so: HeroicLands/heroiclands-hugo-theme#18 merged the two
profile sidebars into one, and 482 published pages rendered without a sidebar on
green builds until someone noticed (#19). A submodule SHA is invisible to every
tool a project already runs; a version range and a lockfile are not, and
Dependabot raises the bump on its own.

### What a consumer must supply

Everything below is optional — each is guarded, and omitting one simply drops
that piece of chrome — but a site wanting the full brand presentation sets all
of them.

```toml
baseURL = "https://example.org/"        # or "https://example.org/sohl/"

[params]
  # Root of the host serving shared artwork. Every image path in the theme is
  # resolved against it by `partials/cdn-url.html`. Unset, image paths resolve
  # against the site itself.
  cdnBaseURL = "https://cdn.example.org"

  [params.brand]
    logo       = "images/brand/icon-white.webp"  # header logo, CDN-relative or absolute
    licenseURL = "https://example.org/license/"  # footer "License" link
    discordURL = "https://discord.gg/…"          # footer Discord link

  # The home layout (layouts/index.html). Only sites that render their home
  # page through this theme need it.
  [params.home]
    heroimage   = "images/brand/banner.webp"
    herotitle   = "Explore Heroic Lands"
    herotagline = "…"

    # Column headings across the top row of the featured grid. `class` is
    # appended as `home-section-title--<class>` for grid placement.
    [[params.home.headings]]
      title = "Song of Heroic Lands"
    [[params.home.headings]]
      title = "Settings"
      class = "settings"

    # Entry-point cards. `key` is appended as `home-card--<key>` for grid
    # placement; `image` is CDN-relative or absolute.
    [[params.home.cards]]
      key   = "kb"
      title = "Knowledgebase"
      url   = "https://kb.example.org/"
      image = "images/banners/rules.webp"
      text  = "…"

  # The header search box (partials/search.html). Silent-disappear: omitted
  # or false, the theme renders no search markup at all. See "Search" below.
  search = true

  # The "page not found" page (layouts/404.html). Hugo renders it to
  # public/404.html, which a static host serves — with a real HTTP 404 — for
  # any unpublished path. Omit it and the page still renders, with generic
  # wording and no list of routes back.
  [params.notfound]
    heroimage = "images/banners/default.webp"  # CDN-relative or absolute
    tagline   = "This site has no page at"     # precedes the failed address
    sitenoun  = "site"                         # used in the body prose

    # Routes back into the site. `url` is resolved with relURL unless it is
    # already absolute, so these survive a baseURL carrying a path prefix.
    [[params.notfound.links]]
      title = "Home"
      url   = "/"
      text  = "…"

# The brand navigation. Absolute URLs when the entries cross hosts, so one
# header works on every site; plain paths when they do not.
[menu]
  [[menu.main]]
    name = "Home"
    url  = "https://example.org/"
    weight = 1
```

`params.home.headings` and `params.home.cards` render flat, as direct children
of `.home-featured`, because they are that CSS grid's items — each is placed by
its modifier class.

## The home page

A package's home page is `content/_index.md`, mounted at the package's own
prefix — `https://www.heroiclands.org/<package>/`. `layouts/index.html`
selects between two shapes by what it carries.

**`type: homepage`** renders the page through the same structure a note gets
from `_default/single.html` — the hero from its `banner:`, then its body —
sharing the markup through `partials/page-body.html` so a homepage and a page
read as one family:

```yaml
---
type: homepage
title: Song of Heroic Lands # hero heading
description: A classless, skill-based fantasy system … # hero standfirst

# The hero image. The same `banner:` every other page in this theme uses,
# resolved by `partials/hero-banner.html` in the documented order and through
# `params.cdnBaseURL` — see "The hero banner" below. With none set, the
# subtype default lands on `images/banners/homepage.webp`, since the subtype
# default is keyed on the page's `type`. `banner: none` declines a hero image
# entirely.
banner: brand/sohl-banner.webp
---
Everything published for the system lives under this address …
```

The home page declares no `infoboxes:`, `related:`, `date:` or `tags:`, so
those pieces of a page stay silent.

**No `type` at all** — a site whose home page is a set of entry points into
everything it publishes — renders the featured grid documented under
`params.home` above, which is the shape every consumer had before adopting a
`type: homepage` note.

## A page

`_default/single.html` renders every other page: the hero, the infobox rail
(see "The infobox" below), the body, any `related:` block, and prev/next links
through the page's own catalog.

```yaml
---
title: Brànwâal Dôrgaar
type: being # the page's catalog — see "Prev/next" below
banner: being/dorgaar.webp
date: 2024-03-01 # optional; shown in the page meta line
tags: [archetype, mercantyl] # optional; shown in the page meta line
---
```

- **`type`** is the page's catalog key, unless it is `doc` — prose rather than
  a catalog of its own — in which case the key is `subType` (what
  package-build compiles from a note's classification) or, failing that,
  `category` (what a documentation tree mounted from a repository directory
  carries). A page with no `type` has no catalog.
- **`date`**, **`tags`** — each optional and shown only when present, in a
  meta line above the body. A tag links to `tags/<tag>/`.

**Prev/next.** `.PrevInSection` / `.NextInSection` walk every page under the
site's content mount, since `@heroiclands/package-build` emits every note
flat there rather than filing it into a directory named for its catalog. A
mount holding more than one catalog narrows the walk to the pages sharing this
page's catalog key, so reading through the afflictions does not surface a
skill; a mount holding a single catalog is untouched, because `.PrevInSection`
already walks exactly that catalog there.

## A section landing

`_default/list.html` renders whatever a consumer still gives Hugo's `section`,
`taxonomy` or `term` kinds to render — a hand-curated landing at a real
subdirectory, and Hugo's own tag pages. A package-build consumer disables all
three (`disableKinds`), so this layout never runs for one; a site that keeps
them enabled still needs a landing, and this is it.

It opens with the hero and any authored body, then auto-lists the section's
members (`.Pages`) as a gap-filler: a member the body already links, directly
or transitively, is not repeated, and the rest appear under "Orphaned Pages"
when the body links some of them, or plainly when it links none. A tag's term
page lists the pages carrying it; the tag index itself lists every tag with
its page count.

```yaml
---
# content/projects/_index.md — a hand-curated landing, no `type:` at all
title: Projects
description: Foundry VTT systems, modules, and reference content …
---
Each section below has its own landing page.

# [Song of Heroic Lands](/projects/song-of-heroic-lands/)
…
```

A row is a linked title and, when the page carries one, its description.

## The infobox

A page's summary panels are **declared in its front matter and drawn by one
generic renderer**. What a box holds — which fields, in what order, under what
labels, in which section — is decided by the build that emits the page, so a
field added to a content type appears here with no template change and reads
the same on the website, in a compendium journal and in the book.

`partials/infobox.html` draws the whole list. It switches on a section's
`layout` and a value's `kind` and on nothing else: it never reads a note type
and never reads a field name, which is what stops a field list growing back
into a template.

```yaml
---
infoboxes:
  - id: note # the subject itself
    kind: note
    title: Profile
    sections:
      - id: profile
        layout: rows
        rows:
          - label: Name
            kind: text
            value: Brànwâal Dôrgaar
          - label: Affiliations
            kind: links
            value:
              - text: The Silent Talon Company
                url: /thalorna/affiliation-slntlncmpny/
  - id: sohl # one box per system the page's type reaches
    kind: system
    system: sohl
    title: SoHL
    available: true
    sections:
      - id: attributes
        label: Attributes
        layout: grid
        cells:
          - label: STR
            value: 14
  - id: hm3
    kind: system
    system: hm3
    title: HM3
    available: false
    sections: []
---
```

**Four section layouts**, a closed set, each naming the key it carries its
content under:

| `layout` | shape                           | carried in | drawn as                                  |
| -------- | ------------------------------- | ---------- | ----------------------------------------- |
| `rows`   | label/value pairs, one per line | `rows`     | `.info-profile-grid`                      |
| `grid`   | short label/value cells         | `cells`    | `.info-attrs-grid` / `.info-attr`         |
| `runin`  | groups of comma-joined entries  | `groups`   | `.info-skill-line` / `.skill-cat`         |
| `list`   | one entry per line              | `entries`  | `.info-mystical-list` / `.info-mystical-item` |

**Five value kinds:** `text`, `number`, `link`, `links` and `list`. A `link` is
`{text, url}` and renders as an anchor where the build reached the page, and as
its own words where it did not. A whole `number` is set with digit grouping.

**How the boxes are drawn, and what a page gets.**

- Each box is a `<details>` disclosure, **open by default** — native,
  accessible, no JavaScript. Closed, a box is one summary line, which is what
  lets a note box and one box per system stack without burying the prose.
- The boxes sit in a **rail on wide screens and inline on narrow ones**. The
  rail is written first in the markup, because the infobox is content
  prepended before the prose: when the grid collapses, the boxes land above
  the text they summarise.
- A page carrying boxes takes the `.single-with-sidebar` grid, and its
  contents list — where it has more than three `<h2>`s — joins the foot of the
  same rail. A page with a contents list and no boxes takes `.single-with-toc`
  and its narrower column, exactly as before.
- **A box carries no image.** A picture is authored in the page body, where
  its position in the prose governs what follows it.
- **An absent field is absent**: a row with no value is not emitted, and a
  section holding nothing is not drawn. A heading over nothing asserts a fact
  that is not there.
- **A system box with nothing to show carries a `statement`**, and it is drawn
  in place of the sections — _Not available_ where that system compiled no
  document for the page, _Nothing beyond the profile_ where it compiled one
  that says nothing the profile has not. Both are statements about the page
  rather than missing fields, and which one applies is the build's to decide,
  so a box is never an empty panel. A system that has no such concept for this
  kind of page sends no box at all, and nothing is drawn.

A page whose front matter declares no `infoboxes:` renders no rail, so a
consumer whose content does not carry them is unaffected.

## The related card

`partials/related.html` renders a bordered "Related" card below the body,
listing the pages connected to this one. `@heroiclands/package-build` emits
the front matter on every content page.

```yaml
---
related:
  backlinks: [{ title: …, url: …, type: … }] # pages that link here
  mentions: [{ title: …, url: …, type: … }] # pages this page links to
---
```

Both directions are merged into a single pool, deduped by `url`, and grouped
by the referenced page's `type`. Each group is a labelled block, its entries a
CSS grid (`repeat(auto-fill, minmax(14em, 1fr))`) that reflows its own column
count from the available width with no media query — two or three columns on a
desktop, one on a phone. An entry is the linked page title.

| class                 | drawn as                                    |
| ---------------------- | -------------------------------------------- |
| `.related`             | the card                                     |
| `.related-heading`     | the "Related" heading                        |
| `.related-group`       | one type's block, label and grid together    |
| `.related-group-label` | the type label heading a group               |
| `.related-group-grid`  | the grid of linked entries                   |

A page whose `related` carries neither list, or whose two lists are both
empty, renders no card at all.

## The hero banner

Nearly every page in this theme opens with a hero band, and
`partials/hero-banner.html` decides what sits behind it. The image is served
from the consumer's `params.cdnBaseURL`, so the theme resolves a *path* and
never a host.

**Resolution order.**

1. `banner:` in the page's front matter. `none` (or `false`) declines a hero
   image; a full URL is used as-is; anything else is a fragment under `images/`.
2. `images/banners/{subtype}.webp`, where the subtype is the page's `category`
   for a `type: doc` page and its `type` otherwise.
3. `images/banners/default.webp` — when the page has no type, **and** whenever
   the name picked by 1 or 2 is not in the declared inventory.

**Why step 3 is a declaration, not a test.** Hugo cannot ask a remote host
whether a URL exists, so before this the resolved path was emitted unchecked
and a banner that had never been drawn 404'd in silence — the band rendered
with its title, palette and gradient intact behind a dead URL, and nothing
failed: not the build, not Hugo, not the deploy guard (issue #36).
`data/banners.yaml` is the declaration that stands in for the test the template
cannot make. A name listed in its `available` is asserted to exist; a resolved
name that is absent falls back to `fallback` and Hugo logs one deduplicated
warning naming the missing banner and the first page that wanted it. The
fallback applies only to a relative path landing directly in the declared
`dir` — an absolute URL, and a fragment pointing anywhere else under `images/`,
pass through untouched, because the theme has no inventory for either and must
not second-guess an address it cannot know about.

**One resolver.** The order above lives in `partials/banner-url.html`, which
returns a URL or an empty string; `hero-banner.html` calls it with the page's
subtype, for step 2.

**Keeping the inventory honest.** `npm run lint:banners`
(`utils/check-banners.mjs`, part of `npm run lint`) fetches every declared name
from the asset host and fails on any non-200, so a name that was added
optimistically is caught here rather than on a published page. It defaults to
the Heroic Lands CDN and takes `--base` / `BANNER_BASE_URL` for any other host.
A consumer publishing its own artwork set replaces the whole list by shipping
its own `data/banners.yaml`, which Hugo reads in preference to the theme's, and
can run the same check against it.

**Declining a hero image.** `banner: none` renders the band with no image at
all — the title, the palette and the `.hero-with-image` gradient, which is what
gives the band its presence. This is deliberately distinct from *not having one
yet*: a package may have a standing editorial reason to publish no imagery, as
the fan-material carve-outs do, and falling back to a default for those would
substitute artwork where the considered answer was "none".

## Search

`params.search = true` renders a search box in the header; left unset (or
`false`), `partials/search.html` renders nothing. The box, and everything it
opens, is the theme's own — the index it reads is not.

**Where the index comes from.** `@heroiclands/package-build` ≥ 22.4.5 writes
a [Pagefind](https://pagefind.app) index at `pagefind/` beside the rendered
pages, when `site.search` in `package-build.config.yaml` is left at its
default of `true` (see that package's `docs/configuration.md`, `site.search`,
and `package-build site-root` in `docs/commands.md`). Pagefind's own UI —
`pagefind-ui.js` and `pagefind-ui.css` — ships inside that generated
directory, so this theme carries no copy and is pinned to no Pagefind
version. Turning `params.search` on without a package-build carrying that
index (or with `site.search: false`) shows an empty results box that never
finds anything — the two settings are independent, and a consumer sets both.

Both files are referenced the same way every other theme-bundled asset is —
`relURL`, the same resolution `"css/style.css" | relURL` uses in
`baseof.html` — so a package served under a prefix (`/thalorna/pagefind/…`)
finds its own index rather than another package's, and the theme carries no
address of its own.

**Why a header box and not a `/search/` page.** A site is its homepage and
its pages, with nothing generated between them — a results page would need a
consumer content file at that address, which this theme has no way to
conjure. Pagefind's own panel UI needs no page of its own: the header button
opens it in place.

**What is indexed.** `data-pagefind-body` on `.single-body` scopes indexing
to a page's prose; the theme's own chrome carries `data-pagefind-ignore` —
the header, the footer, the infobox rail, the table of contents, the Related
card, and the hero banner's title and tagline. `_default/single.html` also
tags every page with `data-pagefind-filter="type"` and
`data-pagefind-filter="package"`, read from the page's own `type` and
`package` front matter, so a search can be narrowed to one catalog or one
package without either value appearing in the page itself.

**Classes added:** `.site-search`, `.search-toggle`, `.search-panel`,
`.search-panel-inner`, and `.header-actions` (the header's nav/search/toggle
group). `.search-panel-inner` carries Pagefind's own `--pagefind-ui-*`
theming variables, set from this theme's own tokens so results match the
chrome around them.

## License

Code (layouts, CSS): GPL-3.0-or-later. Content/data authored for The World of
Thalorna and Song of Heroic Lands: CC-BY-SA-4.0.
