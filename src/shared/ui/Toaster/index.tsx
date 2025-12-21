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
            "group toast font-sans !bg-white/80 !backdrop-blur-xl !border-slate-200/60 !shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] !rounded-2xl !p-4 !flex !items-start !gap-4 !transition-all !duration-500",
          title: "!text-slate-900 !font-bold !text-sm !leading-tight",
          description: "!text-slate-500 !text-xs !mt-1 !leading-relaxed",
          actionButton:
            "!bg-slate-900 !text-white !font-bold !text-xs !px-4 !py-2 !rounded-xl !hover:bg-slate-800 !transition-colors",
          cancelButton:
            "!bg-slate-100 !text-slate-600 !font-semibold !text-xs !px-4 !py-2 !rounded-xl !hover:bg-slate-200 !transition-colors",

          success:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-emerald-500 group-[.toaster]:!bg-emerald-50/50",
          error:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-rose-500 group-[.toaster]:!bg-rose-50/50",
          warning:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-amber-500 group-[.toaster]:!bg-amber-50/50",
          info: "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-blue-500 group-[.toaster]:!bg-blue-50/50",

          icon: "group-data-[type=success]:!text-emerald-600 group-data-[type=error]:!text-rose-600 group-data-[type=warning]:!text-amber-600 group-data-[type=info]:!text-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
