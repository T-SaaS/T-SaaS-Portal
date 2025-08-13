import { Button } from "@/atoms/Button";

export interface StatusActionButtonProps {
  action: string;
  actionIcon: string;
  variant: "default" | "outline" | "destructive";
  onClick: () => void;
  disabled?: boolean;
  color?: string;
}

export function StatusActionButton({
  action,
  actionIcon,
  variant,
  onClick,
  disabled = false,
  color,
}: StatusActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={color === "green" ? "bg-green-600 hover:bg-green-700" : ""}
    >
      <span className="mr-2">{actionIcon}</span>
      {action}
    </Button>
  );
}
