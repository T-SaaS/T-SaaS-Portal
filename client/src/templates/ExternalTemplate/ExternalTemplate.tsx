import { Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function ExternalTemplate() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-slate-900">
                  Driver Qualification Tool
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            <p>&copy; 2024 Driver Qualification Tool. All rights reserved.</p>
            <p className="mt-2">
              For support, contact{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-800"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
