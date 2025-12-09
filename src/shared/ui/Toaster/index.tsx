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
            "group toast font-sans group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white font-semibold rounded-md hover:group-[.toast]:bg-slate-800 transition-colors",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 font-medium rounded-md hover:group-[.toast]:bg-slate-200 transition-colors",
          success:
            "group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-900 group-[.toaster]:!border-emerald-200 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-emerald-500",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-200 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-red-500",
          warning:
            "group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-900 group-[.toaster]:!border-amber-200 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-amber-500",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900 group-[.toaster]:!border-blue-200 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
