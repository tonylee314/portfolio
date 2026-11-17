# Design guidelines

Rules for all future UI work on this site. The existing format stays (see [CLAUDE.md](CLAUDE.md)); these rules govern how elements behave, move, and are placed.

## 1. Sources and precedence

| # | Source | Governs here |
|---|---|---|
| 1 | [Human-centered design fundamentals](https://github.com/curiositech/some_claude_skills/blob/main/.claude/skills/human-centered-design-fundamentals/SKILL.md) | Placement, functionality, feedback, error prevention (§2) |
| 2 | [PDF skill](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/document-skills/pdf/SKILL.md) | The resume and publication PDFs only — not a UI source (§8) |
| 3 | [Emil Kowalski's skills](https://github.com/emilkowalski/skills) | Every motion value: easing, duration, scale, origin (§3) |
| 4 | [shadcn/ui](https://ui.shadcn.com/) | Token naming and component anatomy (§5) |
| 5 | [Base UI](https://base-ui.com/) | Component behaviour and enter/exit state attributes (§4) |
| 6 | [Radix Primitives](https://www.radix-ui.com/) | Component behaviour, ARIA, keyboard, focus (§4) |
| 7 | [Sonner](https://github.com/emilkowalski/sonner) | Toasts (§6) |
| 8 | [Vaul](https://github.com/emilkowalski/vaul) | Drawer feel (§7) |

Sources 4–8 are React libraries. This site is static, so they are **specifications to re-implement in plain HTML/CSS/JS**, never dependencies to install. `assets/js/project-tabs.js` is the model: it implements the WAI-ARIA tabs pattern with no library.

When sources disagree, the higher line wins:

1. Human-centered design — whether something should exist, where it goes, what it tells the user
2. Radix / Base UI — how a component behaves (roles, keys, focus, state)
3. Emil Kowalski — how it moves
4. shadcn/ui — what tokens and parts are called
5. Sonner / Vaul — toast and drawer details only

Known disagreement: Base UI's sample CSS exits with `ease-in` and enters from `scale(0.9)`. Follow §3 instead (`ease-out`, `scale(0.95)`).

Vaul is marked unmaintained by its author. Use it for how a drawer should feel; use Base UI's Drawer for how it should behave.

## 2. Human-centered principles

Design for how people actually perceive and remember, not for how the system is built.

- **Discoverability.** Every possible action is visible without instructions. If something is clickable, hoverable or draggable, it looks it. A label added to explain a control is a sign the control is wrong.
- **Signifiers and mapping.** A control sits next to what it affects and moves in the direction of its effect. The tab list beside its panel is correct; a control far from its result is not.
- **Feedback.** Acknowledge every input within **0.1 s** (hover, pressed, focus states). Anything that takes longer than **1 s** shows progress. Confirm completion (a download started, an address copied).
- **Conceptual model.** What the page shows should explain how it works. The active tab, the current nav section and the current theme are always visibly marked.
- **Knowledge in the world.** Working memory holds roughly 3–7 items. Keep nav and tab lists inside that range, and never make the user remember something from one section to use another.
- **No hidden modes.** If a mode is unavoidable (dark/light theme), its current state is always visible on the control itself.
- **Design out errors.** Slips: make targets large and separate, cut steps. Mistakes: make the outcome of an action predictable before it is taken (a link says where it goes; a download says its file type). If several users would make the same error, the design is at fault.
- **Three levels.** Visceral (does it look good), behavioural (does it work the way learned patterns predict), reflective (is it remembered well). Never trade the second for the first: no hidden controls or stripped-back affordances for the sake of minimalism.

### Evaluation checklist

Ask these of any new or changed element:

1. Can a user find the possible actions without instructions?
2. Are constraints visible and effective?
3. Is the mapping from control to effect natural?
4. Does what is shown communicate how it works?
5. Is feedback immediate and informative?
6. Are the visceral, behavioural and reflective levels all served?
7. Which errors are possible here — slips, mistakes, memory lapses?
8. Is there a mode, and can it be removed?
9. Does anything demand more than a person can realistically do or remember?

## 3. Motion

### Should it animate at all?

| How often the user triggers it | Decision |
|---|---|
| Constantly (keyboard navigation, shortcuts) | No animation |
| Tens of times per visit (hover, moving through a list) | Remove or reduce heavily |
| Occasionally (dialogs, drawers, toasts) | Standard animation |
| Rarely or once (page load, first reveal) | Delight is allowed |

Every animation needs a purpose: spatial continuity, showing a state change, explanation, feedback, or softening a jarring change. Keyboard-initiated actions do not animate.

### Easing

Define once in `:root` in `assets/css/custom.css` and reference everywhere:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* entering, exiting, most UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* something already on screen moving or morphing */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* drawers and sheets */
```

Decision order: entering or exiting → `--ease-out`. Moving or morphing on screen → `--ease-in-out`. Hover or colour change → plain `ease`. Constant motion → `linear`. Unsure → `--ease-out`. **Never `ease-in`** on UI.

### Duration

| Element | Duration |
|---|---|
| Press feedback | 100–160 ms |
| Tooltips, small popovers | 125–200 ms |
| Dropdowns, selects | 150–250 ms |
| Dialogs, drawers, sheets | 200–500 ms |
| Toasts | 400 ms |
| Everything else | under 300 ms |

- Exits are faster than enters (for example enter 250 ms, exit 200 ms).
- Staggered groups: 30–80 ms between items, not perfectly uniform.
- Slow when the user is deciding, fast when the system is responding.

### Transform, opacity, origin

- Pressable elements: `transform: scale(0.97)` on `:active` (acceptable range 0.95–0.98).
- Entrances start at `scale(0.95)` with `opacity: 0`. Never from `scale(0)`.
- Popovers, tooltips and menus scale from their trigger (`transform-origin` at the trigger). Dialogs scale from centre.
- If a crossfade looks off, add `filter: blur(2px)` during the transition. Keep any animated blur under 20 px.

### Implementation

- Animate only `transform` and `opacity`. Not `width`, `height`, `top`, `left`.
- Name the properties. No `transition: all`.
- Use CSS transitions for anything that can be interrupted or retriggered quickly (hover, tabs, toggles); transitions retarget, keyframes restart. Keep keyframes for predetermined one-shot motion.
- Entry animations: `@starting-style`, or a `data-starting-style` attribute removed after mount (§4).
- `will-change: transform` only after seeing a 1 px shift when motion starts.
- Per-frame updates (the particle canvas, any drag) write directly to the element, not to a CSS variable on a parent.

### Input and accessibility

- Hover effects live inside `@media (hover: hover) and (pointer: fine)`, so touch devices never get a stuck hover.
- `prefers-reduced-motion: reduce` means gentler, not none: **keep opacity and colour fades, remove movement and scaling**.

### Small details

- Numbers that change or align in columns: `font-variant-numeric: tabular-nums`.
- Large headings: `letter-spacing: -0.02em`.
- Body copy: `max-width: 65ch`.
- Prefer a semi-transparent shadow to a solid border for separating raised surfaces. (On the dark theme the ink steps are too close to define an edge, so the existing hairline tokens stay where a shadow would not read.)
- Fading gradients use extra colour stops along an ease curve so no hard edge shows.

## 4. Component behaviour

Each interactive element follows the matching Radix / Base UI contract: the right roles, full keyboard support, managed focus, and its state exposed as an attribute so CSS styles the state rather than JS setting styles.

### State attributes

Use one convention across the site:

- `data-state` for persistent state: `active`/`inactive` (tabs), `checked`/`unchecked` (switch), `open`/`closed` (anything that opens).
- `data-starting-style` on an element for its first frame, and `data-ending-style` while it leaves, for enter/exit transitions:

```css
.popup {
	transform-origin: var(--transform-origin);
	transition: transform 150ms var(--ease-out), opacity 150ms var(--ease-out);
}
.popup[data-starting-style],
.popup[data-ending-style] {
	opacity: 0;
	transform: scale(0.95);
}
```

An element that is closing stays in the DOM until its transition ends, then is hidden. Existing `is-active` classes may stay alongside `data-state` while rules are migrated.

Anything layered above the page (dialog, popover, toast, drawer) needs the page wrapper to form its own stacking context (`isolation: isolate`) so the layer always sits on top.

### Contracts

| Component | Roles and attributes | Keyboard | Focus |
|---|---|---|---|
| **Tabs** (exists: "Other Projects") | `tablist` > `tab` with `aria-selected`, `aria-controls`; `tabpanel` with `aria-labelledby`; inactive panels `hidden` | Arrow keys move and activate, wrapping; Home / End | Roving `tabindex`: only the selected tab is a tab stop |
| **Switch** (exists: theme toggle) | `role="switch"` with `aria-checked`, and a fixed accessible name | Space / Enter toggles | Visible focus ring |
| **Navigation** (exists: sidebar) | `nav` with links; current section marked `aria-current` | Tab through links | Focus ring; scroll target receives focus or is announced |
| **Dialog** | `role="dialog"`, `aria-modal="true"`, labelled by its title | Escape closes | Focus moves in on open, is trapped, returns to the trigger on close; page behind is inert |
| **Tooltip** | `role="tooltip"`, linked by `aria-describedby` | Shows on focus as well as hover; Escape hides | Never holds focus; never the only place information lives |
| **Collapsible / accordion** | Trigger is a `button` with `aria-expanded`, `aria-controls` | Space / Enter toggles; in an accordion, arrows move between headers | Stays on the trigger |
| **Popover / menu** | Trigger has `aria-haspopup`, `aria-expanded` | Escape closes; arrows move within a menu | Moves in on open, returns to trigger on close; outside click closes |
| **Drawer** | As dialog | Escape closes | As dialog (§7) |
| **Toast** | Container is an `aria-live="polite"` region | A key to jump to the toast region; Escape dismisses | Does not steal focus (§6) |

Tooltip timing: a short delay before the first one opens; once one is open, neighbours open instantly (0 ms).

### Intentional local behaviour to preserve

The "Other Projects" tabs also activate on **mouse hover**, which neither library does. This is deliberate and already gated to fine pointers in `project-tabs.js`; click, touch and keyboard all work as the contract requires. Keep it.

## 5. Tokens and anatomy

All colour, and from now on all motion and radius, lives in custom properties in `assets/css/custom.css`.

shadcn/ui's convention is that each surface token has a matching `-foreground` token for what sits on it. The existing tokens are **not renamed**; this table is the guide for reading them and for naming anything new.

| shadcn concept | Existing token here |
|---|---|
| `background` | `--ink-800` (page base) |
| `card` / `popover` | `--ink-600` (raised surfaces) |
| `sidebar` | `--ink-700` |
| `muted` | `--surface-tint-1`, `--surface-tint-2`, `--surface-tint-3` |
| `foreground` | `--text-1` |
| `muted-foreground` | `--text-2`, `--text-3` |
| `primary` | `--accent` (hover/pressed: `--accent-strong`) |
| `primary-foreground` | white, fixed (the accent fill is dark in both themes) |
| `border` | `--hairline`, `--hairline-strong`, `--border-visible`, `--border-emphasis` |
| `ring` | `--focus-ring` |

Rules for new tokens:

- A new surface gets a paired foreground token, and both get a value under `:root` and under `:root[data-theme="light"]`.
- Check contrast when adding: 4.5:1 for text, 3:1 for the edge of a control.
- Radius: one base `--radius`, with steps derived from it (`sm` 0.6×, `md` 0.8×, `lg` 1×, `xl` 1.4×), so changing the base changes the whole scale. Audit the radii already in `custom.css` before choosing the base.
- Motion tokens: the three easings in §3, plus named durations as they are needed.

Anatomy: build each component from small named parts (root, trigger, list, item, panel, title, footer), as the existing `tabs`, `tabs-list`, `tabs-tab`, `tabs-panel`, `tabs-panel-title` classes already do. Components are plain markup the site owns and can edit, not black boxes.

## 6. Toasts

Add one only when an action has no other visible result (for example "Email address copied"). Following Sonner:

- Position bottom-right, 32 px from the edges; on narrow screens, bottom centre and full width.
- At most 3 visible, stacked with a 14 px gap; older ones tuck behind and expand on hover.
- Auto-dismiss after about 4 s; the timer pauses on hover and while the tab is hidden.
- Enter and exit at 400 ms `ease`, sliding from the edge it is anchored to.
- Swipe towards the nearest edge to dismiss.
- Lives in an `aria-live="polite"` region and never takes focus.
- Short text, one idea, no essential information that exists only in the toast.

## 7. Drawers

A candidate for navigation on small screens. Feel from Vaul, behaviour from Base UI's Drawer and the dialog contract in §4:

- Slides from the screen edge with `--ease-drawer`, up to 500 ms; closes faster than it opens.
- Follows the finger while dragged. Dismiss when release velocity (distance ÷ time) exceeds **0.11**, whatever the distance; otherwise spring back.
- Dragging past its resting position meets increasing resistance, not a hard stop.
- Capture the pointer on drag start; ignore extra touch points during a drag.
- A dimmed backdrop closes it on tap; Escape closes it; focus is trapped and returns to the trigger.
- With reduced motion, fade instead of slide.

## 8. PDF assets

Source 2 applies to `assets/Lee_T_Resume.pdf` and `assets/publications/*.pdf`, not to page UI.

| Task | Tool |
|---|---|
| Read or set title, author and other metadata; merge, split, rotate | `pypdf` |
| Extract text or tables (for example to check a PDF has a real text layer) | `pdfplumber` |
| Generate a PDF from scratch | `reportlab` |
| Merge, split or decrypt from the command line | `qpdf` |
| Make a scanned PDF searchable | `pytesseract` with `pdf2image` |

For this site: each PDF should have a meaningful document title and author, selectable text, and a descriptive filename (the publications already follow `Author-Year-Title.pdf`). Links to PDFs say they are PDFs. Client-confidential documents never enter the repo (see `.gitignore`).

## 9. Review checklist

Run on every UI change. Report motion findings as one table with **Before / After / Why** columns, one row per issue.

| Look for | Fix |
|---|---|
| `transition: all` | Name the exact properties |
| Entry from `scale(0)` | Start at `scale(0.95)` with `opacity: 0` |
| `ease-in` on UI | `--ease-out` or another §3 curve |
| Popover or tooltip scaling from centre | Scale from the trigger (dialogs exempt) |
| Animation on a keyboard-initiated action | Remove it |
| UI duration over 300 ms (not dialog, drawer, sheet, toast) | Bring down to 150–250 ms |
| Hover style outside the hover media query | Wrap in `(hover: hover) and (pointer: fine)` |
| Keyframes on something retriggered quickly | Use a transition |
| Enter and exit at the same speed | Make the exit faster |
| A group appearing all at once | Stagger 30–80 ms |
| Animating layout properties | Use `transform` / `opacity` |
| Reduced motion removes everything | Keep fades, remove movement |
| Literal colour in a rule | Use a token, with a light-theme value |
| Control with no visible focus, hover or pressed state | Add the missing state (§2 feedback) |
| Works with mouse only | Add keyboard and touch paths (§4) |

Then answer the nine questions in §2, and check the change in both themes, at the 736 px, 980 px and 1280 px breakpoints, and with reduced motion on.
