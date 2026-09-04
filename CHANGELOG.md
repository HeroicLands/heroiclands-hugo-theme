# @heroiclands/hugo-theme

## 0.5.0

### Minor Changes

- 83de0fb: A page's breadcrumb and its prev/next links follow the catalog it declares, not the
  directory it sits in (#47, #48, #49).
  
  Both read a page's place in the site from `.CurrentSection`, which said what it
  needed to say only while a page lived in a directory named for its catalog.
  `@heroiclands/package-build` (package-build#204) emits every content page **flat**
  under the content mount, so a consumer's whole catalog is one Hugo section — and
  the two facts that were derived from directory membership stopped being facts:
  
  - The **middle crumb's href** became the mount. Every content page still labelled
    itself with its section and linked the knowledgebase landing, losing the
    one-click route back to its own listing — 1,478 pages of the SoHL knowledgebase.
  - **Prev/next** became "anywhere in the knowledgebase". Reading through the
    afflictions walked out of them into skills and traumas in title order; 1,506
    links crossed a catalog boundary.
  
  **The address is resolved, not composed or inherited.** A new
  `partials/catalog-landing.html` answers "which section landing lists this page?"
  from the `listType` / `listSubType` front matter a generated landing already
  carries — the same contract `_default/list.html` reads from the other end (#50), a
  site-wide query that asks what a page _is_ rather than where its file sits.
  Failing that it falls back to a section *named* for the page's catalog: the shape
  every consumer has today, and a weaker answer, since a section name is a published
  URL its owner chose and need not spell the catalog the way the content does
  (`/kb/user-guide/` lists pages whose genre is `userguide`). That fallback retires
  itself as builds start emitting the keys. Failing both, the crumb keeps today's
  `.CurrentSection` — the enclosing mount, which is at least a page that exists.
  
  **Narrowing prev/next is conditional, and that is what keeps it a no-op.** A
  section holding one catalog is left alone, because `.PrevInSection` already walks
  exactly that catalog there. Only a section that actually mixes catalogs — a flat
  mount — gets the narrowed sibling set. Verified against all three consumers: on
  thalorna and heroiclands.org the rendered prev/next is byte-identical.
  
  **Doc pages get their crumb back** (#49). The middle crumb read `.Params.category`
  for `type: doc`, but content notes compiled by package-build name their genre in
  `subType`, so the crumb rendered an unlinked, unhelpful `doc` — 160 pages,
  including every rules chapter, the user guide, and the developer documentation.
  Both spellings are now read, `subType` first, since a documentation tree mounted
  from a repository directory still carries `category`. A landing that resolves to
  itself renders `Home > {Title}` rather than naming itself twice, and a page with no
  `package` to compose a label from borrows the section's own title instead of
  falling back to its bare type.
  
  The catalog key itself — `type`, or the genre for a `doc` — is factored into
  `partials/catalog-key.html` so the crumb and the sibling walk cannot drift apart on
  what catalog a page is in.

## 0.4.0

### Minor Changes

- 6f41327: Style `.sohl-draft-link`, the class the SoHL content builds wrap around a link
  whose target exists but is not written yet (#44).
  
  The builds mark such a link the way they already mark an unresolved one
  (HeroicLands/package-build#183), leaving the link itself alone so it still goes
  where it says. Without a rule here the span arrived styled as body text and the
  marking communicated nothing — the same gap #28/#29 closed for the unresolved
  marker.
  
  **Deliberately not the unresolved marking.** An unresolved link's target does not
  exist; a draft link's does and is simply unwritten, so a reader has to be able
  to tell them apart. This keeps the link's normal weight — it _is_ a real link —
  and marks it in amber with a dashed underline, against the unresolved marker's
  bold red and dotted one. Not signalled by hue alone, for the same reason.
  
  The colour is exposed as `--draft-link` for a consumer to override, and is
  contrast-checked against the three surfaces it can sit on: 10.0:1 on `--bg`,
  9.3:1 on `--bg-card`, 8.1:1 on `--surface`. Single-mode dark, as the unresolved
  rule is, because this theme sets no `color-scheme` and a `light-dark()` value
  would resolve to its light half.
- d444676: A section landing lists its members by front matter when it has no child pages.
  
  `_default/list.html` listed a section from `.Pages` — what Hugo finds inside the
  section's directory. `@heroiclands/package-build` 13.0.0 emits every content page
  **flat** under the content mount instead, stating its own `url:`, so a section
  directory holds nothing but its own generated `_index.md` and every declared
  section landing rendered "Nothing here yet." (issue #50). No published address
  moved; only the file paths did.
  
  The section now says what it lists, in two front-matter keys the build writes onto
  the landing:
  
  - **`listType`** — a content type, matched against the page's `Type`.
  - **`listSubType`** — optional, and meaningful only alongside `listType`, matched
    against the page's `subType`. One type can hold several genres: `rules`,
    `userguide` and `reference` are all `type: doc`, and a documentation tree
    mounted from a repository directory is `type: doc` carrying no `subType` at all,
    so `listType` alone would sweep all four together into whichever section asked
    first.
  
  The query is site-wide, which is the point — it asks what a page _is_, not where
  its file sits, so it is indifferent to how a build lays the tree out. It is the
  same query a consumer's own catalog layouts already run, which is why those were
  never affected.
  
  Deliberately **not** Hugo's own `type:`: on an `_index.md` that key selects the
  template, so a content type written there would send the landing to
  `layouts/<type>/list.html` instead of the default list layout.
  
  **Nothing changes for a landing that declares neither key.** They are read only
  when `.Pages` is empty, so a consumer still filing pages into section directories
  never reaches them, and ordering is unchanged either way — both collections carry
  Hugo's default page order. The gap-filler is unchanged too: a landing with an
  authored body still lists only the members that body does not reach.

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
