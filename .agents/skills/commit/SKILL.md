---
name: commit
description: Create a git commit with all unstaged changes. Use this skill whenever the user asks to commit, make a commit, save changes to git, or says something like "commit this", "commit all changes". Always runs npm run check before committing and fixes any errors found.
---

The user wants to commit all current changes to git.

## Process

### Step 1: Run the quality check

Run `npm run check`. If it fails, use the `quality-fix` skill to resolve issues. Never commit if checks fail.

### Step 2: Review what will be committed

```bash
git status
git diff
```

Understand what changed so you can write an accurate commit message.

### Step 3: Stage all changes

```bash
git add -A
```

### Step 4: Write the commit message

Follow the conventional commits format:

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `style`

Pick the scope from the affected FSD layer or feature (e.g. `auth`, `profile`, `shared`, `entities`). Omit scope if changes are broad. Keep the description under 72 characters, imperative mood, no trailing period.

**Example:**
```
feat(auth): add refresh token rotation
fix(profile): correct null check on avatar update
chore: update dependencies
```

### Step 5: Commit

```bash
git commit -m "$(cat <<'EOF'
<your message here>
EOF
)"
```

### Step 6: Handle hook failures

If the pre-commit hook blocks the commit, use the `quality-fix` skill to resolve issues, then retry the commit.

## What NOT to do

- Never skip hooks with `--no-verify`
- Never commit if `npm run check` is failing
- Never use `git add .` with unreviewed files that might contain secrets (`.env`, credentials)
