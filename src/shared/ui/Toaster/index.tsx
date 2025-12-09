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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans group-[.toaster]:p-4",
          description: "group-[.toast]:text-slate-500 font-medium",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white font-medium rounded-lg hover:group-[.toast]:bg-slate-800 transition-colors",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 font-medium rounded-lg hover:group-[.toast]:bg-slate-200 transition-colors",

          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-800 group-[.toaster]:!border-red-200",
          success:
            "group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-800 group-[.toaster]:!border-emerald-200",
          warning:
            "group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-800 group-[.toaster]:!border-amber-200",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-800 group-[.toaster]:!border-blue-200",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
