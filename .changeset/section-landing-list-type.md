---
"@heroiclands/hugo-theme": minor
---

A section landing lists its members by front matter when it has no child pages.

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
