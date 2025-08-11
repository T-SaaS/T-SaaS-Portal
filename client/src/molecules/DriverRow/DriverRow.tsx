import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/atoms/Button";
import { Badge } from "@/atoms/Badge";
import { Driver } from "@/types";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Download } from "lucide-react";

export interface DriverRowProps {
  driver: Driver;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function DriverRow({ driver, formatDate, onExport }: DriverRowProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/drivers/${driver.id}`);
  };

  const handleEdit = () => {
    navigate(`/drivers/${driver.id}/edit`);
  };

  const handleExport = () => {
    onExport?.(driver.id);
  };

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "out_of_duty":
        return "warning";
      case "no_longer_employed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">
            {driver.first_name} {driver.last_name}
          </div>
          <div className="text-sm text-slate-600">{driver.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">{driver.position}</div>
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm font-medium">{driver.license_number}</div>
          <div className="text-xs text-slate-500">{driver.license_state}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusColor(driver.status)}>
          {driver.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {formatDate(driver.hire_date)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {driver.license_expiration_date
            ? formatDate(driver.license_expiration_date)
            : "N/A"}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-600">
          {driver.medical_card_expiration_date
            ? formatDate(driver.medical_card_expiration_date)
            : "N/A"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            title="View driver details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            title="Edit driver"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              title="Export driver data"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
