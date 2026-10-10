# Design — the UI: look, layout, states, copy

This is the design half of the manual. It answers "what should this screen look
like, and what am I allowed to invent?" The code half lives elsewhere:
formatting, types and imports in [CODING_STANDARDS.md](./CODING_STANDARDS.md);
slices, generated files and the locale machinery in
[ARCHITECTURE.md](./ARCHITECTURE.md).

**The mistake this file exists to prevent is inventing your own thing next to
one that already exists.** A second button, a second card, a second way of
showing an empty list. Two of anything means they drift apart, and the drift is
what users see. So the two longest sections here are *Sources of truth* and
*Guardrails*: read them before you write a single class name.

## What this UI is today

Three screens and one shared bar:

- **The landing page** (`src/pages/home`) — the product's shop window: a hero
  with a copy-the-install-command button, a grid of feature cards, and a live
  playground (a counter wired to the client store, and a button that throws on
  purpose so you can see the error screen).
- **The account page** (`src/pages/account`) — the signed-in screen: profile
  header, an edit form, and a list of security actions that link out to the
  identity provider.
- **The not-found page** (`src/pages/404`) — a friendly dead end with a way back.
- **The frame** (`src/widgets/AppShell`) — every page sits in it: a skip link,
  the sticky header (brand link; locale menu, theme menu, and either the profile
  menu or a sign-in button), the decorative background, `<main>` and the footer.
  A page renders only its own content, width and padding included.

If your project grew past this, update this section. It describes what is on
screen right now, not what was once planned.

## Two characters, one system

The screens are deliberately not all in the same register, and you need to know
which one you are in before choosing how much decoration is allowed.

| | Marketing screens | Applied screens |
|---|---|---|
| Where | `src/pages/home`, `src/pages/404` | `src/pages/account` |
| Job | make someone want to look | let someone finish a task |
| Register | generous spacing, large type, gradients, decorative blurred orbs, entrance animations | dense, quiet, no decoration that does not carry meaning |
| Reference to copy | `src/pages/home` | `src/pages/account` |

**`src/pages/account` is the reference for every new applied screen.** Copy its
shell, its spacing rhythm, and its use of `Card` before inventing a layout.

This border also decides **local composition versus a new shared component**:

- A marketing flourish that appears once — a gradient headline, an orb, a hover
  animation — is written inline on that page. Do not promote it to
  `src/shared/ui`; it would arrive there as a component with one caller and a
  name nobody can reuse.
- A control that an applied screen needs — anything that takes input, shows
  state, or repeats across screens — belongs in `src/shared/ui` as a trio, and
  the marketing pages then use it too, with `className` for the flourish. The
  landing page's call-to-action buttons are exactly this: shared `Button`,
  marketing skin.
- Rule of thumb: **second occurrence promotes.** The first time, compose it
  locally; the second time you need it, move it to `src/shared/ui` and change
  both call sites.

## Sources of truth

There are no mockups and no design file. **The code is the source of truth**,
and these are the places to look before you write anything:

| Question | Where the answer already is |
|---|---|
| What colours exist? | the two theme blocks in `src/index.css` |
| What controls exist? | the files in `src/shared/ui` (list below) |
| What does a control look like in every state? | its Storybook story — `npm run storybook:serve` |
| How is a page shell built? | `src/pages/account` (applied), `src/pages/home` (marketing) |
| How is a form built? | `src/features/profile` |
| What text exists, and in which languages? | `messages/en.json`, `messages/ru.json` |
| How do I see the real thing? | [OBSERVABILITY.md](./OBSERVABILITY.md) |

### The shared components

The primitives are **shadcn/ui** — source copied into the repo, built on Radix,
styled with Tailwind and the tokens below. They are ours to read, and we leave
them as the registry wrote them: every local change is a commented exception, so
the next `npx shadcn add` or update stays a clean diff. Every file is a trio —
implementation, story, test; see [TESTING.md](./TESTING.md). Use them; do not
re-create them.

