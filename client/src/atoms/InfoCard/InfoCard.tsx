import { cn } from "@/lib/utils";

export type InfoCardVariant = "info" | "warning" | "success" | "error";

export interface InfoCardProps {
  variant?: InfoCardVariant;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "bg-blue-100",
    dot: "bg-blue-500",
    title: "text-blue-800",
    description: "text-blue-700",
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    icon: "bg-amber-100",
    dot: "bg-amber-500",
    title: "text-amber-800",
    description: "text-amber-700",
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "bg-green-100",
    dot: "bg-green-500",
    title: "text-green-800",
    description: "text-green-700",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "bg-red-100",
    dot: "bg-red-500",
    title: "text-red-800",
    description: "text-red-700",
  },
};

export function InfoCard({
  variant = "info",
  title,
  description,
  children,
  className,
  icon,
}: InfoCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("border rounded-lg p-4", styles.container, className)}>
      <div className="flex items-start space-x-3">
        <div className={cn("p-2 rounded-full", styles.icon)}>
          {icon ? icon : <div className={cn("w-2 h-2 rounded-full", styles.dot)}></div>}
        </div>
        <div className="flex-1">
          <h4 className={cn("font-medium", styles.title)}>{title}</h4>
          {description && (
            <p className={cn("text-sm mt-1", styles.description)}>
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
}
