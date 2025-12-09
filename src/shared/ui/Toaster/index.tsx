import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="bottom-right"
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-base-100 group-[.toaster]:text-base-content group-[.toaster]:border-base-content/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-base-content/60",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-content font-bold",
          cancelButton:
            "group-[.toast]:bg-base-200 group-[.toast]:text-base-content",
          error:
            "group-[.toaster]:!bg-error/10 group-[.toaster]:!text-error group-[.toaster]:!border-error/20",
          success:
            "group-[.toaster]:!bg-success/10 group-[.toaster]:!text-success group-[.toaster]:!border-success/20",
          warning:
            "group-[.toaster]:!bg-warning/10 group-[.toaster]:!text-warning group-[.toaster]:!border-warning/20",
          info: "group-[.toaster]:!bg-info/10 group-[.toaster]:!text-info group-[.toaster]:!border-info/20",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
