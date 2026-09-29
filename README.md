# Tokyo Paper Design System

A human-centric design system built from plain HTML5 and CSS. Any framework (React, Vue, Svelte, Tauri, or a static page) can use it without a build step.

Tokyo Paper pairs the quiet precision of a terminal with the calm of printed paper: sharp edges, hairline rules, monospaced labels, one warm accent, and generous, readable type. Its palette is inspired by the [Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night) VS Code theme (see [Inspiration](#inspiration-tokyo-night)), tuned so that it works for people of every age and ability.

> **Source of truth:** [Design.md](Design.md) holds the structure and the design decisions. This README expands on each of its 21 sections. If they disagree, Design.md wins.

## Contents

1. [Philosophy](#1-philosophy)
2. [Human Perception Principles](#2-human-perception-principles)
3. [Human Cognitive Principles](#3-human-cognitive-principles)
4. [Motor & Physical Interaction](#4-motor--physical-interaction)
5. [Designing Across Age](#5-designing-across-age)
6. [Accessibility as Default](#6-accessibility-as-default)
7. [Visual Language](#7-visual-language)
8. [Interaction Language](#8-interaction-language)
9. [Design Tokens](#9-design-tokens)
10. [Components](#10-components)
11. [Navigation](#11-navigation)
12. [Forms & Input](#12-forms--input)
13. [Errors & Recovery](#13-errors--recovery)
14. [Notifications](#14-notifications)
15. [Responsive Behaviour](#15-responsive-behaviour)
16. [Mouse / Touch / Keyboard](#16-mouse--touch--keyboard)
17. [Desktop / Mobile](#17-desktop--mobile)
18. [React + Tauri Architecture](#18-react--tauri-architecture)
19. [Age-Diverse User Testing](#19-age-diverse-user-testing)
20. [Measurable Acceptance Criteria](#20-measurable-acceptance-criteria)
21. [Design Checklist](#21-design-checklist)

---

## 1. Philosophy

**Paper holds, ink speaks.** Interfaces are made of two materials. *Paper* is the quiet surface that holds content. *Ink* is the text, lines and marks that carry meaning. Everything else is used sparingly and on purpose.

Principles:

- **Humans first, screens second.** Design for real bodies: tired eyes, shaky hands, divided attention, and a user aged 8 or 80. Constraints that help the most limited user usually help everyone.
- **Calm by default.** One accent color, flat surfaces, no decorative motion. Attention is a budget; spend it only on what matters now.
- **Precision you can feel.** Sharp corners, 1px rules, aligned grids, and monospaced labels signal a tool that is exact and trustworthy.
- **Fast is a feature.** Interactions respond at once (under 100 ms). Motion confirms; it never makes anyone wait.
- **Framework-agnostic.** HTML semantics and CSS custom properties are the API. Nothing requires JavaScript to look right.
- **Accessible is not a mode.** Accessibility is the baseline every component ships with, not a theme or a toggle.

## 2. Human Perception Principles

How people see, and what the system does about it:

| Principle | What it means | Rule in Tokyo Paper |
| --- | --- | --- |
| **Contrast** | Legibility depends on luminance difference, not hue. | Body text ≥ 7:1; all other text ≥ 4.5:1; control boundaries and focus ≥ 3:1. |
| **Figure–ground** | Users must instantly tell content from background. | Surfaces step in small, even increments (see [Depth](#depth)); content always sits on a distinct surface. |
| **Proximity** | Things close together are read as related. | Spacing inside a group is always smaller than the spacing between groups (e.g. 8px within, 24px between). |
| **Similarity** | Things that look alike are assumed to act alike. | One visual treatment per role: every primary action is amber-filled, every link is underlined. |
| **Pre-attentive color** | A single saturated hue is spotted in under 250 ms. | Amber is reserved for *the* important thing: the primary action, the focus ring, the current location. |
| **Color is never alone** | ~8% of men have a color-vision deficiency. | Status always pairs color with an icon, text, or shape. |
| **Visual hierarchy** | Size and weight are read before color. | Hierarchy comes from the type scale and weight first, ink tier second, color last. |

## 3. Human Cognitive Principles

- **Limit working memory.** Keep choices visible instead of remembered: show labels, current values, and where the user is. Aim for no more than 5–7 primary options per group.
- **Recognition over recall.** Icons always come with a text label (except universal ones like close ×, and those still have an accessible name). Keyboard shortcuts are shown next to the actions they trigger.
- **Progressive disclosure.** Show the common 80% first; tuck advanced options behind a clearly labelled "More options" or a details section.
- **Consistency.** The same word, icon and position mean the same thing everywhere. Primary actions sit in the same place in every dialog.
- **Predictability.** No surprises: nothing moves, opens, or submits unless the user caused it. Changes of context (new window, navigation) are announced in the label ("Opens in new tab").
- **Plain language.** Short sentences, everyday words, active voice. Say "Save changes", not "Persist modifications". Aim for a reading age of about 12.
- **Chunking.** Long forms and flows are split into short, named steps with visible progress ("Step 2 of 4").
- **Forgiveness.** People make mistakes; the system expects them (see [Errors & Recovery](#13-errors--recovery)).

## 4. Motor & Physical Interaction

- **Target size:** every interactive element is at least **44 × 44 px** (`--target-min`). Dense desktop UIs may drop to **32 px** high (`--target-compact`) only when the hit area is padded to 44 px, or items are at least 8 px apart. The WCAG 2.2 AA floor is 24 × 24 px; we never go below it.
- **Spacing between targets:** at least 8 px between adjacent targets, so a slightly off tap does not trigger a neighbor.
- **Fitts's law:** frequently used and primary actions are larger and closer to where the pointer or thumb already is. Destructive actions are *not* placed next to frequent ones.
- **No precision gestures required.** Anything done by drag, pinch, swipe, long-press or hover also has a single-tap/click or keyboard alternative.
- **No timing pressure.** No action requires speed. Timeouts warn the user and can be extended. Double-click is never the only way to do something.
- **Tremor and slips:** actions fire on *release* (pointer up), not press, so users can slide off to cancel. Destructive actions need confirmation or offer undo.
- **Reach:** on phones, primary actions sit in the lower, thumb-reachable half of the screen.

## 5. Designing Across Age

Tokyo Paper is tested against four broad age groups. The goal is one interface that works for all of them, not separate "senior" or "kids" modes.

| Group | Common needs | How the system responds |
| --- | --- | --- |
| **Children (8–12)** | Still-developing reading; exploratory clicking. | Plain words, icons with labels, forgiving undo, no dark patterns. |
| **Teens & young adults (13–30)** | Speed, density, keyboard shortcuts. | Compact density option, visible shortcuts, fast motion. |
| **Adults (30–60)** | Divided attention, interruptions, presbyopia from ~40. | Clear hierarchy, saved state, 16 px minimum body text. |
| **Older adults (60+)** | Lower contrast sensitivity, reduced fine motor control, slower processing, less familiarity with hidden gestures. | High-contrast ink, 44 px targets, no hover-only or gesture-only features, no time limits, text that scales to 200%. |

Rules that follow:

- Body text is **never smaller than 16 px**, and no readable text is smaller than **14 px**.
- Every layout must survive **200% text zoom** and a user font size of 24 px without clipping or overlap.
- Controls look like controls: buttons have visible boundaries, links are underlined, inputs have a visible border.
- Avoid unfamiliar jargon and trendy iconography whose meaning needs to be learned.

## 6. Accessibility as Default

Target: **WCAG 2.2 AA** everywhere, **AAA** for body text contrast and target size.

- **Semantic HTML first.** Use `<button>`, `<a>`, `<nav>`, `<main>`, `<label>`, `<fieldset>`, `<dialog>` before reaching for ARIA. ARIA fills gaps; it does not replace elements.
- **Keyboard:** everything works with the keyboard alone, in a logical order, with a visible focus ring (see [Focus](#focus)). No keyboard traps.
- **Screen readers:** every control has an accessible name; decorative icons use `aria-hidden="true"`; dynamic updates use polite live regions.
- **User preferences are respected:**
  - `prefers-color-scheme` picks the Paper (light) or Night (dark) theme by default.
  - `prefers-reduced-motion` removes all non-essential motion.
  - `prefers-contrast: more` switches decorative lines to control-strength lines and removes translucent surfaces.
  - `forced-colors: active` (Windows High Contrast) is supported: borders and focus rings use system colors and never disappear.
- **Language:** `lang` is set on `<html>`, and on any element in another language.
- **No information by color alone**, no auto-playing media, no flashing more than three times per second.

## 7. Visual Language

### Surface / Paper

Surfaces are flat, sharp-cornered sheets. Hierarchy comes from small luminance steps and 1px rules, not shadows or rounded cards.

| Token | Role |
| --- | --- |
| `--paper` | Page background: the desk everything sits on. |
| `--paper-raised` | Panels, sidebars, cards, headers. |
| `--paper-float` | Floating layers: menus, popovers, dialogs, toasts. |
| `--paper-hover` | Hover/pressed tint for rows and quiet controls. |
| `--paper-grid` | Optional graph-paper texture (1px lines every 32 px) for hero and empty states. |

Radius is **0** by default (`--radius: 0`). Only tiny marks (status dots, pills in dense data) may use `--radius-sm: 2px`; circles are allowed for dots and avatars.

### Ink

Ink is anything that carries meaning: text, lines, icons.

| Token | Use | Min. contrast |
| --- | --- | --- |
| `--ink` | Primary text, headings, values. | 7:1 |
| `--ink-2` | Secondary text, descriptions, inactive tabs. | 7:1 |
| `--ink-3` | Tertiary text: meta labels, timestamps, hints. | 4.5:1 |
| `--ink-faint` | Decorative only (disabled dividers, watermarks). **Never for text that must be read.** | — |
| `--line` | Decorative dividers between regions. | — |
| `--line-strong` | Boundaries of controls (inputs, ghost buttons, checkboxes). | 3:1 |

### Typography

Two families, each with a clear job:

- **`--font-mono`**: the system's voice. Headings, labels, navigation, buttons, numbers, data and code. Stack: `"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace`, with slashed zero (`font-feature-settings: "zero" 1`) and ligatures off, so characters are never ambiguous.
- **`--font-text`**: running prose longer than a couple of lines. Stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`. Proportional text is faster to read at length, especially for older and dyslexic readers. Set `--font-text: var(--font-mono)` for a fully monospaced look.

Web fonts are optional: every stack falls back to fonts already on the system, so components never depend on a CDN.

**Type scale** (rem, 1rem = 16 px by default; always use rem so user font settings are honored):

| Token | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- |
| `--text-xs` | 0.875rem (14 px) | 1.5 | 500 | Meta labels, captions. The floor. |
| `--text-sm` | 0.9375rem (15 px) | 1.5 | 400 | Dense UI, table cells. |
| `--text-md` | 1rem (16 px) | 1.6 | 400 | Body text, inputs, buttons. |
| `--text-lg` | 1.25rem (20 px) | 1.4 | 500 | Lead paragraphs, card titles. |
| `--text-xl` | 1.5rem (24 px) | 1.25 | 600 | H3. |
| `--text-2xl` | clamp(1.75rem, 3.4vw, 2.625rem) | 1.1 | 700 | H2, section titles. |
| `--text-display` | clamp(2.625rem, 6.6vw, 5.75rem) | 0.98 | 800 | H1, hero. |

Rules:

- Headings use tight tracking (`-0.04em` for display, `-0.02em` for H2) because large mono type looks loose otherwise.
- **Eyebrow labels** (`.tp-eyebrow`: small uppercase mono above a heading, e.g. `SECTION · 02`) use `--text-xs`, uppercase, `letter-spacing: 0.12em`, `--ink-3`. Never use uppercase for more than a few words.
- Line length for prose: 45–75 characters (`max-width: 68ch`).
- An optional blinking block cursor (▌ in `--accent`) may end a hero heading. It stops blinking under reduced motion.

### Spacing

A 4 px base grid. Use tokens, never arbitrary values.

| Token | Value | Typical use |
| --- | --- | --- |
| `--space-1` | 4 px | Icon-to-text in dense items |
| `--space-2` | 8 px | Gap inside a group; between adjacent targets |
| `--space-3` | 12 px | Control padding (vertical) |
| `--space-4` | 16 px | Control padding (horizontal); gap between fields |
| `--space-5` | 24 px | Gap between groups; page gutter on mobile |
| `--space-6` | 32 px | Panel padding |
| `--space-7` | 48 px | Between sections on mobile |
| `--space-8` | 64 px | Between sections on desktop |
| `--space-9` | 96 px | Hero breathing room |

Page content sits in a container of max `1320px` with `--space-5` (24 px) side gutters, 16 px on phones.

### Color

One accent, a small set of status colors, and neutral ink/paper. There are two themes: **Night** (dark, derived from the Tokyo Night palette) and **Paper** (light).

| Role | Token | Night | Paper | Notes |
| --- | --- | --- | --- | --- |
| Page | `--paper` | `#06070b` | `#f4f5f8` | |
| Raised | `--paper-raised` | `#0b0c12` | `#ffffff` | |
| Float | `--paper-float` | `#11131c` | `#ffffff` | Paper floats rely on a shadow |
| Ink | `--ink` | `#e4e8f7` | `#0b0d14` | 16.5:1 / 17.8:1 |
| Ink 2 | `--ink-2` | `#9ba3c4` | `#454c5e` | 8.1:1 / 7.9:1 |
| Ink 3 | `--ink-3` | `#7a82a8` | `#626a7d` | 5.4:1 / 5.0:1 |
| Line | `--line` | `#c0caf517` | `#0b0d141a` | Decorative only |
| Line strong | `--line-strong` | `#626a94` | `#7b8295` | 3.8:1 / 3.5:1 |
| **Accent** | `--accent` | `#fbbf24` | `#b45309` | Amber. Focus, current, highlights |
| Accent fill | `--accent-fill` | `#fcd34d` | `#fcd34d` | Primary button background |
| Accent fill line | `--accent-fill-line` | `#fcd34d` | `#b45309` | Primary button border; makes the fill visible on Paper |
| On accent | `--on-accent` | `#0b0a06` | `#0b0a06` | 13.7:1 on the fill |
| Accent wash | `--accent-wash` | `#fbbf2412` | `#b453090f` | Hover tint for ghost controls |
| Info | `--info` | `#7aa2f7` | `#0969da` | |
| Success | `--success` | `#9ece6a` | `#116329` | |
| Warning | `--warning` | `#ff9e64` | `#953800` | |
| Danger | `--danger` | `#f7768e` | `#cf222e` | |

Usage rules:

- Amber marks **one** thing per view as most important. If everything is amber, nothing is.
- Status colors always come with an icon and text.
- Text selection uses `--accent-fill` with `--on-accent`.

### Depth

Depth is expressed with **surfaces and rules, not shadows**:

1. `--paper` → `--paper-raised` → `--paper-float` is the only elevation ladder.
2. Borders (`--line`) separate regions at the same level.
3. Shadows are reserved for **floating layers** (menus, dialogs, toasts) that cover other content: `--shadow-float` is a single soft, long shadow (`0 60px 140px -60px #000000f2` on Night; `0 50px 100px -50px #0b0d1459` on Paper).
4. A dialog's backdrop dims the page (`#06070bb3`) so the float layer is unmistakable.

### Icons

- Line icons, 1.5 px stroke, square caps, drawn on a 16 px or 20 px grid, matching the sharp geometry of the type.
- Icons inherit `currentColor` and sit at `1em` or `1.25em` next to text.
- Every meaningful icon has a text label or accessible name; decorative ones get `aria-hidden="true"`.
- Status dots (6 px circles in a status color) may mark live or new items, always next to text.
- Icons ship as inline SVG, so no icon font or library is required.

## 8. Interaction Language

### Focus

- `:focus-visible` shows a **2 px solid `--accent` outline with 2 px offset**, on every focusable element, in every theme.
- Focus is never removed with `outline: none` unless it is replaced by something at least as visible.
- When a dialog or menu opens, focus moves into it; when it closes, focus returns to the element that opened it.
- In forced-colors mode the outline uses the system `Highlight` color.

### Selection

- Selected rows or items: `--paper-hover` background **plus** a 2 px `--accent` bar on the leading edge, so selection doesn't depend on a subtle tint.
- Checked controls (checkbox, radio, switch) use the accent fill with a check or dot shape: shape plus color.
- Multi-select shows a count ("3 selected") and a clear way to deselect all.

### Motion

Motion is quick, small, and meaningful. It confirms a cause and effect; it never decorates.

| Token | Value | Use |
| --- | --- | --- |
| `--dur-instant` | 100 ms | Color and border changes on hover/press |
| `--dur-fast` | 150 ms | Hover lift, arrow nudge, toggles |
| `--dur-base` | 200 ms | Fades, menus opening |
| `--dur-slow` | 400 ms | Dialogs, panels entering |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Things entering or responding |
| `--ease-in` | `cubic-bezier(.64, 0, .78, 0)` | Things leaving |

Signature micro-interactions:

- **Lift:** interactive cards and pills rise 1 px (`translateY(-1px)`) on hover.
- **Nudge:** trailing arrows (→) move 2 px in their direction on hover.
- **Settle:** floating layers enter from 12 px below at 97.5% scale, and settle into place.

Under `prefers-reduced-motion: reduce`, transforms and animations are removed; color changes remain, and marquees become static and scrollable.

### Haptics

- Web: haptics are **opt-in** and only for confirming a completed action (e.g. a short 10 ms pulse on successful save) via `navigator.vibrate`, where supported.
- Tauri mobile: use the native haptics plugin with the platform's light-impact style.
- Never use haptics for errors alone, as notifications, or repeatedly. Honor the OS setting that disables haptics.

### Sound

- **Silent by default.** Sound is opt-in in settings.
- If enabled, sounds are short (< 200 ms), soft, and only confirm user-initiated actions or signal something needing attention.
- Sound never carries information that isn't also shown on screen.

### Feedback

Every action gets a response within **100 ms**:

| Wait | Feedback |
| --- | --- |
| < 100 ms | State change only (pressed, checked). |
| 100 ms – 1 s | Busy state on the control (spinner or "Saving…"); control is disabled to prevent repeats. |
| 1 – 10 s | Progress indicator with a label; can be cancelled. |
| > 10 s | Determinate progress, estimated time, and the user can keep working elsewhere. |

Success is confirmed where the action happened (inline), not only in a distant toast.

## 9. Design Tokens

Tokens are CSS custom properties: the single public API of the system. Components read tokens; they never contain literal colors, sizes or durations.

**Three layers:**

1. **Scale tokens** in `src/tokens.css`: type, space, shape, size and motion (`--space-4`, `--text-md`, `--dur-fast`).
2. **Color tokens** in `src/theme.css`: semantic roles (`--accent`, `--ink-2`, `--paper-raised`), each defined once for both themes.
3. **Component tokens:** private variables inside a component, prefixed `--_` (e.g. `--_bg` in Button). Variants and states change these instead of restating properties.

**Theming:**

- Each color token is a pair written once with CSS `light-dark()`: `--ink: light-dark(#0b0d14, #e4e8f7)` (Paper, Night). This keeps both themes side by side, with no duplication.
- The active theme comes from `color-scheme`. By default it's `light dark`, so the theme follows the OS (`prefers-color-scheme`) with no JavaScript.
- To force a theme, set `data-theme="paper"` or `data-theme="night"` on `<html>`. Apps may persist the choice.
- Extra themes (e.g. a high-contrast theme) override the color tokens in a `:root[data-theme="…"]` rule. The `:root[...]` selector outranks the defaults regardless of stylesheet order.
- Browser baseline for `light-dark()`: Chrome/Edge 123, Safari 17.5, Firefox 120. This covers current Tauri webviews (WebView2, WKWebView, WebKitGTK 2.44+).

**Naming:** `--{category}-{role}-{variant}`, e.g. `--ink-2`, `--paper-raised`, `--accent-wash`, `--space-4`, `--dur-fast`.

## 10. Components

Each component is a documented HTML structure plus a CSS file. State is expressed with native attributes and ARIA (`disabled`, `aria-expanded`, `aria-invalid`, `aria-current`) rather than custom classes, so styling and accessibility stay in sync.

Initial component set:

| Component | Notes |
| --- | --- |
| **Button** | `primary` (amber fill), `ghost` (strong line, amber wash on hover), `quiet` (text only). Height 44 px (32 px compact). Mono, weight 600. Busy and disabled states. |
| **Link** | Underlined always; `--accent` on hover; external links labelled. |
| **Text field / Textarea** | `.tp-field` with label, hint, control, error, in that order. `--line-strong` border; accent border and focus ring on focus. Invalid: `aria-invalid="true"` gives a danger border and leading bar, plus an error message with icon. Read-only fields use a dashed border. |
| **Select** | Native `<select>` with a theme-colored chevron; falls back to the native control in forced-colors mode. |
| **Checkbox / Radio** | Native inputs with a 2 px border (small controls need a heavier edge). Checked = amber fill plus a check, dot or dash. The whole row is a 44 px target. Radio stays round, because the shape is familiar. |
| **Switch** | Native checkbox with `role="switch"`, so no JavaScript is needed. Square track and thumb; state shown by position, fill and "On"/"Off" text. Use for settings that apply immediately. |
| **Card / Panel** | `--paper-raised`, 1 px `--line`, square corners, optional eyebrow label. A `.tp-card__link` in the title makes the whole card clickable (strong border, 1 px lift on hover, focus ring on the card) while the title stays the accessible name. |
| **Pill / Tag** | Mono `--text-xs`, 1 px `--line-strong` border, `--radius-sm`, optional status dot. The tone colors only the dot; the text always names the status. |
| **Stat** | A `<dl>` of cells separated by 1 px rules. Uppercase eyebrow key, large tight-tracked value with tabular figures, optional unit in `--ink-3`. `.tp-stat--highlight` puts one value in amber. |
| **Tabs** | Mono labels; selected tab marked by ink color, a 2 px accent bar and `aria-selected`. Arrow keys and Home/End move and select; only the selected tab is in the Tab order. Scrolls sideways when tabs don't fit. |
| **Dialog** | Native `<dialog>` opened with `showModal()`: the browser traps focus, closes on Esc and returns focus. `--paper-float`, float shadow, dimmed backdrop, page scroll locked. Primary action last; `autofocus` on the safest action. Bottom sheet on phones. |
| **Menu / Popover** | Uses the `popover` attribute, so it opens and closes without JavaScript. Anchored to its trigger with CSS anchor positioning (centered where unsupported). Items are 44 px; supports icons, shortcuts, check items, groups and a danger item. Arrow keys, Home/End and typeahead move between items. |
| **Inline alert / Banner** | Tinted surface, 3 px leading bar and icon in the tone color (info, success, warning, danger), mono title, optional actions and dismiss. The banner variant spans its container. See [Notifications](#14-notifications). |
| **Toast** | Float surface and shadow in a fixed `role="status"` region (bottom right; full width on phones). Enters with the "settle" motion. Timing and queueing are app behavior; see [Notifications](#14-notifications). |
| **Keycap** | `<kbd>` for shortcuts: mono, 1 px `--line-strong`, `--paper-raised`. |
| **Code block** | Mono, `--paper-raised`, Tokyo Night syntax colors, copy button. |
| **Table** | Sticky mono header, hairline rows, numeric columns right-aligned with tabular figures. |
| **Empty state** | Graph-paper surface, plain explanation, one primary action. |

Every component doc lists: anatomy, states (default, hover, focus, active, disabled, busy, error), keyboard behavior, accessibility notes, and do/don't examples.

## 11. Navigation

- **Where am I?** The current page or section is marked with `aria-current="page"`, an accent bar, and `--ink` text. It is never shown by color alone.
- **Top bar:** sticky, 64 px high, translucent `--paper` with backdrop blur, 1 px bottom `--line`. Contains brand, primary sections (≤ 6), search, and theme toggle.
- **Skip link:** the first focusable element is "Skip to content".
- **Breadcrumbs** for hierarchies deeper than two levels.
- **Search:** opens with `/` or `Ctrl/⌘ + K`, shows recent items, and is fully keyboard-driven.
- **Mobile:** primary sections collapse into a menu button labelled "Menu" (not just ☰). The menu is a full-height sheet with large targets.
- **Back always works.** In-app navigation updates the URL/history; state survives a refresh.
- Anchor jumps account for the sticky header (`scroll-padding-top: 64px`).

## 12. Forms & Input

- **Labels are always visible**, above the field. Placeholders are examples, never labels.
- **One column.** Fields stack vertically in the order people think about them.
- **Say what's needed up front:** format hints ("DD/MM/YYYY") sit under the label, before any error. Mark optional fields "(optional)" rather than required fields with an asterisk.
- **Right input for the job:** correct `type`, `inputmode` and `autocomplete` attributes, so phones show the right keyboard and browsers can autofill.
- **Be liberal in what you accept:** allow spaces in card numbers, any phone format, pasted text.
- **Validate on blur or submit**, never on every keystroke. Keep the user's input when showing an error.
- **Group related fields** with `<fieldset>` and `<legend>`.
- **Primary action last**, left-aligned under the fields, labelled with the verb ("Create account", not "Submit").
- Fields are 44 px high, 16 px text (which also stops iOS zooming in on focus).

## 13. Errors & Recovery

**Prevent first, then recover.**

- **Prevent:** constrain inputs, confirm destructive actions, disable actions that can't succeed and explain why.
- **Undo over confirm:** for reversible actions (delete, archive, move), act immediately and offer "Undo" for at least 10 seconds. Reserve confirmation dialogs for truly irreversible actions, and name the consequence ("Delete 3 files permanently").
- **Error messages** say what happened, why, and how to fix it, in plain language, without blame:
  - ✗ "Invalid input"
  - ✓ "Enter a date in the format DD/MM/YYYY, for example 29/09/2026"
- **Where errors appear:**
  - Field errors: under the field, in `--danger` with an icon, linked via `aria-describedby`, and the field gets `aria-invalid="true"`.
  - Form errors: a summary at the top listing each error as a link to its field; focus moves to the summary.
  - System errors: an inline banner with a retry action.
- **Never lose work.** Drafts are preserved on error, navigation away, or a lost connection. Offline states say what still works.

## 14. Notifications

Match urgency to interruption:

| Type | Use for | Behavior |
| --- | --- | --- |
| **Inline message** | Feedback about something on screen. | Appears next to the cause. Preferred default. |
| **Banner** | Page- or app-wide status (offline, maintenance). | Top of content, stays until resolved or dismissed. |
| **Toast** | Brief confirmation of an action done elsewhere ("Saved"). | Bottom corner, `role="status"`, stays **at least 6 s** and pauses on hover/focus; includes Undo when relevant. Never the only place important info appears. |
| **Dialog** | Something that needs a decision before continuing. | Rare. Modal, focus-trapped. |
| **System notification** (Tauri/OS) | Events while the app is in the background. | Opt-in, grouped, respects Do Not Disturb. |

Rules: no more than one toast visible at a time (queue the rest); errors never auto-dismiss; every notification has a text label and icon, not only color.

## 15. Responsive Behaviour

Content-first, fluid layout with a few breakpoints:

| Name | Width | Layout |
| --- | --- | --- |
| **Phone** | < 640 px | Single column, 16 px gutters, stacked navigation, full-width buttons in forms. |
| **Tablet** | 640 – 899 px | Two columns where content allows; 24 px gutters. |
| **Laptop** | 900 – 1319 px | Full navigation, side panels visible. |
| **Desktop** | ≥ 1320 px | Content container capped at 1320 px, centered. |

- Type scales fluidly with `clamp()` between breakpoints; body text never shrinks below 16 px.
- Grid layouts use `minmax(0, 1fr)` and `repeat(auto-fit, minmax(…))` so they reflow without breakpoints where possible.
- Nothing scrolls horizontally at 320 px wide (WCAG reflow), except code blocks and data tables, which scroll inside their own container.
- Container queries are preferred for components, so they adapt to their slot, not just the viewport.

## 16. Mouse / Touch / Keyboard

Design for all three, and never assume which one is in use.

| | Mouse | Touch | Keyboard |
| --- | --- | --- | --- |
| **Hover** | Lift, tint, tooltip preview | Not available: never hide essentials behind hover | Focus shows the same info as hover |
| **Primary action** | Click (on release) | Tap (on release) | Enter / Space |
| **Secondary** | Right-click menu *plus* a visible "More" button | Long-press *plus* a visible "More" button | Shift+F10 / Menu key |
| **Targets** | ≥ 32 px compact | ≥ 44 px | — |
| **Dismiss** | Click outside, close button | Tap outside, close button | Esc |

- Use `@media (hover: hover)` for hover-only styling and `@media (pointer: coarse)` to enlarge targets.
- Shortcuts are single, discoverable, and shown in menus and tooltips with `<kbd>`. Use `⌘` on macOS and `Ctrl` elsewhere. Single-key shortcuts (like `/`) can be turned off (WCAG 2.1.4).
- Common keys behave as expected: Tab/Shift+Tab move focus, arrows move within composite widgets, Home/End jump, Esc closes.

## 17. Desktop / Mobile

**Desktop**

- Denser layouts are allowed via a `data-density="compact"` attribute (32 px controls, 15 px table text), never by default.
- Multi-pane layouts (sidebar, content, inspector) with resizable, keyboard-adjustable dividers.
- Right-click menus, drag-and-drop, and shortcuts are enhancements with visible alternatives.

**Mobile**

- Comfortable density only: 44 px targets, 16 px text.
- Primary actions in the thumb zone; bottom sheets over modals.
- Respect safe areas (`env(safe-area-inset-*)`) and the on-screen keyboard; inputs scroll into view on focus.
- Support both orientations; don't lock rotation.
- Forms use the correct `inputmode`/`autocomplete` to cut typing.

## 18. React + Tauri Architecture

The system is plain HTML and CSS at its core; React and Tauri are consumers, not dependencies.

```text
tokyo-paper-design-system/
├── src/
│   ├── tokens.css           # Scale tokens: type, space, shape, size, motion
│   ├── theme.css            # Color tokens: light-dark(Paper, Night) pairs
│   ├── base.css             # Reset, typography, focus, selection, preferences
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.css   # Styles
│   │   │   └── button.html  # Reference page: markup, variants, states
│   │   ├── field/           # Text input, textarea, select, fieldset
│   │   ├── choice/          # Checkbox, radio
│   │   ├── switch/
│   │   ├── card/  pill/  stat/
│   │   ├── alert/ toast/    # Alert includes the banner variant
│   │   ├── dialog/  menu/
│   │   └── nav/  tabs/      # Nav includes the skip link
│   ├── demo/                # Reference pages only: layout, theme switcher, behavior.js
│   ├── index.html           # Links to every reference page
│   └── tokyo-paper.css      # Imports everything above, in order
└── Design.md / README.md
```

**Layering (load order):** `tokens.css` → `theme.css` → `base.css` → `components/<name>/<name>.css`, each imported into a sub-layer of `@layer tokyo-paper`. App styles outside the layer always win, so apps override without `!important`. Component classes are prefixed `tp-` (`.tp-button`, `.tp-button--primary`).

**Using it in plain HTML:**

```html
<link rel="stylesheet" href="src/tokyo-paper.css">
<button class="tp-button tp-button--primary" type="button">Save changes</button>
```

**Using it in React:**

- Import `tokyo-paper.css` once at the app root.
- Wrap components as thin React components that render the **same markup and classes** documented in `src/components/<name>/<name>.html`, and reproduce the keyboard and focus behavior shown in `src/demo/behavior.js`. No CSS-in-JS and no styling logic in React.
- React owns state and behavior; the design system owns appearance. State reaches CSS through attributes (`aria-expanded`, `data-state`).
- Theme switching sets `document.documentElement.dataset.theme`.

**Using it in Tauri:**

- Bundle fonts locally: no CDN requests, so the app works offline and passes a strict Content Security Policy.
- The webview's `prefers-color-scheme` and `prefers-reduced-motion` follow the OS, so the system responds to OS settings automatically.
- Keyboard shortcuts respect platform conventions and do not collide with OS or webview shortcuts.
- Use native menus, notifications and haptics through Tauri plugins; keep in-app equivalents for accessibility.
- Test with each platform's webview (WebKit on macOS/Linux, WebView2 on Windows), since rendering differs slightly.

## 19. Age-Diverse User Testing

Every significant component or flow is tested with real people across ages before it's considered stable.

**Panel:** at least **5 participants per age group** (8–12, 13–30, 30–60, 60+), including people who use assistive technology (screen reader, zoom, switch access, voice control) and people with low digital confidence.

**Method:**

1. Task-based sessions ("Change your email address"), think-aloud, on the participant's own device where possible.
2. Test in both themes, at 200% zoom, with the keyboard only, and on a phone.
3. Record completion, time on task, errors, and help requests.
4. Follow each session with a short confidence rating (1–5) and the System Usability Scale (SUS).

**Success thresholds** (per age group, not averaged across groups):

- Task completion ≥ 90%.
- SUS ≥ 70.
- No task takes an older-adult participant more than 2× the median time of the fastest group.
- Zero critical accessibility blockers.

Findings that change the design are recorded in the Design.md changelog.

## 20. Measurable Acceptance Criteria

A component or page is **done** only when all of these pass:

| Area | Criterion | How to check |
| --- | --- | --- |
| Contrast | Body text ≥ 7:1; other text ≥ 4.5:1; UI boundaries and focus ≥ 3:1, in both themes | Contrast checker on every token pair |
| Text size | Body ≥ 16 px; no readable text < 14 px | Computed styles |
| Zoom | Usable at 200% zoom and 400% reflow (320 px), no overlap or loss | Browser zoom |
| Text spacing | Survives WCAG 1.4.12 overrides (line height 1.5, letter spacing 0.12em, etc.) | Text-spacing bookmarklet |
| Targets | Interactive targets ≥ 44 × 44 px (compact ≥ 32 px with padding) | DevTools measurement |
| Keyboard | Every function reachable and operable; logical order; no traps | Keyboard-only walk-through |
| Focus | Visible 2 px focus ring on every focusable element | Tab through |
| Screen reader | Correct names, roles, states; changes announced | VoiceOver + NVDA |
| Motion | No non-essential motion with reduced motion on; nothing flashes > 3/s | OS setting |
| Forced colors | Controls and focus remain visible in Windows High Contrast | Forced-colors emulation |
| Responsiveness | Response to input < 100 ms; no layout shift (CLS < 0.1) | Performance panel |
| Automation | Zero violations in axe-core | axe DevTools / CI |
| Tokens | No literal colors, sizes or durations in component CSS | Lint rule |
| Framework-agnostic | Works as plain HTML without JavaScript for appearance | Open the `.html` reference file |

## 21. Design Checklist

Use before shipping any component, screen or change.

**Purpose & content**
- [ ] The main task on this screen is obvious within 5 seconds.
- [ ] Labels use plain, familiar words; actions are verbs.
- [ ] Amber is used for one most-important thing only.

**Perception**
- [ ] All contrast minimums pass in Night and Paper themes.
- [ ] No information is conveyed by color alone.
- [ ] Hierarchy is clear from size and weight, even in grayscale.

**Interaction**
- [ ] Targets are ≥ 44 px (or compact rules are met).
- [ ] Works with mouse, touch, and keyboard alone.
- [ ] Focus is visible, logical, and returns correctly after dialogs.
- [ ] No hover-only, gesture-only, or time-limited features.

**Feedback & errors**
- [ ] Every action responds within 100 ms.
- [ ] Errors explain how to fix them, and input is preserved.
- [ ] Destructive actions can be undone or are clearly confirmed.

**Adaptability**
- [ ] Works at 320 px wide and 200% zoom.
- [ ] Respects reduced motion, color scheme, contrast and forced-colors preferences.
- [ ] Uses tokens only; no hard-coded values.

**Verification**
- [ ] Acceptance criteria in section 20 pass.
- [ ] Tested with at least one participant aged 60+ and one using assistive technology.
- [ ] Design.md is updated, with a changelog entry, if any design decision changed.

---

## Inspiration: Tokyo Night

Tokyo Paper's palette is inspired by [Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night), the VS Code theme by enkia ([source](https://github.com/enkia/tokyo-night-vscode-theme)).

**Taken from Tokyo Night:**

- The blue-grey ink tint (`#c0caf5` family), which gives Night its cool, calm character.
- The status colors: blue `#7aa2f7` (info), green `#9ece6a` (success), orange `#ff9e64` (warning), red `#f7768e` (danger), plus cyan `#7dcfff` and violet `#bb9af7` for syntax and data.

**Where Tokyo Paper differs:**

| Tokyo Night | Tokyo Paper | Why |
| --- | --- | --- |
| Editor background `#1a1b26` | Night page `#06070b` | A deeper page gives more room for surface steps and higher text contrast |
| Yellow `#e0af68` | Amber `#fbbf24` / `#b45309` as the single accent | A brighter, warmer accent that stands out pre-attentively |
| Comment tone `#565f89` used for faint text | `--ink-3` at 5.4:1 | Faint text must still meet WCAG AA |
| Dark-first | Paper (light) and Night (dark) as equals, following the OS | People with astigmatism or in bright rooms often read better on light |

## License

[Apache 2.0](LICENSE)
