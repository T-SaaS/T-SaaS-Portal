import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

export interface StatusNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  error?: string | null;
  success?: string | null;
  placeholder?: string;
  label?: string;
}

export function StatusNotes({
  notes,
  onNotesChange,
  error,
  success,
  placeholder = "Add notes about this status change...",
  label = "Notes (optional)",
}: StatusNotesProps) {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label className="text-sm font-medium opacity-80">{label}</label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-1"
        />
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">{success}</span>
        </div>
      )}
    </div>
  );
}
