// Checks every color pairing the system relies on against its WCAG minimum,
// in both themes. Reads the light-dark(Paper, Night) pairs from src/theme.css.
// Usage: node scripts/check-contrast.mjs   (exits 1 if any pair fails)

import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");

// --name: light-dark(#paper, #night);  or  --name: #both;
const tokens = {};
for (const [, name, value] of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
  const pair = value.match(/^light-dark\(\s*(#[0-9a-f]{6,8})\s*,\s*(#[0-9a-f]{6,8})\s*\)$/i);
  const single = value.match(/^(#[0-9a-f]{6,8})$/i);
  if (pair) tokens[name] ??= { paper: pair[1], night: pair[2] };
  else if (single) tokens[name] ??= { paper: single[1], night: single[1] };
}

const TEXT = 4.5;   // WCAG 1.4.3 AA, normal text
const BODY = 7;     // WCAG 1.4.6 AAA, used for body text
const UI = 3;       // WCAG 1.4.11, control boundaries and focus

const surfaces = ["paper", "paper-raised", "paper-float"];
const rules = [
  ["ink", surfaces, BODY],
  ["ink-2", surfaces, BODY],
  ["ink-3", [...surfaces, "paper-hover"], TEXT],
  ["line-strong", surfaces, UI],
  ["accent", surfaces, TEXT],
  ["accent-fill-line", ["paper", "paper-raised"], UI],
  ["on-accent", ["accent-fill", "accent-fill-hover", "accent-fill-active"], TEXT],
  ["info", ["paper", "paper-raised"], TEXT],
  ["success", ["paper", "paper-raised"], TEXT],
  ["warning", ["paper", "paper-raised"], TEXT],
  ["danger", ["paper", "paper-raised"], TEXT],
  ...Object.keys(tokens)
    .filter((name) => name.startsWith("syntax-"))
    .map((name) => [name, ["paper-raised"], TEXT]),
];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const alpha = (hex) => (hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1);

// Translucent colors are composited over the page (--paper) of the same theme.
function solid(name, theme) {
  const hex = tokens[name][theme];
  const a = alpha(hex);
  if (a === 1) return rgb(hex);
  const under = rgb(tokens.paper[theme]);
  return rgb(hex).map((c, i) => Math.round(c * a + under[i] * (1 - a)));
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let failures = 0;
const rows = [];
for (const [fg, backgrounds, min] of rules) {
  for (const bg of backgrounds) {
    for (const theme of ["paper", "night"]) {
      if (!tokens[fg] || !tokens[bg]) {
        rows.push(["MISSING", theme, fg, bg, "-", min]);
        failures++;
        continue;
      }
      const value = ratio(solid(fg, theme), solid(bg, theme));
      const ok = value >= min;
      if (!ok) failures++;
      rows.push([ok ? "pass" : "FAIL", theme, fg, bg, value.toFixed(2), min]);
    }
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad("", 8) + pad("theme", 7) + pad("foreground", 20) + pad("background", 20) + pad("ratio", 8) + "min");
for (const [status, theme, fg, bg, value, min] of rows) {
  if (status !== "pass" || process.argv.includes("--all")) {
    console.log(pad(status, 8) + pad(theme, 7) + pad(fg, 20) + pad(bg, 20) + pad(value, 8) + min);
  }
}
console.log(`\n${rows.length - failures} of ${rows.length} pairs pass.${failures ? "" : " (Use --all to list every pair.)"}`);
process.exit(failures ? 1 : 0);
