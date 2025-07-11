import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { Input } from "@/atoms/Input";
import { StatusBadge } from "@/molecules/StatusBadge";
import { ApplicationCard } from "@/organisms/ApplicationCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { DriverApplication } from "@/types";

export function ApplicationsPage() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual data from your API
  const applications: DriverApplication[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      company: "ABC Trucking",
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 234-5678",
      status: "approved",
      submittedAt: "2024-01-14T14:20:00Z",
      company: "XYZ Transport",
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Davis",
      email: "mike.davis@email.com",
      phone: "(555) 345-6789",
      status: "rejected",
      submittedAt: "2024-01-13T09:15:00Z",
      company: "Fast Freight",
    },
    {
      id: "4",
      firstName: "Lisa",
      lastName: "Wilson",
      email: "lisa.wilson@email.com",
      phone: "(555) 456-7890",
      status: "pending",
      submittedAt: "2024-01-12T16:45:00Z",
      company: "Reliable Hauling",
    },
  ];

  const filteredApplications = applications.filter(
    (app) =>
      `${app.firstName} ${app.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If viewing a specific application
  if (id) {
    const application = applications.find((app) => app.id === id);
    if (!application) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Application Not Found
          </h2>
          <p className="text-slate-600 mt-2">
            The requested application could not be found.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Application Details
            </h1>
            <p className="text-slate-600 mt-2">
              View and manage driver application
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <p className="text-slate-900">
                  {application.firstName} {application.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <p className="text-slate-900">{application.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <p className="text-slate-900">{application.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Company
                </label>
                <p className="text-slate-900">{application.company}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Submitted
                </label>
                <p className="text-slate-900">
                  {formatDate(application.submittedAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Application ID
                </label>
                <p className="text-slate-900 font-mono">{application.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Applications list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold text-slate-900">Manage Driver Applications</h3>
          <p className="text-slate-600 mt-2">View and manage driver applications</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} applications found
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {application.firstName} {application.lastName}
                      </div>
                      <div className="text-sm text-slate-500">
                        ID: {application.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{application.email}</div>
                      <div className="text-sm text-slate-500">
                        {application.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>{formatDate(application.submittedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/applications/${application.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
