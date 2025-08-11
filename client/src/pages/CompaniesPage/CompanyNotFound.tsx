import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function CompanyNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/companies")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
