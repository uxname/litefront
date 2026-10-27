#!/usr/bin/env node
// Fails when git ignores a file under src/. Tailwind v4 scans only files git does
// not ignore, so a too-broad .gitignore line (a bare `coverage` matching
// src/features/coverage/) silently drops that file's classes from the CSS: the
// build passes and the screen renders unstyled. It runs inside `npm run check`.
//
// src/generated/paraglide/ is ignored on purpose (its own .gitignore): the Vite
// plugin regenerates it and it holds no class names.
import { execFileSync } from "node:child_process";

const ignored = execFileSync(
  "git",
  [
    "ls-files",
    "--others",
    "--ignored",
    "--exclude-standard",
    "--",
    "src",
    ":!src/generated/paraglide",
  ],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

if (ignored.length > 0) {
  console.error(
    "\n✖ Source check failed — git ignores these files, so Tailwind drops their classes:\n",
  );
  for (const file of ignored) {
    console.error(`  ${file}  (git check-ignore -v ${file} shows the rule)`);
  }
  process.exit(1);
}
console.log("✔ Source check passed (git ignores no file under src/).");
