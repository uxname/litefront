# Design — the UI: look, layout, states, copy

This is the design half of the manual. It answers "what should this screen look
like, and what am I allowed to invent?" The code half — formatting, types,
imports, generated files, how the locale machinery is wired — lives in
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
- **The header** (`src/widgets/Header`) — brand link, optional page title, and
  the right-hand cluster: locale switcher, theme toggle, and either a profile
  menu or a sign-in button.

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
| What controls exist? | the nine directories in `src/shared/ui` |
| What does a control look like in every state? | its Ladle story — `npm run storybook:serve` |
| How is a page shell built? | `src/pages/account` (applied), `src/pages/home` (marketing) |
| How is a form built? | `src/features/profile` |
| What text exists, and in which languages? | `messages/en.json`, `messages/ru.json` |
| How do I see the real thing? | [OBSERVABILITY.md](./OBSERVABILITY.md) |

### The nine shared components

Every one of them is a trio — implementation, story, test — see
[TESTING.md](./TESTING.md). Use them; do not re-create them.

| Component | What it is for |
|---|---|
| `Button` | every clickable action. `variant` primary / ghost / danger, `size` sm / md / lg, plus `loading`, `leftIcon`, `rightIcon`. Its exported class builder dresses a router link as a button, because a link is an `<a>` and may not contain a `<button>` |
| `Card` | a titled block with optional description and header actions. The default container for applied content |
| `FormField` | label + control + hint or error, with the aria wiring already done |
| `Input` | single-line text control, with an `invalid` state |
| `Textarea` | multi-line text control, same `invalid` state |
| `Skeleton` | placeholder while a piece of a page loads. `variant` line / circle / rect |
| `PageLoader` | full-screen spinner while a whole page loads |
| `ErrorFallback` | the screen a crash lands on: category, message, request id, retry |
| `Toaster` | the toast host. Mounted once, at the root; the theme is handed to it from there |

Need something that is not on this list? Check the list again, then check
whether a combination of `Card`, `FormField` and `Button` already does it. Only
then write a new one — as a trio, in `src/shared/ui`, with a name that says what
it is rather than where it is used.

## Colour and tokens

Two themes are declared in `src/index.css`: **`cmyk`** (light, the default) and
**`dark`**. Both were tuned for WCAG AA contrast, so their values are not the
stock palette — do not "restore" them.

**Use daisyUI semantic tokens, never hardcoded palette colors.** Use
`bg-base-100/200/300`, `text-base-content` (`/60` for muted), `border-base-300`,
`text-primary`, `text-error/success/info/warning`, and `*-content` for text on accent
fills. **Never** `bg-white`, `text-slate-900`, `text-indigo-600`, `bg-red-50` — those
ignore `data-theme` and stay light in dark mode. This exact mistake is why the theme
once looked broken. Decorative gradient orbs are the only allowed exception.

Which token for what:

- page background `bg-base-200`, raised surfaces `bg-base-100`, hover fills
  `bg-base-200` / `bg-base-300`;
- borders and dividers `border-base-300`;
- primary text `text-base-content`, secondary `text-base-content/70`;
- the accent is `primary`; `success`, `warning`, `error` and `info` carry
  meaning, so do not use them for decoration;
- text sitting on an accent fill uses the matching `*-content` token, never a
  hand-picked white or black.

Semi-transparent tints (`bg-primary/10`, `selection:bg-primary/10`) are how this
UI gets tinted surfaces without new colours. Prefer them over a new token.

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
| loading a piece of a page | `Skeleton` in the shape of the content it replaces |
| loading a whole page | `PageLoader` |
| a submit in flight | the same `Button`, with `loading` — it disables itself, which is also the protection against a double submit |
| nothing to show yet | a short line of `text-base-content/70` explaining what would appear here, inside the `Card` that will hold it |
| the request failed | a message next to the thing that failed, plus a retry where retrying makes sense |
| the render crashed | `ErrorFallback` — it already shows the category, the message and the request id |
| an action finished | a toast: `toast.success` / `toast.error`. One per outcome, never for a state you can see on screen |

The form reference is `src/features/profile`, and it settles the questions that
come up every time:

- validation lives in a schema next to the form, not in the markup;
- an invalid field shows its message right under itself, through `FormField`,
  and the control gets the `invalid` prop so the border and focus ring turn red;
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

- **Focus must always be visible**, and it is one style everywhere:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`.
  Never remove an outline without putting an equally visible one back. On an
  invalid control the outline turns `outline-error` instead.
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

1. **A new component that already exists.** Check the nine in `src/shared/ui`
   first, and their stories.
2. **A hardcoded colour.** It looks right in light mode and breaks dark mode.
   Tokens only.
3. **A new spacing or radius scale.** Use the framework's steps and the shell
   numbers above; a one-off `p-[13px]` is how a UI stops looking made by one
   person.
4. **A one-off button.** If you are writing `bg-primary` and a corner radius on
   a clickable thing, you are re-implementing `Button`. Use it, and pass
   `className` for the marketing skin.
5. **A removed focus outline.** See *Accessibility*.
6. **Hardcoded English in the markup.** See *Copy*.
7. **A control changed without its story and test.** All three move together —
   see [TESTING.md](./TESTING.md).
8. **A rule invented for a pattern this app does not have.** There is no rule
   for a data grid, a paged list, a side navigation, an overlay dialog or a
   slide-out panel, because none of those exist in this code — the only
   pop-up is the header's profile menu, built from a native disclosure element.
   Write the rule when you write the pattern, not before.

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
