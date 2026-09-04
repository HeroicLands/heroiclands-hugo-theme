---
"@heroiclands/hugo-theme": minor
---

A page's breadcrumb and its prev/next links follow the catalog it declares, not the
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
