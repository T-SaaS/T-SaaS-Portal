import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/atoms/PageHeader";
import { ActionButton } from "@/atoms/ActionButton";
import { CompanySearchFilterBar } from "@/molecules/CompanySearchFilterBar";
import { CompaniesTable } from "@/organisms/CompaniesTable";
import { Download } from "lucide-react";
import { Company } from "@/types";
import { useCompanies } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    companyId?: string;
    status?: string;
  }>({});

  // Fetch companies using REST API
  const {
    companies: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompanies();

  // Transform API data to match our Company type
  const transformCompany = (company: any): Company => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    domain: company.domain,
    settings: company.settings || {},
    created_at: company.created_at,
    updated_at: company.updated_at,
  });

  const companies: Company[] = companiesData?.map(transformCompany) || [];

  // Apply filters
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Apply search term filter
      const searchMatch =
        !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.domain &&
          company.domain.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!searchMatch) return false;

      // Apply company filter (for consistency with the interface, though it's redundant here)
      if (filters.companyId && company.id !== filters.companyId) {
        return false;
      }

      // Note: Status filter doesn't apply to companies, but we keep it for interface consistency
      // In a real scenario, you might want to filter companies by some status field

      return true;
    });
  }, [companies, searchTerm, filters]);

  const handleExport = (id: string) => {
    console.log("Export company:", id);
    // Add your export logic here
  };

  const handleExportAll = () => {
    console.log("Export all companies");
    // Add your export all logic here
  };

  // Handle loading and error states
  if (companiesError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Error Loading Companies
        </h2>
        <p className="text-slate-600 mt-2">
          {companiesError?.message || "Failed to load companies"}
        </p>
      </div>
    );
  }

  // Companies list view
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Companies"
        description="View and manage companies"
      >
        <ActionButton icon={Download} onClick={handleExportAll}>
          Export All
        </ActionButton>
      </PageHeader>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <CompanySearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filters={filters}
            onFiltersChange={setFilters}
            availableCompanies={companies.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
            availableStatuses={[]} // Companies don't have statuses, but we need to provide empty array for interface
            searchPlaceholder="Search companies by name, slug, or domain..."
          />
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {Object.keys(filters).length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center flex-wrap gap-2 text-sm text-slate-600">
              <span>Active filters:</span>
              {filters.companyId && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Company:{" "}
                  {companies.find((c) => c.id === filters.companyId)?.name ||
                    filters.companyId}
                  <button
                    onClick={() =>
                      setFilters({ ...filters, companyId: undefined })
                    }
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove company filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() =>
                      setFilters({ ...filters, status: undefined })
                    }
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove status filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <span className="text-slate-500">
                ({filteredCompanies.length} of {companies.length} companies)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companies Table */}
      <CompaniesTable
        companies={filteredCompanies}
        isLoading={companiesLoading}
        formatDate={formatDate}
        onExport={handleExport}
      />
    </div>
  );
}
