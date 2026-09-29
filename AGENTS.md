# Agent Guide

Instructions for AI agents (and humans) working on the Tokyo Paper Design System.

## Source of truth

- **Design.md is the ultimate source of truth for the design of the system.** Read it before making any design or component change.
- If code and Design.md disagree, Design.md wins. Either fix the code, or — if the design is intentionally changing — update Design.md first.
- Never change a design decision (tokens, principles, component behaviour, interaction rules) in code alone.

## Changing the design

When a change affects the design:

1. Update the relevant section of Design.md.
2. Add an entry to the **Changelog** section at the bottom of Design.md (create it if missing), newest first:

   ```markdown
   ## Changelog

   ### YYYY-MM-DD — Short title
   - **Section:** e.g. 7. Visual Language › Color
   - **Change:** what changed
   - **Reason:** why it changed
   ```

3. Keep README.md in step with Design.md, since README.md expands on the 21 sections Design.md lists.

## Project structure

| Path        | Purpose                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `Design.md` | Design source of truth: structure, decisions, changelog                 |
| `README.md` | Detailed write-up of each of the 21 sections in Design.md               |
| `src/`      | Components in plain HTML5 + CSS                                         |

## Component rules (`src/`)

- **Plain HTML5 and CSS only.** No frameworks, build steps, or runtime dependencies. Any library or framework (React, Vue, Svelte, Tauri, plain pages) must be able to use the components as-is.
- Drive every visual value (color, spacing, type, depth, motion) from design tokens (CSS custom properties). Do not hard-code these values.
- Accessibility is the default, not an add-on: semantic elements, visible focus, keyboard operability, sufficient contrast, and respect for `prefers-reduced-motion` and `prefers-color-scheme`.
- Support mouse, touch, and keyboard, across desktop and mobile widths.

## Inspiration

- The [Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night) VS Code theme is the key reference for the palette. Take inspiration from its colors, but always tune them to meet the contrast rules in Design.md.
