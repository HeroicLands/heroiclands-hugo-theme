---
"@heroiclands/hugo-theme": minor
---

The being sidebar reads its subject's description from `data:` (#55).

A being's physical description — gender, age, birthday, height, weight, frame and
the `appearance.*` keys — was read out of a top-level `traits:` block. The content
format declares no such block. A note's type-specific facts live in the closed
`data:` container, and `being` declares every one of those keys there.

The difference is not cosmetic. Top level is deliberately open: the format passes
unrecognised keys straight through to Hugo, so a misspelled `wieght` under
`traits:` arrived here as a theme parameter rather than as a finding, and none of
these fields was checked by anything. Under `data:` the same misspelling names the
note and suggests the key it was meant to be.

Three of the reads changed shape as well as place. The old block nested its
measurements — `height: {m:}`, `weight: {kg:}`, `build: {frame:}` — where the
format declares `height` and `weight` as bare numbers, in metres and kilograms,
and `frame` as a property in its own right. The imperial conversions the
Appearance sentence performs are unchanged; only the path they read is.

**`traits:` is still read, underneath `data:`, and normalised to that one shape.**
2,533 notes across three repositories carry the old block today — 2,512 in
`harn-ensemble`, 17 in `sohl-kethira-basic`, 4 in `Song-of-Heroic-Lands-FoundryVTT`
— each converts on its own schedule under HeroicLands/package-build#128, and each
pins this theme on a caret range inside `0.x`. A release that read only `data:`
could therefore be adopted by a tree that had not converted yet, and every Profile
row and the whole Appearance sentence would vanish from its pages in silence:
`with` on an absent parameter renders nothing, which is exactly what the sidebar
correctly does for a creature that has no description at all. Reading both makes
the order those changes land in stop mattering, and `data:` wins wherever a note
writes both, so a converted tree is never read through the old shape.

The fallback is transitional and is removed once no tree writes `traits:`.
