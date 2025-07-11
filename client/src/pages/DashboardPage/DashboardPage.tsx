import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/atoms/Badge";
import { Button } from "@/atoms/Button";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

export function DashboardPage() {
  // Mock data - replace with actual data from your API
  const stats = {
    totalApplications: 156,
    pendingApplications: 23,
    approvedApplications: 98,
    rejectedApplications: 35,
    newThisWeek: 12,
    growthRate: 8.5,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Overview of driver applications and system activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (stats.approvedApplications / stats.totalApplications) *
                100
              ).toFixed(1)}
              % approval rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejectedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (stats.rejectedApplications / stats.totalApplications) *
                100
              ).toFixed(1)}
              % rejection rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Link to="/applications">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                View Applications
              </Button>
            </Link>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New Driver
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest driver applications submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "John Smith", status: "pending", date: "2 hours ago" },
                {
                  name: "Sarah Johnson",
                  status: "approved",
                  date: "4 hours ago",
                },
                { name: "Mike Davis", status: "rejected", date: "6 hours ago" },
                { name: "Lisa Wilson", status: "pending", date: "8 hours ago" },
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.date}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "default"
                        : app.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-muted-foreground">~120ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm text-muted-foreground">24</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
