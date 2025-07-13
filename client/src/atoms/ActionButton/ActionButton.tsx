import { Button } from "@/atoms/Button";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

export interface ActionButtonProps {
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  onClick?: () => void;
  className?: string;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { icon: Icon, children, variant = "default", onClick, className = "" },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        onClick={onClick}
        className={className}
      >
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";
