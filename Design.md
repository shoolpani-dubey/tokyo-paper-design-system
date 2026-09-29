Important aspects of a Human-Centric Design System are:

Human-Centric Design System
│
├── 1. Philosophy
├── 2. Human Perception Principles
├── 3. Human Cognitive Principles
├── 4. Motor & Physical Interaction
├── 5. Designing Across Age
├── 6. Accessibility as Default
│
├── 7. Visual Language
│   ├── Surface / Paper
│   ├── Ink
│   ├── Typography
│   ├── Spacing
│   ├── Color
│   ├── Depth
│   └── Icons
│
├── 8. Interaction Language
│   ├── Focus
│   ├── Selection
│   ├── Motion
│   ├── Haptics
│   ├── Sound
│   └── Feedback
│
├── 9. Design Tokens
├── 10. Components
├── 11. Navigation
├── 12. Forms & Input
├── 13. Errors & Recovery
├── 14. Notifications
├── 15. Responsive Behaviour
│
├── 16. Mouse / Touch / Keyboard
├── 17. Desktop / Mobile
├── 18. React + Tauri Architecture
│
├── 19. Age-Diverse User Testing
├── 20. Measurable Acceptance Criteria
└── 21. Design Checklist

Core design decisions (detailed in README.md):

| Decision | Value |
| --- | --- |
| Metaphor | Paper (surfaces) and ink (text, lines, icons) |
| Themes | Night (dark, Tokyo Night–derived) and Paper (light); default follows `prefers-color-scheme` |
| Accent | Single amber accent: `#fbbf24` Night / `#b45309` Paper; primary fill `#fcd34d` |
| Typography | Mono (`JetBrains Mono` → system mono) for headings, labels, UI, data; system sans for long prose |
| Text size | Body 16px; nothing readable below 14px; rem units only |
| Contrast | Body text ≥ 7:1; other text ≥ 4.5:1; control boundaries and focus ≥ 3:1 |
| Shape | Radius 0; 1px hairline rules; 2px radius only for small pills |
| Depth | Surface steps and rules; shadow only for floating layers |
| Spacing | 4px base grid; container max 1320px |
| Targets | 44px minimum; 32px in compact desktop density |
| Focus | 2px solid accent outline, 2px offset |
| Motion | 100–400ms, `cubic-bezier(.22,1,.36,1)`; removed under reduced motion |
| Accessibility | WCAG 2.2 AA baseline, AAA for body contrast and target size |

TODO:
1. ~~Use this format and create a Readme.md where each of these points from 1-21 are detailed.~~ Done: README.md.
2. ~~Use the VS Code Tokyo Night theme as an important source of inspiration for the design system.~~ Done: see "Inspiration: Tokyo Night" in README.md.
3. Under src: You may create components using Plain Html5 and CSS. The idea is that any library or framework should be able to use it. In progress: tokens, theme, base, Button and form controls (text field, select, checkbox, radio, switch) done.

## Changelog

### 2026-09-29 — Form controls
- **Section:** 10. Components, 12. Forms & Input
- **Change:** Added text field, textarea, select, fieldset, checkbox, radio and switch. Checkbox, radio and switch use a 2px border (other lines stay 1px). Switch uses a square track and thumb and shows "On"/"Off" text. Invalid fields get a danger border and a 3px leading bar as well as the error message. All controls fall back to native rendering in forced-colors mode.
- **Reason:** Forms are where the accessibility rules matter most; small controls need a heavier edge to meet 3:1 at a glance.

### 2026-09-29 — Theme mechanism and first component
- **Section:** 9. Design Tokens, 10. Components, 18. React + Tauri Architecture
- **Change:** Color tokens are defined once as `light-dark(Paper, Night)` pairs in `src/theme.css`, replacing the planned one-file-per-theme layout. The theme follows the OS by default; `data-theme="paper|night"` forces one. Added `--accent-fill-line` so the primary button has a visible boundary on Paper (amber fill on light grey is only ~1.3:1). Added Button (ghost default, primary, quiet, icon; disabled, busy; compact density).
- **Reason:** Following the OS setting without JavaScript while keeping one file per theme would mean writing every color twice.

### 2026-09-29 — Define foundations
- **Section:** 1–21 (all); new "Core design decisions" table
- **Change:** Wrote README.md detailing all 21 sections. Set the visual language: Tokyo Night–inspired palette, amber accent, mono type, zero radius, hairline rules, token-per-theme architecture. Set accessibility rules for an age-diverse audience: `--ink-3` at 5.4:1, `--line-strong` ≥ 3:1 for controls, 16px body text, 44px targets, 2px focus ring, proportional font for long prose.
- **Reason:** Establish the foundations every component builds on.

### 2026-09-29 — Add changelog
- **Section:** Design.md
- **Change:** Added this changelog section. From now on, every design change is recorded here, newest first.
- **Reason:** Design.md is the source of truth, so changes to it need to be traceable.
