// Acceptance checks from README section 20, run against every reference page
// in both themes: axe (WCAG 2.2 AA), 44px targets and 320px reflow.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const src = fileURLToPath(new URL("../src", import.meta.url));
const pages = [
  "index.html",
  ...readdirSync(join(src, "components"))
    .sort()
    .map((name) => `components/${name}/${name}.html`),
];
const url = (page) => pathToFileURL(join(src, page)).href;

const themes = { paper: "light", night: "dark" };
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function axe(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
}

// Overlays are checked while open, since axe skips hidden content.
const openStates = [
  ["components/dialog/dialog.html", "rename dialog", (p) => p.click('[commandfor="d-rename"]')],
  ["components/dialog/dialog.html", "delete dialog", (p) => p.click('[commandfor="d-delete"]')],
  ["components/menu/menu.html", "file menu", (p) => p.click('[popovertarget="m-file"]')],
  ["components/toast/toast.html", "toast", (p) => p.click("[data-toast][data-undo]")],
];

for (const [theme, colorScheme] of Object.entries(themes)) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme });

    for (const page of pages) {
      test(`axe: ${page}`, async ({ page: p }) => {
        await p.goto(url(page));
        expect(await axe(p)).toEqual([]);
      });
    }

    for (const [page, name, open] of openStates) {
      test(`axe: ${page} with ${name} open`, async ({ page: p }) => {
        await p.goto(url(page));
        await open(p);
        await p.waitForTimeout(500); // let entrance animations finish
        expect(await axe(p)).toEqual([]);
      });
    }
  });
}

// Every control is at least 44px, except in compact density (32px),
// where WCAG 2.2's 24px minimum still holds.
const TARGETS = [
  "button",
  "a.tp-button",
  ".tp-input",
  ".tp-select",
  ".tp-choice__label",
  ".tp-nav__link",
  ".tp-menu__item",
].join(",");

for (const page of pages) {
  test(`targets: ${page}`, async ({ page: p }) => {
    await p.goto(url(page));
    const small = await p.$$eval(TARGETS, (elements) =>
      elements
        .filter((el) => el.checkVisibility())
        .map((el) => {
          const { width, height } = el.getBoundingClientRect();
          const compact = !!el.closest('[data-density="compact"]') || el.matches(".tp-table__sort, .tp-code__copy");
          const min = compact ? 24 : 44;
          return { el: el.outerHTML.slice(0, 80), width: Math.round(width), height: Math.round(height), min };
        })
        .filter(({ width, height, min }) => height < min || width < min)
    );
    expect(small).toEqual([]);
  });
}

// WCAG 1.4.10: no horizontal page scroll at 320px (tables and code scroll in their own frame).
for (const page of pages) {
  test(`reflow at 320px: ${page}`, async ({ page: p }) => {
    await p.setViewportSize({ width: 320, height: 800 });
    await p.goto(url(page));
    const scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
  });
}
