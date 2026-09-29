// Runs axe over every component rendered together. jsdom has no layout, so
// color contrast is left to the browser tests at the repo root.

import { render } from "@testing-library/react";
import axe from "axe-core";
import { expect, it } from "vitest";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  Dialog,
  EmptyState,
  Fieldset,
  Form,
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuSeparator,
  Nav,
  Pill,
  Radio,
  Select,
  SkipLink,
  SortHeader,
  Stat,
  Stats,
  Switch,
  Table,
  Tabs,
  TextArea,
  TextField,
  ToastProvider,
} from "../src";

it("has no axe violations", async () => {
  render(
    <ToastProvider>
      <SkipLink />
      <Nav brand="Tokyo Paper" links={[{ label: "Components", href: "/c", current: true }, { label: "Tokens", href: "/t" }]} />
      <main id="main" tabIndex={-1}>
        <h1>Kitchen sink</h1>
        <Button variant="primary">Save</Button>
        <Button busy busyLabel="Saving…">Save</Button>
        <Form>
          <TextField label="Email" hint="We only send receipts." type="email" />
          <TextField label="Date" error="Enter a real date" />
          <TextArea label="Notes" optional />
          <Select label="Country"><option>Finland</option></Select>
          <Fieldset legend="Notifications">
            <Checkbox label="Email" hint="Once a day" />
            <Radio label="Default" name="size" />
            <Switch label="Reduce motion" />
          </Fieldset>
        </Form>
        <Card title="Guide" href="/guide" eyebrow="5 min">Description</Card>
        <Pill tone="success">Online</Pill>
        <Stats><Stat label="Users" value="20" /></Stats>
        <Alert tone="danger" title="Couldn’t connect" onDismiss={() => {}}>Try again.</Alert>
        <Menu label="Options" trigger={<Button>Options</Button>}>
          <MenuItem>Rename</MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem checked onCheckedChange={() => {}}>Show hidden</MenuCheckboxItem>
        </Menu>
        <Tabs label="Settings" items={[{ value: "a", label: "A", content: "Panel A" }, { value: "b", label: "B", content: "Panel B" }]} />
        <Table caption="Invoices">
          <thead><tr><SortHeader sort="ascending" onSort={() => {}}>Date</SortHeader><th scope="col">Amount</th></tr></thead>
          <tbody><tr><td>2026-09-28</td><td>€1</td></tr></tbody>
        </Table>
        <CodeBlock title="app.js" code="const a = 1;" />
        <EmptyState title="No projects yet" actions={<Button variant="primary">Create project</Button>}>Create one to start.</EmptyState>
        <Dialog open onClose={() => {}} title="Rename project">Body</Dialog>
      </main>
    </ToastProvider>
  );

  const results = await axe.run(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
});
