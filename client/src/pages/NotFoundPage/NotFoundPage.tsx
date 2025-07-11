import { useNavigate } from "react-router-dom";
import { Button } from "@/atoms/Button";

export function NotFoundPage() {
  const navigate = useNavigate();
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
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    </div>
  );
}
