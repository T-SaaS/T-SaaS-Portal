import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SignaturePadComponent } from "./SignaturePad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/atoms/Label";
import { CheckCircle, AlertCircle } from "lucide-react";
import type {
  DriverFormValues,
  SignatureData,
} from "@/types/driverApplicationForm";

interface SignatureConsentProps {
  title: string;
  description: string;
  consentText: string;
  fieldName: keyof DriverFormValues;
  required?: boolean;
}

export const SignatureConsent: React.FC<SignatureConsentProps> = ({
  title,
  description,
  consentText,
  fieldName,
  required = true,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isConsented, setIsConsented] = useState(false);

  // Get current signature data from form
  const currentSignature: SignatureData = watch(fieldName) || {
    data: null,
    uploaded: false,
  };

  const handleConsentChange = (checked: boolean) => {
    setIsConsented(checked);
    // You could add a consent field to track this separately if needed
  };

  const handleSignatureChange = (signatureData: string | null) => {
    const newSignature: SignatureData = {
      data: signatureData,
      uploaded: false,
      timestamp: new Date().toISOString(),
    };

    setValue(fieldName, newSignature);
  };

  const hasSignature = currentSignature?.data && !currentSignature.uploaded;
  const isCompleted = currentSignature?.uploaded;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : hasSignature ? (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-gray-400" />
          )}
          <span>{title}</span>
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Consent Checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id={`consent-${fieldName}`}
            checked={isConsented}
            onCheckedChange={handleConsentChange}
            className="mt-1"
          />
          <div className="space-y-2">
            <Label
              htmlFor={`consent-${fieldName}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I consent to the following:
            </Label>
            <p className="text-sm text-gray-600 leading-relaxed">
              {consentText}
            </p>
          </div>
        </div>

        {/* Signature Section */}
        {isConsented && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">
                Digital Signature{" "}
                {required && <span className="text-red-500">*</span>}
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Please sign below to confirm your consent
              </p>

              <SignaturePadComponent
                onSignatureChange={handleSignatureChange}
                required={required}
                disabled={isCompleted}
                showClearButton={true}
                showCard={false}
              />

              {/* Status Message */}
              {hasSignature && !isCompleted && (
                <p className="text-xs text-gray-500 mt-2">
                  Signature will be uploaded when you submit your application
                </p>
              )}
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {isCompleted && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
            <CheckCircle className="h-4 w-4" />
            <span>Signature uploaded and verified</span>
          </div>
        )}

        {/* Error Display */}
        {errors[fieldName] && (
          <div className="text-red-500 text-sm">
            {errors[fieldName]?.message as string}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
