# UI roadmap

Backlog for bringing the site in line with [DESIGN.md](DESIGN.md) while keeping its existing format. Work top to bottom; tick items as they land.

Items marked **Seen** were observed in the code when this was written (2026-11-16). Items marked **Check** have not been inspected yet: confirm against the code first, and drop the item if it does not apply.

## Phase 0 — Tokens

Groundwork; no visible change.

- [ ] Add `--ease-out`, `--ease-in-out`, `--ease-drawer` to `:root` in `assets/css/custom.css`. (DESIGN §3)
- [ ] **Check** the `border-radius` values in `custom.css`; choose a `--radius` base and derived steps, and replace literals. (DESIGN §5)
- [ ] Add duration tokens only for values that end up repeated. (DESIGN §5)

## Phase 1 — Motion audit of existing UI

- [ ] **Seen:** `.theme-toggle` thumb moves with `transform 0.25s ease` (`custom.css`, near line 915). Movement of an on-screen element should use `--ease-in-out` or `--ease-out`. (DESIGN §3 easing)
- [ ] **Seen:** sidebar scroll uses `speed: 1000` in `assets/js/main.js` (`$('.scrolly').scrolly`). Well over the duration budget; shorten, and skip the animation under reduced motion. (DESIGN §3 duration)
- [ ] **Seen:** both `prefers-reduced-motion` blocks in `custom.css` (near lines 2295 and 2693) set `transition: none` on colour and opacity fades. Reduced motion should keep fades and remove only movement. Also confirm the template's own entrance animations and the particle canvas are covered. (DESIGN §3 accessibility)
- [ ] **Seen:** colour and background transitions use `0.2s ease`. This already matches the rule for hover/colour; leave as is.
- [ ] **Seen:** transitions carry `-moz-`, `-webkit-`, `-ms-` prefixed copies. Remove them as each rule is touched.
- [ ] **Check:** `:hover` rules in `custom.css` are inside `@media (hover: hover) and (pointer: fine)`. The JS hover in `project-tabs.js` is already gated. (DESIGN §3 input)
- [ ] **Check:** buttons and button-like links (`.resume-btn`, `.tabs-tab`, `.theme-toggle`, contact links) give `:active` press feedback. (DESIGN §3 transform; §2 feedback)
- [ ] **Check:** the template's section entrances (`fade-up`, `inactive`, `is-preload` in `main.css`): easing, duration, distance travelled, and whether groups stagger. Override from `custom.css`; do not edit `main.css`. (DESIGN §3)
- [ ] **Check:** the tab panel crossfade (`opacity 0.25s ease`, near line 2190) when the tab change comes from the keyboard; keyboard-initiated changes should not animate. (DESIGN §3 "should it animate")
- [ ] **Check:** no rule uses `transition: all` or animates layout properties, including inside the template rules the site still relies on. (DESIGN §9)

## Phase 2 — Component behaviour

- [ ] **Seen:** the theme toggle is a `button` with `aria-pressed` whose `aria-label` also changes with state (`assets/js/theme.js`). State is announced twice and the name is unstable. Move to the switch contract: `role="switch"`, `aria-checked`, one fixed name such as "Light theme". Apply on all twelve pages. (DESIGN §4)
- [ ] Add `data-state` to tabs, panels and the theme toggle from JS, and move state styling onto it; `is-active` can remain during migration. (DESIGN §4 state attributes)
- [ ] **Check:** the sidebar marks the current section with a class only; add `aria-current` alongside it in `main.js`. (DESIGN §4)
- [ ] **Check:** after a sidebar link scrolls the page, keyboard focus ends up in the target section. (DESIGN §4)
- [ ] **Check:** every interactive element has a visible `:focus-visible` style in both themes. (DESIGN §2 feedback)
- [ ] Repeat this phase across the eleven project pages, which share the header and toggle.

## Phase 3 — Placement and function review

Run the nine-question checklist (DESIGN §2) on each area and record findings here before changing anything. This phase must not change section order or content.

- [ ] Sidebar navigation — is the current location always clear; is the item count within memory limits?
- [ ] `#intro` — are the primary actions (resume, contact) obvious as actions; does the theme toggle sit where users look for it?
- [ ] `#one` spotlights — do the cards signal that they lead to a project page?
- [ ] `#two` other projects — is it discoverable that tabs respond to hover, and on touch that they respond to tap?
- [ ] `#involvement` — are logos that link distinguishable from ones that do not?
- [ ] `#three` publications — does each link say what it opens (PDF, external site)?
- [ ] `#footer`
- [ ] Project pages — is the way back to the home page obvious?

## Phase 4 — New patterns, only where Phase 3 shows a need

- [ ] **Check** how navigation behaves below 736 px. If it is hidden or cramped, consider a drawer. (DESIGN §7)
- [ ] Copy-to-clipboard on the email address, confirmed with a toast. (DESIGN §6)
- [ ] Tooltips on icon-only links. (DESIGN §4)

Before building a toast or drawer, re-read the current docs at `sonner.emilkowal.ski` and `vaul.emilkowal.ski`; only part of their behaviour was available when DESIGN.md was written.

## Phase 5 — PDFs

- [ ] Check each file in `assets/publications/` and `assets/Lee_T_Resume.pdf` for a document title, author and a selectable text layer; fix where missing. (DESIGN §8)
- [ ] **Check** that every link to a PDF on the site says it is a PDF. (DESIGN §2, §8)

## Done

Nothing yet.
