import { Card, CardContent } from "@/components/ui/card";
import { IdCard } from "lucide-react";
import { FormStepHeader } from "@/molecules/FormStepHeader";
import type { FormStep } from "@/types/driverApplicationForm";

export interface DriverFormTemplateProps {
  currentStep: FormStep;
  children: React.ReactNode;
  className?: string;
}

export function DriverFormTemplate({
  currentStep,
  children,
  className,
}: DriverFormTemplateProps) {
  return (
    <div className={`min-h-screen py-8 px-4 bg-slate-50 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <IdCard className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Driver Qualification Application
                </h1>
                <p className="text-slate-600 mt-1">
                  Complete all sections to submit your driver application
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <FormStepHeader currentStep={currentStep} />
          </CardContent>
        </Card>

        {/* Main Form Content */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
