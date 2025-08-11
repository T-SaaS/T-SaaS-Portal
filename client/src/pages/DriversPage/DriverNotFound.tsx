import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/atoms/Button";

export function DriverNotFound() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Driver Not Found
        </h2>
        <p className="text-slate-600 mb-6">
          The driver you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/drivers")}>Back to Drivers</Button>
      </CardContent>
    </Card>
  );
}
