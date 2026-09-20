import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// sonner ships its own stylesheet; unstyled switches off the part of it that
// sits under [data-styled="true"], so the look comes from daisyUI tokens
// instead of twenty "!" overrides fighting a stylesheet that is still there.
// What that part used to provide — the toast width, the content column, the
// icon box and its svg margins, the close button, the focus rings, the dimming
// of a collapsed stack — is restored explicitly below.
//
// Two things unstyled does NOT switch off, because they sit outside
// [data-styled]: positioning with the swipe/exit animations (left to sonner on
// purpose) and a handful of hard-coded colours, of which the dark-theme
// description colour still has to be beaten — see the one "!" below.
export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          // w-[var(--width)] is not decoration: without it the toast collapses
          // to the width of its text, since the width rule was sonner's.
          // flex-col is not a style choice: the icon used to sit above the text
          // because the class list carried daisyUI's own "toast" component
          // (flex-direction: column). That class also brought position: fixed
          // and width: max-content along, so it is gone — and the column it was
          // accidentally providing is now stated on purpose.
          // The dimming selector hides the contents of every toast behind the
          // front one while the stack is collapsed. sonner did that, under
          // [data-styled]; without it the text of the toasts underneath shows
          // through the translucent front card and along its exposed edge.
          // The not-allowed cursor belongs here rather than in classNames.default:
          // sonner resolves that key as `toastType ?? "default"`, so it would
          // reach plain toasts only and miss every success/error/warning one.
          toast:
            "group w-[var(--width)] font-sans text-[13px] flex flex-col items-start gap-4 rounded-2xl border border-base-300/60 bg-base-100/80 p-4 shadow-2xl backdrop-blur-xl [&[data-expanded=false][data-front=false]>*]:opacity-0 [&_[data-disabled=true]]:cursor-not-allowed",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "text-base-content font-bold text-sm leading-tight",
          // The one "!" left in this file, and it is load-bearing. sonner hard-codes
          // a description colour for its dark theme OUTSIDE [data-styled], so
          // unstyled does not switch it off:
          //   [data-sonner-toaster][data-sonner-theme='dark'] [data-description]
          // Tailwind's utilities live in @layer utilities, and any unlayered rule
          // beats a layered one whatever the specificity — so raising ours cannot
          // win, only importance can. Drop this and the description turns
          // sonner's grey in dark mode instead of the daisyUI token.
          description: "text-base-content/70! text-xs mt-1 leading-relaxed",
          actionButton:
            "inline-flex shrink-0 cursor-pointer items-center border-0 ms-[var(--toast-button-margin-start)] me-[var(--toast-button-margin-end)] bg-primary text-primary-content font-bold text-xs h-6 px-4 rounded-xl transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          cancelButton:
            "inline-flex shrink-0 cursor-pointer items-center border-0 ms-[var(--toast-button-margin-start)] me-[var(--toast-button-margin-end)] bg-base-200 text-base-content/70 font-semibold text-xs h-6 px-4 rounded-xl transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content",
          // h-6 is sonner's own button height. It used to win over the padding
          // here (a fixed height plus border-box swallows it), so dropping it
          // would quietly make every action button 8px taller.
          // ms/me carry sonner's own button margins, one of which is "auto" —
          // that is what pins an action button to the far edge instead of
          // letting it sit under the title.
          // The close button sits outside the toast's top-left corner; the
          // offsets and the transform are sonner's own variables, so it lands
          // where it always did and follows the toast's position.
          closeButton:
            "absolute top-0 left-[var(--toast-close-button-start)] right-[var(--toast-close-button-end)] z-[1] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-base-300/60 bg-base-100 p-0 text-base-content [transform:var(--toast-close-button-transform)] transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content",

          success: "border-l-4 border-l-success bg-success/10",
          error: "border-l-4 border-l-error bg-error/10",
          warning: "border-l-4 border-l-warning bg-warning/10",
          info: "border-l-4 border-l-info bg-info/10",

          // [&>*]:shrink-0 keeps the glyph at its own size: the box is 16px
          // and a flex child without it gets squeezed to 12.
          icon: "relative flex h-4 w-4 shrink-0 [&>*]:shrink-0 [&_svg]:ms-[var(--toast-svg-margin-start)] [&_svg]:me-[var(--toast-svg-margin-end)] items-center justify-start ms-[var(--toast-icon-margin-start)] me-[var(--toast-icon-margin-end)] group-data-[type=success]:text-success group-data-[type=error]:text-error group-data-[type=warning]:text-warning group-data-[type=info]:text-info",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
