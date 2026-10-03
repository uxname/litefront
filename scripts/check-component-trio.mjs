#!/usr/bin/env node
// Enforces the "component trio" for the shared design system: every component
// in src/shared/ui MUST also ship a Storybook story and a Vitest test next to it.
// Two layouts are covered:
//  - flat shadcn/ui files: <name>.tsx → <name>.stories.tsx + <name>.test.tsx
//    (what `npx shadcn add` writes — see components.json);
//  - a directory: <Name>/<Name>.tsx → <Name>.stories.tsx + <Name>.test.tsx.
//
// This makes the "every component has a story + test" rule mechanically
// non-bypassable: it runs inside `npm run check`, which the pre-commit hook invokes
// (there is no CI — meta ADR-0001). Feature/entity components are governed by the
// coverage thresholds in vitest.config.ts instead, where a uniform file-name
// convention does not hold.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const UI_DIR = "src/shared/ui";
const problems = [];

const SUFFIX = /\.(stories|test)\.tsx$/;

for (const name of readdirSync(UI_DIR)) {
  const dir = join(UI_DIR, name);
  if (!statSync(dir).isDirectory()) {
    if (!name.endsWith(".tsx") || SUFFIX.test(name)) {
      continue;
    }
    const base = name.slice(0, -".tsx".length);
    const missing = [`${base}.stories.tsx`, `${base}.test.tsx`].filter(
      (f) => !existsSync(join(UI_DIR, f)),
    );
    if (missing.length > 0) {
      problems.push({ dir: join(UI_DIR, name), missing });
    }
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
    "\n✖ Component trio check failed — every src/shared/ui component must ship a Storybook story and a Vitest test:\n",
  );
  for (const p of problems) {
    console.error(`  ${p.dir} is missing: ${p.missing.join(", ")}`);
  }
  console.error(
    "\nAdd the missing file(s) (see the add-story / write-tests skills). This rule keeps the design system from drifting out of test/story coverage.\n",
  );
  process.exit(1);
}

console.log(
  "✔ Component trio check passed (all shared/ui components have a story + test).",
);
