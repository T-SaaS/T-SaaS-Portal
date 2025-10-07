import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DriverCard } from "@/molecules/DriverCard";
import { Driver, Company } from "@/types";
import { useMemo } from "react";

export interface DriversGridProps {
  drivers: Driver[];
  companies: Company[];
  isLoading?: boolean;
  formatDate: (dateString: string) => string;
  onViewDetails?: (driverId: string) => void;
}

export function DriversGrid({
  drivers,
  companies,
  isLoading = false,
  formatDate,
  onViewDetails,
}: DriversGridProps) {
  // Create a map of company_id to company name for quick lookup
  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach((company) => {
      map.set(company.id, company.name);
    });
    return map;
  }, [companies]);

  // Sort drivers by company name, then by driver name
  const sortedDrivers = useMemo(() => {
    return [...drivers].sort((a, b) => {
      const companyA = companyMap.get(a.company_id) || "Unknown Company";
      const companyB = companyMap.get(b.company_id) || "Unknown Company";

      // First sort by company name
      if (companyA !== companyB) {
        return companyA.localeCompare(companyB);
      }

      // Then sort by driver name within the same company
      const nameA = `${a.first_name} ${a.last_name}`;
      const nameB = `${b.first_name} ${b.last_name}`;
      return nameA.localeCompare(nameB);
    });
  }, [drivers, companyMap]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drivers</CardTitle>
        <CardDescription>
          {isLoading ? "Loading..." : `${sortedDrivers.length} drivers found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-48 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : sortedDrivers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No drivers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                companyName={
                  companyMap.get(driver.company_id) || "Unknown Company"
                }
                formatDate={formatDate}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