| Component | What it is for |
|---|---|
| `button` | every clickable action. `variant` default (filled accent) / outline / secondary / ghost / destructive / link, `size` xs / sm / default / lg / icon…. Icons go in as children, sized by the button. A link that looks like a button is `<Button asChild><Link/></Button>` — never a `<button>` inside an `<a>`. **Local change:** defaults to `type="button"`, so a stray button in a form cannot submit it |
| `card` | the default container for applied content: `Card` › `CardHeader` (`CardTitle`, `CardDescription`, `CardAction`) › `CardContent` › `CardFooter`. A divided header is `<CardHeader className="border-b">` |
| `field`, `label` | a form row: `Field` › `FieldLabel` + control + `FieldDescription` or `FieldError` (`role="alert"`, renders nothing without a message). `data-invalid` on `Field`, `aria-invalid` on the control |
| `input`, `textarea` | text controls. Invalid state is `aria-invalid`, styled from it |
| `dropdown-menu` | every pop-up menu (profile, language, theme). Items, radio groups for a choice, a `destructive` item. Arrow keys, Escape and outside clicks work |
| `tooltip` | a hint on hover/focus, replacing `title=`. Needs `TooltipProvider` — mounted once in `AppProviders`; `ErrorFallback` carries its own |
| `alert` | a message about something that failed or needs attention, inline in the page |
| `avatar` | a picture with a fallback (initials or an icon) while it loads or when it is missing |
| `badge` | a small label: a role, a status, a hero pill |
| `separator` | a rule between items; decorative unless told otherwise |
| `collapsible` | show/hide a block, like the error screen's debug details |
| `skeleton` | placeholder while a piece of a page loads; the caller gives the shape (`size-16 rounded-full`, `h-4 w-2/5`) |
| `spinner` | an inline busy mark with a `status` role and a localized label |
| `page-loader` | ours: full-screen spinner while a whole page loads, with an optional visible label |
| `sonner` | the toast host. Mounted once, at the root; the theme is handed to it from there |
| `ErrorFallback/` | ours: the screen a crash lands on — category, message, request id, retry, copyable debug info |

