import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/molecules/StatusBadge";
import { Button } from "@/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Download } from "lucide-react";
import { DriverApplication, Company } from "@/types";

// Closed statuses that prevent editing
const CLOSED_STATUSES: DriverApplication["status"][] = [
  "Not Hired",
  "Disqualified",
  "Rejected",
  "Expired",
  "Approved",
];

export interface ApplicationRowProps {
  application: DriverApplication;
  companies?: Company[] | null;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function ApplicationRow({
  application,
  companies,
  formatDate,
  onExport,
}: ApplicationRowProps) {
  // Find the company name by matching company_id
  const getCompanyName = (companyId: string): string => {
    if (!companies) return companyId;
    const company = companies.find((c) => c.id.toString() === companyId);
    return company?.name || companyId;
  };

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
      <TableCell>{getCompanyName(application.company_id)}</TableCell>
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/applications/${application.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {!CLOSED_STATUSES.includes(application.status) && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={`/applications/${application.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onExport?.(application.id)}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
