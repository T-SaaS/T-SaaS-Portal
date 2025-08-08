import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/molecules/StatusBadge";
import { apiRequest } from "@/lib/queryClient";
import { DriverApplication } from "@/types";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface StatusManagementProps {
  application: DriverApplication;
  onStatusChange: () => void;
}

interface StatusTransition {
  currentStatus: string;
  availableTransitions: string[];
}

export function StatusManagement({
  application,
  onStatusChange,
}: StatusManagementProps) {
  const [transitions, setTransitions] = useState<StatusTransition | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableTransitions();
  }, [application.id]);

  const fetchAvailableTransitions = async () => {
    try {
      const response = await apiRequest(
        "GET",
        `/api/v1/driver-applications/${application.id}/status/transitions`
      );
      const result = await response.json();

      if (result.success) {
        setTransitions(result.data);
      } else {
        setError(result.message || "Failed to fetch available transitions");
      }
    } catch (err) {
      setError("Failed to fetch available transitions");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiRequest(
        "PUT",
        `/api/v1/driver-applications/${application.id}/status`,
        {
          status: selectedStatus,
          notes: notes.trim() || undefined,
        }
      );
      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setSelectedStatus("");
        setNotes("");
        onStatusChange();
        fetchAvailableTransitions();
      } else {
        setError(result.message || "Failed to update status");
      }
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTransition = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiRequest(
        "POST",
        `/api/v1/driver-applications/${application.id}/status/transition`,
        {
          notes: notes.trim() || undefined,
        }
      );
      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setNotes("");
        onStatusChange();
        fetchAvailableTransitions();
      } else {
        setError(result.message || "Failed to process transition");
      }
    } catch (err) {
      setError("Failed to process transition");
    } finally {
      setLoading(false);
    }
  };

  const handleHireDriver = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiRequest(
        "POST",
        `/api/v1/driver-applications/${application.id}/hire`,
        {
          notes: notes.trim() || undefined,
        }
      );
      const result = await response.json();

      if (result.success) {
        setSuccess(`${result.message} Driver ID: ${result.data.driverId}`);
        setNotes("");
        onStatusChange();
        fetchAvailableTransitions();
      } else {
        setError(result.message || "Failed to hire driver");
      }
    } catch (err) {
      setError("Failed to hire driver");
    } finally {
      setLoading(false);
    }
  };

  const canHire = application.status === "Approved";
  const hasTransitions = transitions?.availableTransitions?.length ?? 0 > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Status Management
          <StatusBadge status={application.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Current Status
          </label>
          <div className="mt-1">
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Available Transitions */}
        {transitions && (
          <div>
            <label className="text-sm font-medium text-slate-700">
              Available Transitions
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {transitions.availableTransitions.length > 0 ? (
                transitions.availableTransitions.map((status) => (
                  <Badge key={status} variant="outline" className="text-xs">
                    {status}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No available transitions
                </span>
              )}
            </div>
          </div>
        )}

        {/* Manual Status Change */}
        {hasTransitions && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Change Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {transitions?.availableTransitions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Notes (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this status change..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleStatusChange}
                disabled={!selectedStatus || loading}
                size="sm"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Change Status
              </Button>
            </div>
          </div>
        )}

        {/* Hire Driver */}
        {canHire && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Ready to Hire
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Hire Notes (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about hiring this driver..."
                  rows={2}
                />
              </div>
              <Button
                onClick={handleHireDriver}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Hire Driver
              </Button>
            </div>
          </div>
        )}

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
      </CardContent>
    </Card>
  );
}
