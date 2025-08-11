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
    domain?: string;
    dateFrom?: string;
    dateTo?: string;
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

  // Extract available filter options from companies data
  const availableOptions = useMemo(() => {
    const domains = new Set<string>();

    companies.forEach((company) => {
      if (company.domain) domains.add(company.domain);
    });

    return {
      domains: Array.from(domains).sort(),
    };
  }, [companies]);

  // Apply filters
  const filteredCompanies = companies.filter((company) => {
    // Apply search term filter
    const searchMatch =
      !searchTerm ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.domain &&
        company.domain.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!searchMatch) return false;

    // Apply domain filter
    if (filters.domain && company.domain !== filters.domain) {
      return false;
    }

    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      const createdDate = new Date(company.created_at);
      if (filters.dateFrom && createdDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && createdDate > new Date(filters.dateTo)) {
        return false;
      }
    }

    return true;
  });

  const handleExport = (id: string) => {
    console.log("Export company:", id);
    // Add your export logic here
  };

  const handleExportAll = () => {
    console.log("Export all companies");
    // Add your export all logic here
  };

  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
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
            availableDomains={availableOptions.domains}
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
              {filters.domain && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Domain: {filters.domain}
                  <button
                    onClick={() => removeFilter("domain")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove domain filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Date: {filters.dateFrom || "Any"} - {filters.dateTo || "Any"}
                  <button
                    onClick={() => {
                      removeFilter("dateFrom");
                      removeFilter("dateTo");
                    }}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove date filter"
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
