import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ExternalTemplate } from "@/templates/ExternalTemplate";
import { PrivateTemplate } from "@/templates/PrivateTemplate";
import { DriverFormPage } from "@/pages/DriverFormPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ApplicationsPage } from "@/pages/ApplicationsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// External routes - accessible without authentication
const externalRoutes = [
  {
    path: "/apply",
    element: <DriverFormPage />,
    title: "Driver Application",
  },
  {
    path: "/",
    element: <Navigate to="/apply" replace />,
  },
];

// Private routes - require authentication
const privateRoutes = [
  {
    path: "/dashboard",
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
    element: <ApplicationsPage />,
    title: "Application Details",
  },
];

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* External Routes */}
        <Route element={<ExternalTemplate />}>
          {externalRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateTemplate />}>
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
