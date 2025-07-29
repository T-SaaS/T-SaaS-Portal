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
} from "@/pages";
import { DriverFormPage } from "@/pages/DriverFormPage/DriverFormPage";
import { ThankYouPage } from "@/pages/ThankYouPage/ThankYouPage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { DeviceInfoTest } from "@/utils/deviceInfoTest";

// External routes - accessible without authentication
const externalRoutes = [
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
const privateRoutes = [
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
    path: "/devices",
    element: <DeviceInfoTest />,
    title: "Devices",
  },
];

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
