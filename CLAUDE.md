# Portfolio — working notes for AI sessions

Static personal portfolio. No build step, no package manager, no framework. Open `index.html` in a browser to run it.

## Before any UI change

1. Read [DESIGN.md](DESIGN.md). It is the rulebook for elements, transitions, placement and functionality.
2. Pick work from [ROADMAP.md](ROADMAP.md), and tick items off there as they land.
3. Run the review checklist in DESIGN.md §9 on the change before calling it done.

## File map

| Path | What it is | Edit? |
|---|---|---|
| `index.html` | Home page: sidebar nav, `#intro`, `#one` (spotlights), `#two` (other projects tabs), `#involvement`, `#three` (publications), `#footer` | Yes |
| `carid.html`, `copilot.html`, `fortify.html`, `hawkeye.html`, `ngc.html`, `osint.html`, `timeoff.html`, `uon.html`, `vrteams.html`, `xrcop.html`, `xrmodule.html` | Project detail pages | Yes |
| `assets/css/custom.css` | All site-specific styling and every design token | Yes — all CSS changes go here |
| `assets/css/main.css`, `assets/sass/**` | HTML5 UP "Hyperspace" template | **No** — override from `custom.css` |
| `assets/js/main.js` | Template behaviour (sidebar, scrolly, scrollex), lightly patched | Sparingly |
| `assets/js/project-tabs.js` | Tabs for "Other Projects" (vanilla, WAI-ARIA tabs pattern) | Yes |
| `assets/js/theme.js` | Theme toggle wiring; the theme itself is set by an inline script at the top of `<head>` on every page | Yes |
| `assets/js/particles.js` | Hero canvas particles | Yes |
| `assets/js/*.min.js`, `assets/js/util.js` | Template vendor code | **No** |
| `assets/Lee_T_Resume.pdf`, `assets/publications/*.pdf` | Downloadable PDFs | See DESIGN.md §8 |

## Hard constraints

- **Keep the existing format.** Page structure, section order, content and the overall look stay. Guidelines change *how* elements behave, move and are placed, not what the site is.
- **Stay static.** The reference libraries in DESIGN.md are React libraries; use them as specifications to re-implement in plain HTML/CSS/JS. Do not add React, a bundler or npm dependencies.
- **Colours only through tokens.** Rules in `custom.css` name a custom property, never a literal colour. The documented exceptions are `#intro` and `#header`, which pin their own dark palette (see the comment at the top of `custom.css`).
- **Dark is the default theme**; `:root[data-theme="light"]` is the override. There is deliberately no `prefers-color-scheme` fallback.
- **Every interaction works with mouse, touch and keyboard**, and still works with JavaScript disabled where it does today.
- **This repo is public.** Never commit client-confidential material; see `.gitignore`.
- Shared changes (tokens, header, theme toggle) must be applied to all twelve HTML pages, not just `index.html`.
