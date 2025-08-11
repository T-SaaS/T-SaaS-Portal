import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ExternalTemplate } from "@/templates/ExternalTemplate";
import { PrivateTemplate } from "@/templates/PrivateTemplate";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  DashboardPage,
  ApplicationsPage,
  ApplicationDetailsPage,
  ApplicationEditPage,
  NotFoundPage,
  CompaniesPage,
  CompanyDetailsPage,
  CompanyEditPage,
} from "@/pages";
import { DriverFormPage } from "@/pages/DriverFormPage/DriverFormPage";
import { ThankYouPage } from "@/pages/ThankYouPage/ThankYouPage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { DeviceInfoTest } from "@/utils/deviceInfoTest";

// Route type definition
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  title: string;
}

// External routes - accessible without authentication
export const externalRoutes: RouteConfig[] = [
  {
    path: "/ex/:companySlug/apply",
    element: <DriverFormPage />,
    title: "Driver Application",
  },
  {
    path: "/thank-you",
    element: <ThankYouPage />,
    title: "Thank You",
  },
  {
    path: "/login",
    element: <LoginPage />,
    title: "Login",
  },
];

// Private routes - require authentication
export const privateRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <DashboardPage />,
    title: "Dashboard",
  },
  {
    path: "/applications",
    element: <ApplicationsPage />,
    title: "Applications",
  },
  {
    path: "/applications/:id",
    element: <ApplicationDetailsPage />,
    title: "Application Details",
  },
  {
    path: "/applications/:id/edit",
    element: <ApplicationEditPage />,
    title: "Edit Application",
  },
  {
    path: "/companies",
    element: <CompaniesPage />,
    title: "Companies",
  },
  {
    path: "/companies/:id",
    element: <CompanyDetailsPage />,
    title: "Company Details",
  },
  {
    path: "/companies/:id/edit",
    element: <CompanyEditPage />,
    title: "Edit Company",
  },
  {
    path: "/devices",
    element: <DeviceInfoTest />,
    title: "Devices",
  },
];

// Helper function to match route patterns
function matchRoute(pathname: string, routePath: string): boolean {
  const pathSegments = pathname.split("/").filter(Boolean);
  const routeSegments = routePath.split("/").filter(Boolean);

  if (pathSegments.length !== routeSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    return segment.startsWith(":") || segment === pathSegments[index];
  });
}

// Hook to get route title by pathname
export function useRouteTitle(pathname: string): string {
  // Check private routes first
  const privateRoute = privateRoutes.find((route) =>
    matchRoute(pathname, route.path)
  );
  if (privateRoute) {
    return privateRoute.title;
  }

  // Check external routes
  const externalRoute = externalRoutes.find((route) =>
    matchRoute(pathname, route.path)
  );
  if (externalRoute) {
    return externalRoute.title;
  }

  return "";
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* External Routes with Company Context */}
        <Route
          element={
            <CompanyProvider>
              <ExternalTemplate />
            </CompanyProvider>
          }
        >
          {externalRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Private Routes */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateTemplate />
            </ProtectedRoute>
          }
        >
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
