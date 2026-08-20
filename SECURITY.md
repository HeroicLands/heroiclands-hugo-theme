# Security Policy

## Reporting a vulnerability

Report suspected vulnerabilities privately via the "Report a vulnerability"
button on this repo's Security tab (Security → Advisories). Please do not
open a public issue for security problems — see
[§7 of the issue-reporting standard](.github/ISSUE_REPORTING.md#7-security-issues--special-handling).

I'll acknowledge the report, develop a fix in a private advisory, and credit
you on publication if you'd like.

## Supported versions

`main` receives fixes. This theme is consumed as a git submodule pinned to a
commit, so a consuming site is only protected once it moves its pin.

## Scope

This repository is a Hugo theme: layouts, partials, shortcodes, and static
assets. It ships no application code and holds no data of its own. The relevant
concerns are therefore what the templates *emit*:

- author-supplied text rendered without escaping, or through `safeHTML` /
  `safeURL` / `safeJS` where the input is not provably trusted
- external resources (scripts, fonts, images, iframes) pulled into a rendered
  page
- values interpolated into `href`, `src`, `style`, or inline event handlers

**A finding here is multiplied by every consumer** — three sites render through
these layouts, and a fix reaches a site only when it moves its submodule pin.
Please say which partial is involved so the blast radius can be assessed.

Content faults belong to whichever site authored the content, not here — see
[§9](.github/ISSUE_REPORTING.md#9-which-repository-does-an-issue-belong-in).
