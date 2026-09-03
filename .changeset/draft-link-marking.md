---
"@heroiclands/hugo-theme": minor
---

Style `.sohl-draft-link`, the class the SoHL content builds wrap around a link
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
