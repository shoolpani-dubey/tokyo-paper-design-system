// Checks that component CSS reads values from tokens instead of hard-coding them.
// Rules (component CSS in src/components/**):
//   color      no hex, rgb(), hsl() etc. System colors (forced-colors mode),
//              transparent and currentColor are allowed.
//   duration   transitions and animations use var(--dur-*)
//   font-size  var(), or em (relative to a token-sized parent), or inherit
//   spacing    padding, margin and gap use 0, auto, var() or calc() with var();
//              em values are allowed for optical alignment next to text
// Usage: node scripts/check-tokens.mjs   (exits 1 on any violation)

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const componentsDir = join(root, "src/components");

const files = readdirSync(componentsDir, { recursive: true })
  .filter((f) => f.endsWith(".css"))
  .map((f) => join(componentsDir, f));

const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(|\b(?:white|black|red|green|blue|gray|grey|yellow|orange)\b/i;
const DURATION = /(?<![\w-])\d*\.?\d+m?s\b/;
const SPACING_PROPS = /^(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z-]+)?$/;

function spacingOk(value) {
  return value
    .replace(/calc\([^;]*\)/g, (m) => (m.includes("var(") ? "0" : m))
    .replace(/env\([^)]*\)/g, "0")
    .replace(/var\([^)]*\)/g, "0")
    .split(/\s+/)
    .every((part) => /^(?:0|auto|-?\d*\.?\d+em|inherit|initial|unset)$/.test(part));
}

const violations = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")) // drop comments, keep line numbers
    .split("\n");

  lines.forEach((line, i) => {
    const decl = line.match(/^\s*([a-z-]+)\s*:\s*(.+?);?\s*$/);
    if (!decl || decl[1].startsWith("--_")) return; // component-private variables are checked where used
    const [, prop, value] = decl;
    const where = `${relative(root, file)}:${i + 1}`;

    if (COLOR.test(value)) violations.push([where, "color", line.trim()]);
    if (/^(?:transition|animation)/.test(prop) && DURATION.test(value)) violations.push([where, "duration", line.trim()]);
    if (prop === "font-size" && !/var\(|^-?\d*\.?\d+em$|^inherit$/.test(value)) violations.push([where, "font-size", line.trim()]);
    if (SPACING_PROPS.test(prop) && !spacingOk(value)) violations.push([where, "spacing", line.trim()]);
  });
}

for (const [where, rule, text] of violations) console.log(`${where}  [${rule}]  ${text}`);
console.log(`\n${files.length} component files checked, ${violations.length} violation${violations.length === 1 ? "" : "s"}.`);
process.exit(violations.length ? 1 : 0);
