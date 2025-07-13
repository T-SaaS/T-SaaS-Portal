import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
  text?: string;
}

export function Loader({
  size = "md",
  variant = "spinner",
  className,
  text,
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className
        )}
      >
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        {text && (
          <p className={cn("text-slate-600", textSizes[size])}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className
        )}
      >
        <div className="flex space-x-1">
          <div
            className={cn(
              "bg-slate-400 rounded-full animate-bounce",
              size === "sm"
                ? "h-2 w-2"
                : size === "lg"
                ? "h-3 w-3"
                : "h-2.5 w-2.5"
            )}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={cn(
              "bg-slate-400 rounded-full animate-bounce",
              size === "sm"
                ? "h-2 w-2"
                : size === "lg"
                ? "h-3 w-3"
                : "h-2.5 w-2.5"
            )}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={cn(
              "bg-slate-400 rounded-full animate-bounce",
              size === "sm"
                ? "h-2 w-2"
                : size === "lg"
                ? "h-3 w-3"
                : "h-2.5 w-2.5"
            )}
            style={{ animationDelay: "300ms" }}
          />
        </div>
        {text && (
          <p className={cn("text-slate-600", textSizes[size])}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className
        )}
      >
        <div
          className={cn(
            "bg-slate-400 rounded-full animate-pulse",
            size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
          )}
        />
        {text && (
          <p className={cn("text-slate-600", textSizes[size])}>{text}</p>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton loader for content areas
export function Skeleton({
  className,
  height = "h-4",
  width = "w-full",
}: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 rounded",
        height,
        width,
        className
      )}
    />
  );
}

// Table skeleton loader
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton width="w-1/4" />
          <Skeleton width="w-1/4" />
          <Skeleton width="w-1/4" />
          <Skeleton width="w-1/6" />
          <Skeleton width="w-1/6" />
        </div>
      ))}
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <Skeleton height="h-6" width="w-1/3" />
      <div className="space-y-2">
        <Skeleton />
        <Skeleton />
        <Skeleton width="w-2/3" />
      </div>
    </div>
  );
}
