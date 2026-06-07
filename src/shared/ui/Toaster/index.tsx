import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans !bg-base-100/80 !backdrop-blur-xl !border-base-300/60 !shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] !rounded-2xl !p-4 !flex !items-start !gap-4 !transition-all !duration-500",
          title: "!text-base-content !font-bold !text-sm !leading-tight",
          description: "!text-base-content/60 !text-xs !mt-1 !leading-relaxed",
          actionButton:
            "!bg-primary !text-primary-content !font-bold !text-xs !px-4 !py-2 !rounded-xl !hover:bg-primary/90 !transition-colors",
          cancelButton:
            "!bg-base-200 !text-base-content/60 !font-semibold !text-xs !px-4 !py-2 !rounded-xl !hover:bg-base-300 !transition-colors",

          success:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-success group-[.toaster]:!bg-success/10",
          error:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-error group-[.toaster]:!bg-error/10",
          warning:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-warning group-[.toaster]:!bg-warning/10",
          info: "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-info group-[.toaster]:!bg-info/10",

          icon: "group-data-[type=success]:!text-success group-data-[type=error]:!text-error group-data-[type=warning]:!text-warning group-data-[type=info]:!text-info",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
