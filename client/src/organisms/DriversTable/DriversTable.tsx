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
import { TableSkeleton } from "@/components/ui/loader";
import { DriverRow } from "@/molecules/DriverRow";
import { Driver } from "@/types";

export interface DriversTableProps {
  drivers: Driver[];
  isLoading?: boolean;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function DriversTable({
  drivers,
  isLoading = false,
  formatDate,
  onExport,
}: DriversTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drivers</CardTitle>
        <CardDescription>
          {isLoading ? "Loading..." : `${drivers.length} drivers found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>License Exp.</TableHead>
                <TableHead>Medical Card Exp.</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <DriverRow
                  key={driver.id}
                  driver={driver}
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
