# Heroic Lands Hugo theme

Shared Hugo theme for the Heroic Lands sites, so **www.heroiclands.org**,
**kb.heroiclands.org**, and the generated API docs read as one coherent site.

It provides the brand chrome (header/footer, the Cinzel/Lora + dark palette,
base CSS in `static/css/style.css`), the content layouts, and the SoHL
info-block partials under `layouts/partials/sidebars/` (character, creature,
gear, impact, mystical, equipment). Shortcode/display-name mappings live in
`data/sohl.yaml`.

## Use

Add as a submodule and set the theme:

```bash
git submodule add https://github.com/HeroicLands/heroiclands-hugo-theme.git themes/heroiclands-hugo-theme
```

```toml
# hugo.toml
theme = "heroiclands-hugo-theme"
```

The brand nav (with absolute `www` URLs, so it works from any subdomain) is
defined in the theme's `hugo.toml` `[menu]` and inherited by consuming sites.

## License

Code (layouts, CSS): GPL-3.0-or-later. Content/data authored for The World of
Thalorna and Song of Heroic Lands: CC-BY-SA-4.0.
