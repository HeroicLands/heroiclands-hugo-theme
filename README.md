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

Add as a submodule and set the theme:

```bash
git submodule add https://github.com/HeroicLands/heroiclands-hugo-theme.git themes/heroiclands-hugo-theme
```

```toml
# hugo.toml
theme = "heroiclands-hugo-theme"
```

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

## License

Code (layouts, CSS): GPL-3.0-or-later. Content/data authored for The World of
Thalorna and Song of Heroic Lands: CC-BY-SA-4.0.
