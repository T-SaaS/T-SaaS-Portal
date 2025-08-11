import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/atoms/Button";
import { Badge } from "@/atoms/Badge";
import { Company } from "@/types";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Download } from "lucide-react";

export interface CompanyRowProps {
  company: Company;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function CompanyRow({ company, formatDate, onExport }: CompanyRowProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/companies/${company.id}`);
  };

  const handleEdit = () => {
    navigate(`/companies/${company.id}/edit`);
  };

  const handleExport = () => {
    onExport?.(company.id);
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{company.name}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {company.domain || "No domain"}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{company.slug}</Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {formatDate(company.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {formatDate(company.updated_at)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            aria-label="View company details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit company"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              aria-label="Export company data"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
