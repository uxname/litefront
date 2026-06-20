#!/usr/bin/env node
// Enforces the "component trio" for the shared design system: every
// src/shared/ui/<Name>/ that ships an implementation <Name>.tsx MUST also ship
// <Name>.stories.tsx (a Ladle story) and <Name>.test.tsx (a Vitest test).
//
// This makes the "every component has a story + test" rule mechanically
// non-bypassable: it runs inside `npm run check`, which the pre-commit hook and
// CI both invoke. A component is never merged without its trio. (Feature/entity
// components are governed by the coverage gate in vite.config.ts instead, where
// a uniform file-name convention does not hold.)
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const UI_DIR = "src/shared/ui";
const problems = [];

for (const name of readdirSync(UI_DIR)) {
  const dir = join(UI_DIR, name);
  if (!statSync(dir).isDirectory()) {
    continue;
  }
  // Only enforce on single-component dirs that follow the <Name>.tsx convention.
  if (!existsSync(join(dir, `${name}.tsx`))) {
    continue;
  }
  const missing = [];
  if (!existsSync(join(dir, `${name}.stories.tsx`))) {
    missing.push(`${name}.stories.tsx`);
  }
  if (!existsSync(join(dir, `${name}.test.tsx`))) {
    missing.push(`${name}.test.tsx`);
  }
  if (missing.length > 0) {
    problems.push({ dir, missing });
  }
}

if (problems.length > 0) {
  console.error(
    "\n✖ Component trio check failed — every src/shared/ui/<Name>/ must ship a Ladle story and a Vitest test:\n",
  );
  for (const p of problems) {
    console.error(`  ${p.dir}/ is missing: ${p.missing.join(", ")}`);
  }
  console.error(
    "\nAdd the missing file(s) (see the add-story / write-tests skills). This rule keeps the design system from drifting out of test/story coverage.\n",
  );
  process.exit(1);
}

console.log(
  "✔ Component trio check passed (all shared/ui components have a story + test).",
);
