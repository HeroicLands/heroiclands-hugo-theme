---
---

Dependabot pull requests no longer have to declare a changeset. This package
publishes `layouts`, `static`, `data` and `theme.toml` and declares no runtime
dependencies at all, so no npm dependency of it ever reaches a consumer and a
bump has no release to declare.
