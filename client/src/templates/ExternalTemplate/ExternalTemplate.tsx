import { Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Skeleton } from "@/components/ui/skeleton";

export function ExternalTemplate() {
  const { company, isLoading, error } = useCompanyContext();

  const displayName = company?.name || "Driver Qualification Tool"; 
  const supportEmail = company?.settings?.supportEmail || "support@trucking.mba";


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  <h1 className="text-xl font-bold text-slate-900">
                    {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                  </h1>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Company-specific banner if available */}
      {company && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-sm text-blue-800 text-center">
              {company.settings?.welcomeMessage ||
                `Welcome to ${company.name}'s driver application portal`}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-sm text-red-800 text-center">
              Company not found. Please check the URL or contact support.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            <p>&copy; 2024 {displayName}. All rights reserved.</p>
            <p className="mt-2">
              For support, contact{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {supportEmail}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
