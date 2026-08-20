# Issue Reporting — heroiclands-hugo-theme

This document defines how issues are created and classified in the
**`heroiclands-hugo-theme`** repository, the shared Hugo theme every Heroic Lands
site renders through.

**This repository is its own tracker.** File theme work here. See §9 for where a
given piece of work belongs — that section matters more here than in any other
repository, because a theme fault and a consumer fault look identical from a
browser.

> **Everything here is a shared dependency.** Three sites render through these
> layouts — `/sohl`, `/thalorna`, and heroiclands.org — so a change lands in all
> three at once and there is no per-consumer escape hatch. Two consequences for
> issues: say **which consumers** a bug affects (the form asks), and treat any
> change to a partial's parameters, required front matter, or class names as a
> `breaking-change`, because a consumer is relying on it.
>
> **The theme carries no addresses.** URLs, menus, and branding come from each
> consuming site's configuration. An issue asking the theme to *know* a URL is
> misfiled by construction — it belongs to the consumer that owns that address.

The core discipline is simple — four axes, each answering a different question:

- **Type** — _"what shape of work is this?"_ One per issue, from a closed set of five.
- **Priority** — _"how soon and how badly does this need doing?"_ A GitHub issue field, one value, defaults to Medium.
- **Labels** — _"what is this about?"_ Categorization only, chosen **only** from the registry below. Never invent a label.
- **Milestone** — _"which capability gate does this advance?"_ A native GitHub milestone (no due date), at most one, selected from a curated set (see §4).

Type, priority, and milestone are structured single values (one each). Labels
stack. Keep the roles separate: do not encode priority, urgency, or work-shape as a
label; do not encode subject matter as a type; and do not encode a capability gate
as a label when a milestone is its proper home.

## 1. Issue types

Exactly **one** type per issue. Choose using the decision procedure in §5 when in
doubt. Do not leave an issue untyped.

Issue types are **organization-level** in the `HeroicLands` org, so the same five
types — and their definitions — are shared with every other repository in the
project. They are not redefined here.

