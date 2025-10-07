import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { StatusBadge } from "@/molecules/StatusBadge";
import { Driver } from "@/types";
import { Eye, Calendar, IdCard, User, Building2 } from "lucide-react";

export interface DriverCardProps {
  driver: Driver;
  companyName: string;
  formatDate: (dateString: string) => string;
  onViewDetails?: (driverId: string) => void;
}

export function DriverCard({
  driver,
  companyName,
  formatDate,
  onViewDetails,
}: DriverCardProps) {
  const handleViewDetails = () => {
    onViewDetails?.(driver.id);
  };

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined | null): string => {
    if (
      !dateString ||
      dateString === "" ||
      dateString === "undefined" ||
      dateString === "null"
    ) {
      return "";
    }
    try {
      return formatDate(dateString);
    } catch (error) {
      return "";
    }
  };

  // Helper function to check if date is expiring soon
  const isExpiringSoon = (dateString: string | undefined | null): boolean => {
    if (
      !dateString ||
      dateString === "" ||
      dateString === "undefined" ||
      dateString === "null"
    ) {
      return false;
    }
    try {
      const date = new Date(dateString);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return date < thirtyDaysFromNow;
    } catch (error) {
      return false;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {driver.first_name} {driver.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {driver.position || "No Position"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{companyName}</p>
              </div>
            </div>
          </div>
          <StatusBadge status={driver.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* License Information */}
        <div className="flex items-center gap-2 text-sm">
          <IdCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">License:</span>
          <span className="font-medium">{driver.license_number || "N/A"}</span>
        </div>

        {/* Expiration Dates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">License Expires:</span>
            </div>
            <span
              className={`font-medium ${
                isExpiringSoon(driver.license_expiration_date)
                  ? "text-red-600"
                  : "text-foreground"
              }`}
            >
              {safeFormatDate(driver.license_expiration_date)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Medical Card Expires:
              </span>
            </div>
            <span
              className={`font-medium ${
                isExpiringSoon(driver.medical_card_expiration_date)
                  ? "text-red-600"
                  : "text-foreground"
              }`}
            >
              {safeFormatDate(driver.medical_card_expiration_date)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
