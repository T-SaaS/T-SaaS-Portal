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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationRow } from "@/molecules/ApplicationRow";
import { DriverApplication, Company } from "@/types";
import { TableSkeleton } from "@/components/ui/loader";

export interface ApplicationsTableProps {
  applications: DriverApplication[];
  companies?: Company[] | null;
  isLoading?: boolean;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function ApplicationsTable({
  applications,
  companies,
  isLoading = false,
  formatDate,
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
                  companies={companies}
                  formatDate={formatDate}
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
