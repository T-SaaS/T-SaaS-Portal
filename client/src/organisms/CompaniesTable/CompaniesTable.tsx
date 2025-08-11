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
import { CompanyRow } from "@/molecules/CompanyRow";
import { Company } from "@/types";
import { TableSkeleton } from "@/components/ui/loader";

export interface CompaniesTableProps {
  companies: Company[];
  isLoading?: boolean;
  formatDate: (dateString: string) => string;
  onExport?: (id: string) => void;
}

export function CompaniesTable({
  companies,
  isLoading = false,
  formatDate,
  onExport,
}: CompaniesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>
          {isLoading ? "Loading..." : `${companies.length} companies found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <CompanyRow
                  key={company.id}
                  company={company}
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
