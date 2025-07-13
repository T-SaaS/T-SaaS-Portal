import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationRow } from "@/molecules/ApplicationRow";
import { DriverApplication } from "@/types";
import { Loader, TableSkeleton } from "@/components/ui/loader";

export interface ApplicationsTableProps {
  applications: DriverApplication[];
  isLoading?: boolean;
  formatDate: (dateString: string) => string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExport?: (id: string) => void;
}

export function ApplicationsTable({
  applications,
  isLoading = false,
  formatDate,
  onApprove,
  onReject,
  onExport,
}: ApplicationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Applications</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading..."
            : `${applications.length} applications found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  formatDate={formatDate}
                  onApprove={onApprove}
                  onReject={onReject}
                  onExport={onExport}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
