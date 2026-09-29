import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Alert,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  CodeBlock,
  Dialog,
  Menu,
  MenuCheckboxItem,
  MenuItem,
  Nav,
  Pill,
  SortHeader,
  Stat,
  Stats,
  Switch,
  Table,
  Tabs,
  TextField,
  ToastProvider,
  nextSort,
  useToast,
} from "../src";

describe("Button", () => {
  it("renders the documented classes", () => {
    render(<Button variant="primary" trailingArrow>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("tp-button", "tp-button--primary");
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector(".tp-button__arrow")).toHaveAttribute("aria-hidden", "true");
  });

  it("stays focusable but ignores clicks while busy", async () => {
    const onClick = vi.fn();
    render(<Button busy busyLabel="Saving…" onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Saving…" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-state", "busy");
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders links with a custom link component", () => {
    const RouterLink = (props: object) => <a data-router {...props} />;
    render(<ButtonLink href="/start" linkComponent={RouterLink}>Start</ButtonLink>);
    expect(screen.getByRole("link", { name: "Start" })).toHaveAttribute("data-router");
  });
});

describe("TextField", () => {
  it("links the label, hint and error to the input", () => {
    render(<TextField label="Date of birth" hint="DD/MM/YYYY" error="Enter a real date" />);
    const input = screen.getByLabelText("Date of birth");
    expect(input).toHaveClass("tp-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("DD/MM/YYYY Enter a real date");
  });

  it("marks optional fields in the label", () => {
    render(<TextField label="Phone" optional />);
    expect(screen.getByLabelText("Phone (optional)")).not.toHaveAttribute("aria-invalid");
  });
});

describe("Choice controls", () => {
  it("sets indeterminate on the checkbox", () => {
    render(<Checkbox label="Some channels" indeterminate />);
    expect((screen.getByLabelText("Some channels") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("renders a switch with On/Off state text", () => {
    render(<Switch label="Reduce motion" />);
    const control = screen.getByRole("switch", { name: /Reduce motion/ });
    expect(control).toHaveClass("tp-switch");
    expect(document.querySelector(".tp-switch__state")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Content", () => {
  it("makes only the card title the link", () => {
    render(<Card title="Getting started" href="/guide">Long description that should not be in the link name.</Card>);
    expect(screen.getByRole("link", { name: "Getting started" })).toHaveClass("tp-card__link");
  });

  it("gives toned pills a dot", () => {
    render(<Pill tone="danger">Failed</Pill>);
    const pill = screen.getByText("Failed");
    expect(pill).toHaveClass("tp-pill", "tp-pill--danger");
    expect(pill.querySelector(".tp-pill__dot")).toBeInTheDocument();
  });

  it("renders stats as a description list", () => {
    render(<Stats><Stat label="Response time" value="42" unit="ms" highlight /></Stats>);
    expect(screen.getByRole("term")).toHaveTextContent("Response time");
    expect(screen.getByRole("definition")).toHaveTextContent("42ms");
  });
});

describe("Alert", () => {
  it("shows a tone class and calls onDismiss", async () => {
    const onDismiss = vi.fn();
    render(<Alert tone="warning" title="Storage almost full" onDismiss={onDismiss}>92% used</Alert>);
    expect(screen.getByText("Storage almost full").closest(".tp-alert")).toHaveClass("tp-alert--warning");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe("Toast", () => {
  function Trigger({ tone }: { tone?: "danger" }) {
    const toast = useToast();
    return <button onClick={() => toast({ message: "Saved", tone })}>Go</button>;
  }

  it("announces in a status region and dismisses after 6 seconds", () => {
    vi.useFakeTimers();
    render(<ToastProvider><Trigger /></ToastProvider>);
    act(() => screen.getByText("Go").click());
    expect(within(screen.getByRole("status")).getByText("Saved")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5900));
    expect(screen.queryByText("Saved")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("never auto-dismisses danger toasts", () => {
    vi.useFakeTimers();
    render(<ToastProvider><Trigger tone="danger" /></ToastProvider>);
    act(() => screen.getByText("Go").click());
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("throws a clear error outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow("useToast must be used inside <ToastProvider>.");
  });
});

describe("Dialog", () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Rename</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Rename project" footer={<Button onClick={() => setOpen(false)}>Cancel</Button>}>
          Body
        </Dialog>
      </>
    );
  }

  it("opens with showModal and closes from the close button", async () => {
    render(<Example />);
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(false);
    await userEvent.click(screen.getByRole("button", { name: "Rename" }));
    expect(dialog.open).toBe(true);
    expect(screen.getByRole("dialog", { name: "Rename project" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dialog.open).toBe(false);
  });

  it("focuses the element marked data-autofocus on open", async () => {
    function Focus() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open</Button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Rename project">
            <TextField label="Project name" data-autofocus />
          </Dialog>
        </>
      );
    }
    render(<Focus />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByLabelText("Project name")).toHaveFocus();
  });

  it("uses alertdialog without a close button for confirmations", () => {
    render(<Dialog open onClose={() => {}} alert title="Delete 3 files?">Can't be undone.</Dialog>);
    expect(screen.getByRole("alertdialog", { name: "Delete 3 files?" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});

describe("Menu", () => {
  function Example({ onRename }: { onRename: () => void }) {
    const [hidden, setHidden] = useState(false);
    return (
      <Menu label="File options" trigger={<Button>File options</Button>}>
        <MenuItem onSelect={onRename}>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem disabled>Move</MenuItem>
        <MenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>Show hidden files</MenuCheckboxItem>
      </Menu>
    );
  }

  it("focuses the first item, moves with arrows and typeahead, and skips disabled items", async () => {
    render(<Example onRename={() => {}} />);
    const trigger = screen.getByRole("button", { name: "File options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox")).toHaveFocus();
    await userEvent.keyboard("r");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("menuitemcheckbox")).toHaveFocus();
  });

  it("runs onSelect, closes and returns focus to the trigger", async () => {
    const onRename = vi.fn();
    render(<Example onRename={onRename} />);
    const trigger = screen.getByRole("button", { name: "File options" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(onRename).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("toggles checkbox items and stays open", async () => {
    render(<Example onRename={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "File options" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show hidden files" });
    await userEvent.click(item);
    expect(item).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("button", { name: "File options" })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("Tabs", () => {
  const items = [
    { value: "general", label: "General", content: "General panel" },
    { value: "privacy", label: "Privacy", content: "Privacy panel" },
    { value: "billing", label: "Billing", content: "Billing panel" },
  ];

  it("moves and selects with the arrow keys, with one tab in the Tab order", async () => {
    render(<Tabs label="Settings" items={items} />);
    const [general, privacy, billing] = screen.getAllByRole("tab");
    expect(general).toHaveAttribute("aria-selected", "true");
    expect(privacy).toHaveAttribute("tabindex", "-1");
    general!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(privacy).toHaveFocus();
    expect(privacy).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Privacy panel");
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(billing).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(general).toHaveAttribute("aria-selected", "true");
  });

  it("supports controlled use", async () => {
    const onValueChange = vi.fn();
    render(<Tabs label="Settings" items={items} value="billing" onValueChange={onValueChange} />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
    await userEvent.click(screen.getByRole("tab", { name: "General" }));
    expect(onValueChange).toHaveBeenCalledWith("general");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
  });
});

describe("Nav", () => {
  it("marks the current page and wires the menu button to the sheet", () => {
    render(<Nav brand="Tokyo Paper" links={[{ label: "Components", href: "/c", current: true }, { label: "Tokens", href: "/t" }]} />);
    // The links are shown by a width media query, which jsdom doesn't evaluate.
    expect(screen.getByRole("link", { name: "Components", hidden: true })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Tokens", hidden: true })).not.toHaveAttribute("aria-current");
    const nav = document.querySelector("nav")!;
    expect(nav).toHaveAttribute("aria-label", "Main");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("popovertarget", nav.id);
  });
});

describe("Table", () => {
  it("labels the scroll region by the caption and reports sort state", async () => {
    const onSort = vi.fn();
    render(
      <Table caption="Invoices">
        <thead>
          <tr>
            <SortHeader sort="ascending" onSort={onSort}>Date</SortHeader>
            <SortHeader onSort={() => {}} numeric>Amount</SortHeader>
          </tr>
        </thead>
        <tbody><tr><td>2026-09-28</td><td>€1</td></tr></tbody>
      </Table>
    );
    expect(screen.getByRole("region", { name: "Invoices" })).toHaveAttribute("tabindex", "0");
    const [date, amount] = screen.getAllByRole("columnheader");
    expect(date).toHaveAttribute("aria-sort", "ascending");
    expect(amount).not.toHaveAttribute("aria-sort");
    expect(amount).toHaveClass("tp-table__num");
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    expect(onSort).toHaveBeenCalledOnce();
    expect(nextSort("ascending")).toBe("descending");
    expect(nextSort(undefined)).toBe("ascending");
  });
});

describe("CodeBlock", () => {
  it("copies the code and confirms on the button", async () => {
    const user = userEvent.setup();
    render(<CodeBlock title="app.js" code="const a = 1;" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("const a = 1;");
    expect(screen.getByRole("button", { name: "Copied ✓" })).toBeInTheDocument();
  });
});
