# Heroic Lands Hugo theme

Shared Hugo theme for the Heroic Lands projects, so every site built on it —
the main site, the knowledgebase, and the generated API docs — reads as one
coherent whole.

It provides the brand chrome (header/footer, the Cinzel/Lora + dark palette,
base CSS in `static/css/style.css`), the content layouts, and the SoHL
info-block partials under `layouts/partials/sidebars/` (character, creature,
gear, impact, mystical, equipment). Shortcode/display-name mappings live in
`data/sohl.yaml`.

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
  `404.html`, the home layout, breadcrumbs, hero, TOC, related, and the
  info-block partials driven by frontmatter every consumer's content carries.
- **In the consumer:** templates that render one repository's content and
  nothing else's — per-type section landings (`weapongear/`, `creature/`, …),
  the partials those landings share, a site-specific home page, and any data
  file describing that repository's own material.

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

The theme ships `layouts`, `static`, `data` and `theme.toml`, and has **no
runtime dependencies**.

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

  # Listing rows (partials/catalog-rows.html). A reference catalog shows
  # "Name (shortcode)" so a reader can map a page to the identifier the
  # system uses for it; a narrative site leaves this unset and gets plain
  # titles, which is what a tag listing should show.
  [params.list]
    shortcodes = true

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

## A package landing page

Every published package has a landing at its own prefix —
`https://www.heroiclands.org/<package>/` — and they all do the same job: say
what the package is, say how to install it, and route the reader onward. Built
independently they would not look like siblings, so the shape lives here
(`layouts/partials/landing.html`) and a package supplies only its own words and
addresses.

It is **front matter, not site configuration**, because a landing is a page:
one file, `content/_index.md`, is the whole of a package's landing.

```yaml
---
# The layout is selected by either of these: `type: homepage` is what a
# package's generated `_index.md` declares, and the presence of `landing`
# selects it too, so a page that has one need not also declare the other.
type: homepage
title: Song of Heroic Lands # hero heading
description: A classless, skill-based fantasy system … # hero standfirst

# The hero image. This is the same `banner:` every other page in this theme
# uses, resolved by `partials/hero-banner.html` in the same documented order —
# an absolute URL as-is, otherwise a fragment under `images/`, otherwise the
# subtype default at `images/banners/{type}.webp`, otherwise
# `images/banners/default.webp` — and through `params.cdnBaseURL` like every
# other image. A `type: homepage` page with no `banner:` therefore resolves to
# `images/banners/homepage.webp`; set `banner:` unless that file exists.
banner: brand/sohl-banner.webp

landing:
  # Opening paragraph. Optional, like everything below it.
  lead: >-
    Everything published for the system lives under this address …

  # How to install the package. Every field is optional; the block renders
  # only if `install` is present at all.
  install:
    heading: Install it in Foundry
    intro: In Foundry's setup screen, choose **Game Systems → Install System** …
    url: https://github.com/…/releases/latest/download/system.json
    note: Requires Foundry VTT v14. …

  # The cards. Two ways to fill them, and a package may use either, both, or
  # neither — see "Authored cards, derived cards" below.
  cards:
    heading: Start where you are
    source: sections # optional; one card per top-level site section
    items:
      - title: At the table
        url: kb/ # optional — makes the card's title a link
        description: Running or playing in a game …
        links:
          - title: User Guide
            url: kb/user-guide/
            note: playing with it, sheet by sheet # optional trailing gloss

  # Standing notices — a licence carve-out, an attribution. Each renders as a
  # full-measure block rather than a card, because it is addressed to every
  # reader rather than being one route among several.
  notices:
    - title: Licence
      body: Unofficial fan material, published under …

  # Closing paragraph, centred.
  closing: The whole reference is browsable from the [knowledgebase](kb/) …
---
```

### Authored cards, derived cards

A package's cards can be **authored** (`items`) or **derived**
(`source: sections`), and neither is required, because the packages genuinely
differ:

- A **system** package groups its cards editorially — "At the table", "What it
  ships with", "Building on it" — and links out to surfaces that are not
  sections at all, such as generated API documentation. Only an authored list
  can express that, so `items` exists.
- A **content** package's landing is its section index: one card per section,
  each with the section's own description. Writing those by hand would mean
  re-writing them every time the content build emits or retires a section, so
  `source: "sections"` builds them from `.Site.Sections.ByTitle` — the site's
  own list, in its own order.
- A **carve-out** package publishes exactly one page and may not describe its
  content, so it supplies a lead, an install block and a notice, and no cards
  whatsoever. Omitting `cards` renders no heading, no grid and no gap.

`items` and `source` compose: authored cards render first, derived ones after,
so a content package can lead with a hand-written card and let the rest follow
from its sections.

### How the values are treated

- **Every field is optional and every section is guarded.** A missing section
  renders nothing at all — not an empty heading, not a blank band. This is the
  theme's standing silent-disappear convention, and it is what lets one layout
  serve a landing with three rich cards and one with none.
- **Prose fields are inline markdown.** `lead`, `closing`, `install.intro`,
  `install.note`, a card's `description` and a link's `note` are rendered with
  `.RenderString`, so links and emphasis work in all of them and none can
  inject a block wrapper into the layout. A package with more to say than the
  contract carries writes it as the page body, below the lead.
- **`install.url` is not markdown.** It is set as text to be read and copied.
- **Link addresses resolve against the site.** A `url` that is already absolute
  is used as-is; anything else is resolved with `relURL` by
  `partials/site-url.html`, so a package served under a path prefix writes
  `kb/rules/` and gets `/sohl/kb/rules/` without naming the prefix. A card or a
  link may carry **`href`** instead, for an address that is already resolved and
  must be used verbatim — which is what `source: "sections"` fills in, since a
  section's permalink already carries the prefix.
- **A relative link inside a prose field is emitted as written**, and the
  browser resolves it against the landing's own address — which is the package
  root. So `[the rules](kb/rules/)` in a `lead` or a `closing` is correct too,
  and equally free of the prefix.
- **The classes are the theme's** — `.lead`, `.install`, `.doors`, `.door`,
  `.landing-notice` and the rest live in `static/css/style.css`, expressed in
  the palette tokens. A landing needs no CSS of its own, and should ship none.

## License

Code (layouts, CSS): GPL-3.0-or-later. Content/data authored for The World of
Thalorna and Song of Heroic Lands: CC-BY-SA-4.0.
