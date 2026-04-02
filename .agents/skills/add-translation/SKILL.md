---
name: add-translation
description: Use this skill when the user adds UI text, labels, messages, or any user-facing strings that need to be internationalized. Also use when adding new i18n keys, translation strings, or working with Paraglide JS. Trigger phrases: "add translation", "new i18n key", "paraglide", "i18n", "localization".
version: 1.0.0
---

# Add Translation (i18n)

Adds translation keys using Paraglide JS — the project's type-safe i18n library.

## How Paraglide Works

1. Translation files live in `messages/` (one per language: `en.json`, `de.json`, etc.)
2. Paraglide generates typed functions into `src/generated/paraglide/`
3. Import and use `m.key_name()` in components — **never hardcode UI text**

**Never edit `src/generated/paraglide/` manually.**

## Step 1: Add the key to all message files

```json
// messages/en.json
{
  "welcome_title": "Welcome to My App",
  "welcome_subtitle": "A modern React boilerplate",
  "button_sign_in": "Sign In",
  "button_sign_out": "Sign Out"
}
```

```json
// messages/de.json
{
  "welcome_title": "Willkommen bei meiner App",
  "welcome_subtitle": "Ein modernes React-Boilerplate",
  "button_sign_in": "Anmelden",
  "button_sign_out": "Abmelden"
}
```

**Always add to ALL language files at the same time.**

## Step 2: Key naming conventions

- Use `snake_case`
- Prefix by feature/context: `auth_`, `header_`, `error_`, `button_`, etc.
- Be descriptive: `user_profile_title` not just `title`

## Step 3: Use in components

```tsx
import * as m from "@generated/paraglide/messages";

function WelcomeBanner() {
  return (
    <div>
      <h1>{m.welcome_title()}</h1>
      <p>{m.welcome_subtitle()}</p>
    </div>
  );
}
```

## Keys with Parameters

```json
// messages/en.json
{
  "greeting": "Hello, {name}!",
  "items_count": "You have {count} items"
}
```

```tsx
<p>{m.greeting({ name: user.name })}</p>
<p>{m.items_count({ count: cart.length })}</p>
```

## Checklist

- [ ] Key added to ALL message files (never just one)
- [ ] Key name uses `snake_case` with context prefix
- [ ] Component uses `m.key_name()` — no hardcoded strings
- [ ] TypeScript autocomplete confirms key exists (type errors = missing key)
- [ ] Never editing `src/generated/paraglide/` manually
