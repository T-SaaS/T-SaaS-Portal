import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { StatusBadge } from "@/molecules/StatusBadge";
import { DriverApplication } from "@/types";
import { Eye, Download, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface ApplicationCardProps {
  application: DriverApplication;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExport?: (id: string) => void;
  className?: string;
}

export function ApplicationCard({
  application,
  onView,
  onApprove,
  onReject,
  onExport,
  className,
}: ApplicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {application.firstName} {application.lastName}
            </CardTitle>
            <CardDescription>
              ID: {application.id} • {application.company}
            </CardDescription>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Email:</span>
              <p className="text-slate-900">{application.email}</p>
            </div>
            <div>
              <span className="font-medium text-slate-600">Phone:</span>
              <p className="text-slate-900">{application.phone}</p>
            </div>
            <div>
              <span className="font-medium text-slate-600">Submitted:</span>
              <p className="text-slate-900">
                {formatDate(application.submittedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex space-x-2">
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(application.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(application.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>

            {application.status === "pending" && (
              <div className="flex space-x-2">
                {onApprove && (
                  <Button size="sm" onClick={() => onApprove(application.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {onReject && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onReject(application.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
