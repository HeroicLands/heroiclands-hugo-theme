---
"@heroiclands/hugo-theme": patch
---

The being sidebar reads `data:` alone (#56).

#55 moved it onto the `data:` container the content format declares, and kept reading
the legacy top-level `traits:` block underneath — normalised to the same shape — for
one release. That fallback existed so the four repositories converting to the new
shape could land in any order without a published sidebar silently going blank in
between.

All of them have landed, and **every content tree now carries zero `traits:` blocks**:
`harn-ensemble`, `sohl-thalorna`, `sohl-kethira-basic`,
`Song-of-Heroic-Lands-FoundryVTT` and `harn-adventures`. So the fallback is a second
way to say one thing, kept alive by nothing.

Verified by rendering rather than by argument: the SoHL knowledgebase built with and
without the fallback is **byte-identical across all 1,785 pages, 95 of them being
pages**. The `data:` path is live in that output — `Basic_Folk` renders _"Age 20,
5′ 7″, 150 lbs, medium frame, brown eyes, brown hair, pale skin"_, with its Gender and
Born rows, all from `data:`.