| Type        | Use it when…                                                                                                                                                        | Do **not** use it for…                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **bug**     | Existing, shipped behavior is wrong or broken relative to what it should do — an error, crash, incorrect result, or regression.                                     | Missing capability (that's a _feature_); known-incomplete work in progress; a chore.                                   |
| **feature** | A new capability or enhancement that does not exist yet, deliverable as one shippable unit of value.                                                                | Anything broken (_bug_); work large enough to need many sub-issues (_epic_); pure maintenance (_task_).                |
| **epic**    | A large body of work that only makes sense decomposed into multiple sub-issues; a coordinating container tracked by its children.                                   | Anything you can ship as a single issue. If it has no sub-issues, it is not an epic.                                   |
| **task**    | Necessary work that is neither a defect nor a new capability: chores, maintenance, refactors, dependency bumps, tooling, docs, releases. May or may not touch code. | Work whose outcome is uncertain and exploratory (_spike_); a defect (_bug_).                                           |
| **spike**   | A **timeboxed** investigation whose deliverable is a _decision, answer, or recommendation_ — not shipped code. Outcome is genuinely uncertain going in.             | Work whose steps are already known (that's a _task_). A spike that produces code instead of a conclusion was mistyped. |

**Type rules**

- **MUST** assign exactly one type.
- A **bug** is _broken_; a **feature** is _missing_. That distinction resolves most ambiguity — decide which word fits before anything else.
- An **epic** MUST link its sub-issues (native GitHub sub-issues; see §6) and SHOULD carry little implementation detail of its own. Its acceptance is "all sub-issues closed and the whole verified together."
- A **spike** MUST state (a) the question it answers and (b) its timebox. It closes when the question is answered, and it typically _spawns_ follow-up feature/task/bug issues rather than doing the work itself.
- A **refactor** that changes no external behavior is a **task**, tagged `tech-debt` — it is not a feature and not a bug.

**What "broken" means for a theme.** This repository ships templates and styles, not
running application code, so a bug is usually a **rendering** fault: a partial that
emits nothing for valid input, a row that prints a raw value where every sibling
renders a link, a layout that collapses at a viewport, output that fails to escape.

**Check more than one consumer before filing.** If a page renders wrong on exactly
one site and correctly on the others, the fault is almost always that site's content
or configuration, not the theme — see §9. A theme bug reproduces across consumers, or
the issue says why it cannot.

**A styling preference is not a bug.** Wanting a different look is a **feature**; a
look that contradicts the brand or breaks legibility is a bug.

## 2. Priority (GitHub issue field)

Priority is a native **Priority** field on the issue itself — an
organization-level issue field, **not** a label and **not** tied to a Project. Set
it in the issue sidebar; the repo issue list filters on it
(`field.priority:high,medium`), and it is read/written through the GitHub issue
API. One value per issue, from: **Urgent · High · Medium · Low**.

Priority is about attention, not schedule — this project has no deadlines, so
priority answers "when I next sit down, what deserves my time?" not "what is due."

| Priority   | Meaning                                                      | Typical triggers                                                                                                                                       |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Urgent** | Do it next session. Active harm or a hard blocker.           | Content loss or corruption; packs that will not compile, so nothing ships; the published site is down or serving wrong pages; blocks the current gate. |
| **High**   | Wanted soon; the current gate leans on it.                   | A published address broken with no redirect; work the active milestone depends on.                                                                     |
| **Medium** | **Default.** Should get done; not blocking the current gate. | Most content and tooling work; defects with a workaround.                                                                                              |
| **Low**    | Deferrable indefinitely with little cost.                    | Cosmetic issues; nice-to-haves; long-tail edge cases; opportunistic cleanup.                                                                           |

**Priority rules**

- **MUST** set a priority on every issue.
- **Default to Medium.** Anything higher MUST be justified in the body (one line: why the impact warrants it). Do not inflate — not everything is High.
- Priority is independent of type, labels, **and** milestone. A `security`-labelled issue is **not** automatically Urgent: hardening with no known exploit can be Low; an exploit in the wild is Urgent. Judge impact, not the topic.
- An **epic**'s priority reflects the initiative's importance, not the max of its children.

## 3. Labels — the closed registry

Labels are for **categorization only**. The table below is the **complete,
authoritative set for this repository**. Its machine-readable twin is
`.github/labels.yml`, which the `labels-sync` workflow reconciles onto GitHub (the
set is _closed_ — a label not in the registry is deleted on sync). `npm run
lint:labels` fails if the two disagree (`check-labels`), so they cannot drift.

> **MUST NOT invent, rename, or improvise labels.** If no existing label fits, add
> none and (if it matters) note the gap in the issue body for a maintainer to decide.
> Extending this registry is a deliberate decision made by editing **both** this
> table and `.github/labels.yml`, not something done at filing time.

**This registry describes presentation only.** `content`, `system`, `tests`, and
`site` are absent: this repository holds no content, no packages, and no addresses,
and every issue in it is about the theme, so a `site` label would carry no
information.

| Label             | Scope                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `layout`          | Templates, partials, shortcodes — the structure a page renders into.                                                        |
| `styling`         | CSS, fonts, images, icons, palette — how a rendered page looks.                                                             |
| `documentation`   | Documentation about this repository — README, `theme.toml`, process, authoring guides.                                      |
| `devops`          | Build, tooling, release pipeline, repo config.                                                                              |
| `security`        | Touches an attack surface: injection into rendered HTML, unsafe template output, external resources, or anything warranting private disclosure (§7). |
| `tech-debt`       | Restructuring or cleanup of working templates or styles; refactors.                                                         |
| `regression`      | Something that previously rendered correctly and stopped. Pairs with type `bug`.                                            |
| `breaking-change` | Changes a partial's contract, a required parameter, or a class name consumers depend on.                                    |
| `blocked`         | Cannot proceed until an external dependency or another issue clears.                                                        |
| `duplicate`       | This issue or pull request already exists.                                                                                  |
| `question`        | Further information is requested.                                                                                           |
| `wontfix`         | This will not be worked on.                                                                                                 |

**`breaking-change` is not rare here.** Three sites render through these layouts, so
renaming a partial parameter, requiring new front matter, or changing a class name a
consumer styles against breaks them all at once. Apply it whenever a consumer would
have to change to keep working.

> **No capability-gate labels.** Progress toward a capability is tracked by
> **milestones** (§4), not labels. Do not add `infobox`-style or `v1.0`-style labels
> to mark what a milestone already carries.

**Label rules**

- Choose labels **only** from this file. No exceptions.
- Labels are additive and orthogonal — `layout` + `styling` + `regression` on one bug is fine.
- Do not use a label to express something a type, the priority field, or a milestone already expresses.

## 4. Milestones — capability gates

Milestones here are **capability gates, not calendar dates.** Each milestone is a
demonstrable threshold the theme crosses — a state you can point at and say "it
does this now" — and **crossing a gate is what triggers a release.** This project is
not date-driven and has no deadlines, and GitHub supports that directly: a
milestone's due date is optional, and its progress bar is computed from the ratio of
closed to open issues, not from any date. Leave due dates blank.

**Name milestones by the capability reached,** phrased as a state of the theme —
"every infobox resolves its references", "the theme is address-free" — rather than by a
date or a version number alone. If you want the order explicit, encode it in the
name (`M1 · …`, `M2 · …`); otherwise let the list carry it.

**An issue's milestone is the gate its work advances.** When every issue in a
milestone is closed, the theme has crossed that gate. One milestone per issue
(GitHub enforces this); if an issue seems to serve two gates, it usually belongs to
the earlier one or is scoped too large.

**Milestone vs. epic — different lenses, keep them straight:**

|           | **Epic** (a type)                          | **Milestone** (a gate)                       |
| --------- | ------------------------------------------ | -------------------------------------------- |
| Groups by | work breakdown — a tree of sub-issues      | outcome — a capability the theme gains     |
| Answers   | "what are all the pieces of _this build_?" | "how close is it to _doing this thing_?"     |
| Done when | all its sub-issues are closed              | all issues tagged to it are closed           |
| Shape     | vertical: one initiative, decomposed       | horizontal: a slice across the whole theme |

**The milestone set is curated, like the label registry** — select from existing
gates and never invent one.

- You MAY assign an issue to a milestone when its work **unambiguously advances exactly one existing gate**.
- Leave the milestone **unset** when the issue advances none of the current gates (it is future/backlog), spans several, or the mapping is unclear. An unset milestone is a normal, correct state.
- You MUST NOT create a new milestone. If no gate fits and one seems warranted, note it in the body and raise it for awareness.

**This repository currently defines no milestones.** That is deliberate, not an
oversight: gates are named when the maintainer knows which capability the package is
driving at, and until then every issue's milestone is correctly unset. Do not invent
one to fill the field.

### Milestones and releases

**Reaching a gate is what cuts a release.** When every issue in a milestone is
closed, the theme has demonstrably gained that capability — and that is the
trigger to cut a new release, versioned for the capability reached, not for any
date. There is no release calendar and no due dates: releases are **paced by
capability**, so the milestone progress bar is the only schedule the project keeps.

## 5. Choosing the type — decision procedure

Walk this in order; take the first match.

1. Is something **broken** relative to intended behavior? → **bug** (add `regression` if it used to work).
2. Is the outcome **genuinely uncertain** and the deliverable a **decision/answer**? → **spike** (state question + timebox).
3. Is this too large to ship as one issue, needing **multiple sub-issues** to coordinate? → **epic**.
4. Is it a **new capability or enhancement** that doesn't exist yet? → **feature**.
5. Otherwise — chore, maintenance, refactor, docs, tooling, release? → **task**.

Then, regardless of type: set **priority** (default Medium; justify higher), apply
any **labels** from §3 that categorize it, and set a **milestone** only when the issue
clearly advances one existing capability gate (§4) — otherwise leave it unset.

## 6. Body structure by type

Titles: imperative and specific. "Render the polity infobox Peoples row as links,"
not "infobox bug." No trailing punctuation.

Every issue body should give enough context that someone with repo familiarity but
no memory of the conversation can act on it. Use the shape for its type — the issue
forms in `.github/ISSUE_TEMPLATE/` pre-fill each of these.

### Bug

Bugs should describe the problem as fully as possible, so it may be easily
reproduced. The description should NOT contain a description of how to fix the
issue. Suggestions for fixes or approaches may be placed in comments.

**Acceptance criteria** is optional.

```
## Summary
One sentence: what's wrong.

## Steps to reproduce
1. …
2. …

## Expected vs. actual
Expected: …
Actual: …

## Acceptance criteria
- [ ] Observable condition 1
- [ ] Observable condition 2

## Environment
Foundry version · SoHL system version · module version · browser/OS if relevant

## Notes
Stack traces, console output, suspected cause.
```

### Feature

```
## Problem / motivation
What need or gap this addresses.

## Proposed solution
What to build. Sketch the approach if known.

## Acceptance criteria
- [ ] Observable condition 1
- [ ] Observable condition 2
```

### Epic

```
## Goal
The outcome this initiative delivers.

## Scope
In scope / out of scope.

## Sub-issues
(Linked as native sub-issues; list mirrors them.)
- [ ] #…
- [ ] #…

## Done when
All sub-issues closed and integration verified.
```

### Task

```
## What
The work to be done.

## Why
The reason it's needed (keeps chores from looking arbitrary).
```

### Spike

```
## Question
The specific thing we need to decide or learn.

## Timebox
e.g. 1 day / 4 hours. MUST be present.

## Deliverable
The form of the answer: a decision, a recommendation, a written finding,
a prototype-to-throw-away. NOT production code.

## Follow-up
Note that follow-up feature/task/bug issues will be filed from the outcome.
```

## 7. Security issues — special handling

If an issue would be labelled `security` **and** describes an exploitable weakness
(not merely hardening), **do not open a public issue**. Use GitHub's private
security advisories / vulnerability reporting instead — the "Report a
vulnerability" button on this repository's Security tab, also linked from the issue
chooser. These templates render into public web pages on three sites, so a partial that emits
author-supplied text without escaping it, or that pulls in an external resource, is a
real (if small) attack surface — and it is multiplied by every consumer. When in
doubt, disclose privately and let a maintainer decide whether to make it public.

## 8. Worked examples

**Bug, High**

> **Title:** Render the polity infobox Peoples row as links
> **Type:** bug · **Priority:** High · **Labels:** `layout` · **Milestone:** _(unset)_
> Body: every other identity row in the same card resolves its value to a page; Peoples humanizes it, so a reader cannot get from a realm to the folk who live in it. Reproduces on `/thalorna` and `/sohl` → theme, not consumer.

**Bug, Medium, regression**

> **Title:** Restore the breadcrumb package prefix on knowledgebase pages
> **Type:** bug · **Priority:** Medium · **Labels:** `layout`, `regression` · **Milestone:** _(unset)_
> Body: rendered correctly before; a workaround exists in the consumer → Medium.

**Feature, Medium, breaking-change**

> **Title:** Take the infobox reference list as structured entries rather than strings
> **Type:** feature · **Priority:** Medium · **Labels:** `layout`, `breaking-change`
> Body: new capability; every consumer must update its front matter, so it is a breaking change even though nothing is broken today.

**Task, Low**

> **Title:** Drop the unused blog-post layout
> **Type:** task · **Priority:** Low · **Labels:** `tech-debt`, `layout` · **Milestone:** _(unset)_
> Body: no consumer references it → Low.

**Spike, Medium**

> **Title:** Decide how consumers should override a partial without forking the theme
> **Type:** spike · **Priority:** Medium · **Labels:** `layout`
> Body: **Question** — what is the supported override seam? **Timebox** — 4 hours. **Deliverable** — a written rule. Follow-up issues filed from the finding.

## 9. Which repository does an issue belong in?

The project spans several repositories in the `HeroicLands` organization, and **each
one tracks its own work.** There is no central tracker.

| Repository                        | Tracks                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `Song-of-Heroic-Lands-FoundryVTT` | The Foundry system code, the `sohl` package's content, and the system build |
| `sohl-thalorna`                   | The `thalorna` package — original setting content, and the `/thalorna` site |
| `sohl-kethira-basic`              | The `kethira` package — unofficial Hârn fan material, Foundry packs only    |
| `heroiclands-site`                | heroiclands.org — its content, Cloudflare Pages, the CDN                    |
| `heroiclands-hugo-theme`          | **This repository** — the shared theme all three sites render through       |

### The theme-or-consumer test

This is the question this repository gets wrong most often, because a theme fault and
a consumer fault are indistinguishable in a browser. Apply it in order:

1. **Does it reproduce on more than one consumer?** If yes, it is almost certainly
   the theme. File here.
2. **Does it reproduce on exactly one?** Then the theme is receiving different input
   there — the fault is that site's content or configuration. File it in that
   repository. The theme is the same bytes for all three, so it cannot be the
   variable.
3. **Is it about a URL, a menu entry, a site title, or branding?** File it in the
   consumer, always. **The theme carries no addresses** — consumers supply `[menu]`,
   `params.cdnBaseURL`, `brand`, and `home`. An issue asking the theme to know an
   address is misfiled by construction.
4. **Is it "this page's data is wrong"?** That is content, and content lives in a
   consumer. The theme's fault would be *how* it renders data, never *what* the data
   says.

The one that gets missed: a partial rendering nothing because a note omits a field is
a **content** bug in the consumer — unless the partial should degrade gracefully, in
which case it is a theme bug too, and both get an issue.

### Changes here land everywhere at once

There is no per-consumer branch. A merge to `main` reaches whichever consumers track
it, so an issue that would help one site and harm another needs to be reframed as a
configurable seam before it can be accepted — say so in the body rather than
proposing a consumer-specific behaviour.

> **Closing keywords do not cross repositories.** A pull request here carrying
> `Closes HeroicLands/sohl-thalorna#12` creates a reference but **does not close**
> that issue — GitHub only auto-closes within the same repository. A
> cross-repository issue is **closed by hand**, with a comment linking the delivering
> commit or pull request. Never assume the keyword did it; check.

**Historical note.** Until 2026-08-20 this repository kept no backlog of its own and
its work was tracked in `Song-of-Heroic-Lands-FoundryVTT` under the `site` label. It
now tracks its own.

## Self-check before filing

You should confirm all of these before submitting an issue:

- [ ] This is the right repository (§9) — the theme-or-consumer test says the fix lands here.
- [ ] For a bug: which consumers reproduce it is stated.
- [ ] Exactly **one type** assigned, chosen via the §5 procedure.
- [ ] A **priority** is set. If above Medium, the body justifies it in one line.
- [ ] Every label comes from the §3 registry. **Zero** invented labels.
- [ ] No label duplicates what the type, priority field, or milestone already says.
- [ ] **Milestone** set only when the issue clearly advances one existing capability gate (§4); otherwise unset. **Never** invented.
- [ ] Title is imperative and specific; body follows the §6 shape for its type. Title should not encode labels or other field information.
- [ ] If `security` + exploitable → routed to **private advisory**, not a public issue (§7).
- [ ] If **epic** → sub-issues are linked. If **spike** → question and timebox are present.
