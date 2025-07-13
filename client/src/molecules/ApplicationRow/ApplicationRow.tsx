import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/molecules/StatusBadge";
import { ActionButton } from "@/atoms/ActionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { DriverApplication } from "@/types";

export interface ApplicationRowProps {
  application: DriverApplication;
  formatDate: (dateString: string) => string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExport?: (id: string) => void;
}

export function ApplicationRow({
  application,
  formatDate,
  onApprove,
  onReject,
  onExport,
}: ApplicationRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">
            {application.first_name} {application.last_name}
          </div>
          <div className="text-sm text-slate-500">ID: {application.id}</div>
        </div>
      </TableCell>
      <TableCell>{application.company_id}</TableCell>
      <TableCell>
        <div>
          <div className="text-sm">{application.email}</div>
          <div className="text-sm text-slate-500">{application.phone}</div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={application.status} />
      </TableCell>
      <TableCell>{formatDate(application.submitted_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionButton
              icon={MoreHorizontal}
              variant="ghost"
              className="h-8 w-8 p-0"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/applications/${application.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onApprove?.(application.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReject?.(application.id)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport?.(application.id)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
