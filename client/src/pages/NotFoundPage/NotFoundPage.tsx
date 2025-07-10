import { Link } from "react-router-dom";
import { Button } from "@/atoms/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8 max-w-md">
          The page you're looking for doesn't exist. It might have been moved or
          deleted.
        </p>
        <div className="space-x-4">
          <Link to="/apply">
            <Button>Go to Application</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
