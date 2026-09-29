# Tokyo Paper for React

React components for the [Tokyo Paper design system](../README.md). They render exactly the markup documented in `src/components/<name>/<name>.html`, and build in the keyboard and focus behavior from `src/demo/behavior.js`. All styling comes from the system's CSS.

Requires React 19 or later.

## Setup

Import the CSS once, at your app root:

```tsx
import "tokyo-paper/css"; // or the path to src/tokyo-paper.css
```

Toasts need a provider near the root:

```tsx
import { ToastProvider } from "@tokyo-paper/react";

<ToastProvider>
  <App />
</ToastProvider>;
```

## Components

| Component | Notes |
| --- | --- |
| `Button`, `ButtonLink` | `variant="ghost" \| "primary" \| "quiet"`, `iconOnly` (give it `aria-label`), `trailingArrow`, `busy` + `busyLabel`. `ButtonLink` is for navigation. |
| `TextField`, `TextArea`, `Select` | `label`, `hint`, `error`, `optional`. Label, hint and error are wired to the control with `aria-describedby` and `aria-invalid`. Native props go to the control; `wrapperClassName` styles the wrapper. |
| `Fieldset`, `Form` | Group controls under a legend; stack fields with the standard gap. |
| `Checkbox`, `Radio`, `Switch` | `label`, `hint`. `Checkbox` supports `indeterminate`. `Switch` is a native checkbox with `role="switch"`. |
| `Card` | `title`, `eyebrow`, `footer`. With `href`, the whole card is clickable but only the title is the link. |
| `Pill` | `tone` colors the dot; the text must say the status. |
| `Stats`, `Stat` | A `<dl>` of key numbers. `highlight` one per group. |
| `Alert` | `tone`, `title`, `actions`, `onDismiss`, `banner`. |
| `useToast()` | `toast({ message, tone, action: { label, onClick } })`. One at a time, at least 6 s, paused while hovered or focused; danger toasts stay until dismissed. |
| `Dialog` | Controlled with `open` / `onClose`. Native `<dialog>`: focus trap, Esc, inert page and focus return come from the browser. `alert` makes a confirmation (`role="alertdialog"`, no close button). Mark the element to focus first with `data-autofocus`. |
| `Menu`, `MenuItem`, `MenuCheckboxItem`, `MenuSeparator`, `MenuLabel` | Pass the trigger as `trigger={<Button>…</Button>}`. Arrow keys, Home/End, typeahead, Tab to close, focus back to the trigger. |
| `Tabs` | `items={[{ value, label, content }]}`; controlled (`value`, `onValueChange`) or not (`defaultValue`). |
| `Nav`, `SkipLink` | Top bar with `links={[{ label, href, current }]}`; links move into a sheet below 900px. |
| `Table`, `SortHeader`, `nextSort` | `Table` needs a `caption` (it names the scroll region). Write `<thead>`/`<tbody>` yourself; sort the rows with `nextSort`. |
| `CodeBlock` | `code` or pre-highlighted children, `title`, `copyable`, `wrap`. |
| `EmptyState`, `Eyebrow` | |

Router links (Next.js, React Router): pass `linkComponent={Link}` to `ButtonLink`, `Card` and `Nav`.

## Example

```tsx
import { useState } from "react";
import { Button, Dialog, TextField, useToast } from "@tokyo-paper/react";

function RenameProject() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename project</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename project"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setOpen(false); toast({ message: "Project renamed." }); }}>
              Save name
            </Button>
          </>
        }
      >
        <TextField label="Project name" defaultValue="Tokyo Paper" data-autofocus />
      </Dialog>
    </>
  );
}
```

## Development

```sh
npm install
npm test          # Vitest + Testing Library in jsdom, including an axe run over every component
npm run typecheck
npm run build     # emits dist/ (ES modules + .d.ts)
```

jsdom doesn't implement `<dialog>` modality or the popover API, so `test/setup.ts` stands in for the parts the components use. Color contrast and real-browser behavior are covered by the checks at the repo root.
