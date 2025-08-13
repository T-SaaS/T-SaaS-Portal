import { Card, CardContent } from "@/components/ui/card";
import { StatusIcon } from "@/atoms/StatusIcon";
import { StatusActionButton } from "@/atoms/StatusActionButton";
import { StatusNotes } from "@/molecules/StatusNotes";
import { ReactNode } from "react";

export interface StatusCardConfig {
  title: string;
  description: string;
  icon: string;
  color: "blue" | "yellow" | "orange" | "purple" | "indigo" | "green" | "red";
  action: string;
  actionIcon: string;
  actionVariant: "default" | "outline" | "destructive";
  showNotes: boolean;
  onAction: () => void;
  customContent?: ReactNode;
}

export interface StatusCardProps {
  config: StatusCardConfig;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  error?: string | null;
  success?: string | null;
  loading?: boolean;
}

export function StatusCard({
  config,
  notes = "",
  onNotesChange,
  error,
  success,
  loading = false,
}: StatusCardProps) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
    orange: "border-orange-200 bg-orange-50 text-orange-800",
    purple: "border-purple-200 bg-purple-50 text-purple-800",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  const colorClass = colorClasses[config.color];

  return (
    <Card className={`${colorClass.split(" ")[0]} ${colorClass.split(" ")[1]}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon icon={config.icon} />
            <div>
              <h3 className="text-lg font-semibold">{config.title}</h3>
              <p className="text-sm opacity-80">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusActionButton
              action={config.action}
              actionIcon={config.actionIcon}
              variant={config.actionVariant}
              onClick={config.onAction}
              disabled={loading}
              color={config.color}
            />
          </div>
        </div>

        {/* Status Notes Section */}
        {config.showNotes && !config.customContent && onNotesChange && (
          <StatusNotes
            notes={notes}
            onNotesChange={onNotesChange}
            error={error}
            success={success}
          />
        )}

        {config.customContent && config.customContent}
      </CardContent>
    </Card>
  );
}