Need something that is not on this list? Check the list again, then check
whether a combination already does it. Then look in the
[shadcn/ui registry](https://ui.shadcn.com/docs/components) before writing one:

```bash
npx shadcn@latest add <name>
```

The CLI needs two fixes after every run — both are known bugs with this
project's aliases, and both are easy to miss:

1. **Imports.** It writes `import { cn } from "cn"` instead of
   `"@shared/lib/cn"` (whatever `components.json` says). Fix the import.
2. **`package.json`.** It installs a bogus `cn` package (and `next-themes` for
   `sonner`), and rewrites the file — re-sorting dependencies and escaping
   non-ASCII characters in the `gen` script. Restore the file from git and add
   the dependencies the component really needs by hand, then `npm install`.

Then write its story and test (the trio check fails until you do), and run
`npm run check` — Biome reformats the generated code.

## Colour and tokens

The tokens are shadcn/ui's, declared in `src/index.css`: one block for light
(`:root`) and one for dark (`[data-theme="dark"]`), mapped to Tailwind colours in
`@theme inline`. The values are this app's own palette, tuned for WCAG AA and
checked by axe in both themes (`tests/e2e/a11y.spec.ts`, `npm run stories:check`)
— do not "restore" them to the stock shadcn ones.

The theme the user picks is `light`, `dark` or `system` (the default, which
follows the OS); `data-theme` always holds the resolved `light` or `dark`, and
the `dark:` variant keys off it.

The **radii are identical in both themes** on purpose: `--radius` (0.75rem) is
fields and buttons (`rounded-md`), cards are `rounded-xl` (1rem). A control must
not change shape when the theme does.

**Use the semantic tokens, never hardcoded palette colors.** Never `bg-white`,
`text-slate-900`, `text-indigo-600`, `bg-red-50` — those ignore `data-theme` and
stay light in dark mode. This exact mistake is why the theme once looked broken.
Decorative gradients and orbs are the only allowed exception.

Which token for what:

| Use | Token |
|---|---|
| page background | `bg-muted` (the `AppShell` sets it) |
| raised surface | `bg-card` / `bg-background`; menus and toasts `bg-popover` |
| hover fill | `bg-accent` (+ `text-accent-foreground`) |
| borders, dividers | `border` alone (the base layer colours it `border-border`), `divide-y` |
| primary text | default (`text-foreground` on `body`) |
| secondary text | `text-muted-foreground` |
| the accent | `primary`; text on it `primary-foreground` |
| meaning | `destructive`, `success`, `warning`, `info` — not for decoration |

Text sitting on a filled colour uses the matching `*-foreground` token, never a
hand-picked white or black. Semi-transparent tints (`bg-primary/10`,
`selection:bg-primary/10`) are how this UI gets tinted surfaces without new
colours. Prefer them over a new token — and know that `text-primary` on
`bg-primary/10` is the lowest-contrast pair in use, which is why `primary` sits
at L 52%.

`secondary` and `accent` are **neutral** in shadcn (a quiet button fill, a
hover), not brand colours — the pink in the hero gradient is a palette class on
purpose.

Switching the theme is not your job on a page: it is wired once, pre-paint, and
the mechanics are described in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Layout and responsiveness

The breakpoints in use are the framework defaults, and in practice only three
appear: `sm`, `md`, `lg`. Do not add custom ones.

The shell numbers are fixed — reuse them rather than picking new ones:

- page container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`;
- sticky header bar: `sticky top-0 z-50` with an `h-16` row inside the container;
- a single-column applied page (the account screen): `max-w-2xl`;
- a centred message card (the error screen): `max-w-lg`.

Mobile first, then widen. The two rearrangements this UI actually uses:

- stacked controls become a row: `flex-col` → `sm:flex-row`;
- card grids step up: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-4`.

Buttons that stack on a phone go full width (`w-full sm:w-auto`) so they are
easy to hit. Anything that can overflow — an email, a name — gets `truncate` and
`min-w-0` on its flex parent, or it will push the layout sideways.

## States and behaviour

Every screen region that can be empty, slow, or broken needs an answer for each
case. The existing answers:

| State | What to render |
|---|---|
| loading a piece of a page | `Skeleton` in the shape of the content it replaces, its container `aria-busy`, with a screen-reader-only `role="status"` line |
| loading a whole page | `PageLoader` (pass `label` when the wait has a reason worth saying) |
| a submit in flight | the same `Button`, `disabled` while in flight with a `Spinner` in front of the label — disabling is also the protection against a double submit |
| nothing to show yet | a short line of `text-muted-foreground` explaining what would appear here |
| the request failed | an `Alert variant="destructive"` next to the thing that failed, plus a retry where retrying makes sense |
| waiting on something outside our control (the sign-in callback) | a loader with a timeout — then the failure and a way to start over, never a spinner forever |
| the render crashed | `ErrorFallback` — it already shows the category, the message and the request id |
| an action finished | a toast: `toast.success` / `toast.error`. One per outcome, never for a state you can see on screen |

The form reference is `src/features/profile`, and it settles the questions that
come up every time:

- validation lives in a schema next to the form, not in the markup;
- an invalid field shows its message right under itself, through `FieldError`;
  the control gets `aria-invalid` (border and ring turn red) and points
  `aria-describedby` at the error — only while the error exists;
- a rejected file (wrong type, too big) says why under its control, not in a
  toast that disappears;
- a field the user empties is sent as `""` — that is how a value gets cleared;
- leaving with unsaved changes asks first (`useBlocker`);
- submit stays disabled until something actually changed, and while an upload is
  in flight;
- a toast reports the outcome; the typed values are never thrown away on
  failure, because the form owns them;
- the whole trio of schema, messages and tests moves together — see the warning
  in *Copy* below.

Interaction feedback is uniform: `transition-colors` (or `transition-all` where
more than colour moves), `active:scale-95` on pressable things, and hover states
that change a fill or a border, never the layout. Motion is decoration, so the
whole app honours the system "reduce motion" setting from one rule in
`src/index.css` — you do not need to repeat it per component.

## Accessibility

Not optional, and cheap if you do it as you go:

- **Focus must always be visible**, and it is shadcn's one style everywhere:
  `outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50` (the
  primitives already carry it; copy it onto a hand-written link). Two
  variations belong to the rule rather than breaking it: the **colour follows
  the control's meaning**, so an invalid field and a destructive action use
  `ring-destructive/20`; and a control whose container clips the ring uses
  `focus-visible:ring-inset`. Everything else — a removed ring, a different
  width, a hand-picked colour — is a bug.
- Every page starts with a **skip link** to `#content` — the `AppShell` has it.
  One `<header>`, one `<main>`, one `<footer>` per page; the shell provides all
  three.
- Meaning never rides on colour or an icon alone: the "email verified" mark has
  a label (and a tooltip saying it).
- Every icon-only control gets an `aria-label`; that label is UI text, so it
  goes through the message files like any other string.
- Decorative marks are hidden from assistive tech (`aria-hidden`), and
  decorative images get an empty `alt`.
- Contrast is already handled by the tokens — as long as you use the pairs
  above. A hand-picked colour is how contrast regressions get in.
- Anything clickable is a `<button>` or a link, never a `<div>` with a click
  handler: keyboard and screen readers get those for free.
- Use one `<h1>` per screen and do not skip heading levels to get a font size —
  size is a class.

## Copy

All user-facing text goes through the message files: add the key to **both**
`messages/en.json` and `messages/ru.json`, then call it as `m.<key>()`. Never
hardcode user-facing text in a component. This includes the text nobody sees —
an `aria-label` is read aloud, so it is user-facing too.

Key naming: `snake_case`, prefixed with the screen area or domain it belongs to.
The largest groups today are `home_*`, `profile_*`, `error_*`, `action_*`,
`validation_*`, `auth_*` and `counter_*` — not an exhaustive list, so look at
`messages/en.json` before inventing a prefix.

Tone: short, plain, and about the reader. A button says what it does
("Save changes", not "Submit"). An error says what happened and what to do next,
never a stack trace or an error code the reader cannot use.

> Numbers inside message text (e.g. "must be 1–100 characters") duplicate a validation
> limit. When you change a limit, update the schema, the messages, and the tests
> together — this trio has drifted before.

## Guardrails

The short list of things that go wrong here, in the order they go wrong:

1. **A new component that already exists.** Check `src/shared/ui` and its
   stories first, then the shadcn/ui registry.
2. **A hardcoded colour.** It looks right in light mode and breaks dark mode.
   Tokens only.
3. **Assuming `className` wins.** On a primitive it usually does: `cn` runs
   `tailwind-merge`, which drops the component's own utility when yours sets
   the same property — `className="h-auto px-8"` on a `Button` replaces its
   height and padding. It only knows Tailwind's own scales, though: two
   arbitrary or custom classes for one property both survive, and then the
   winner is whichever the stylesheet lists later — not the order you wrote.
   A caller that "overrides" a class and sees no change is looking at this,
   not at a typo.
4. **A new spacing or radius scale.** Use the framework's steps and the shell
   numbers above; a one-off `p-[13px]` is how a UI stops looking made by one
   person.
5. **A one-off button.** If you are writing an accent fill (`bg-primary`,
   `bg-destructive`) and a corner radius on a clickable thing, you are
   re-implementing `Button`. There is no button left
   in this tree that does that, and the next one should not be the first: use
   the component, pick the variant, and pass `className` only for what the page
   legitimately varies — a width, a shadow, a hover flourish.
6. **A removed focus ring.** See *Accessibility*.
7. **Hardcoded English in the markup.** See *Copy*.
8. **A control changed without its story and test.** All three move together —
   see [TESTING.md](./TESTING.md).
9. **A hand-rolled overlay.** Menus, tooltips and anything that floats above
   the page come from shadcn/ui (Radix underneath): focus management, Escape,
   outside clicks and the ARIA roles are already right there, and a
   `<details>` or a `useState` popover gets every one of them wrong. Need a
   dialog or a sheet? `npx shadcn add dialog` — there is none yet.
10. **A rule invented for a pattern this app does not have.** There is no rule
   for a data grid, a paged list or a side navigation, because none of those
   exist in this code. Write the rule when you write the pattern, not before.

## Known deviations

**None right now.** Every deviation this file used to list has been fixed in the
code.

How to keep it that way: when you find something on screen that contradicts this
file and you are not fixing it in the same change, add a line here — what it is,
where it is, and why it is still there. An empty section is a claim that the
code matches the file, so an unrecorded deviation quietly turns this whole
document into fiction.

## Visual review checklist

You cannot see the browser, so look at the screenshots. `npm run test:e2e:screens`
captures the matrix — routes `/`, `/account` and `/non-existent-page`, both
themes, at 1280x800 and 390x844 — and [OBSERVABILITY.md](./OBSERVABILITY.md)
explains how to read them and how to capture a state that no route shows.

Before you call a UI change done:

- [ ] both themes: open the light and dark shot of the same route side by side.
      A region that looks identical in both is using hardcoded colours.
- [ ] both widths: nothing overflows sideways, nothing is clipped, tap targets
      on the phone shot are comfortable.
- [ ] the states you added: loading, empty, error — each one actually reachable
      and each one rendered with the components above.
- [ ] keyboard: tab through the change and watch the focus ring appear on every
      stop.
- [ ] text: every new string comes from the message files, in both languages.
