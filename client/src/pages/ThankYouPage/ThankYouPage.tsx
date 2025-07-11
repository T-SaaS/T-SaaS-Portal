import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-slate-600">
              Thank you for submitting your driver qualification application. We
              have received your information and will review it shortly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • We'll review your application within 2-3 business days
                </li>
                <li>• You'll receive an email confirmation shortly</li>
                <li>
                  • We may contact you if additional information is needed
                </li>
                <li>• You'll be notified of the final decision via email</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => navigate(-1)} // go back to previous url
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Submit Another Application
              </Button>
              <Button
                variant="outline"
                onClick={() => window.close()}
                className="w-full"
              >
                Close Window
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
