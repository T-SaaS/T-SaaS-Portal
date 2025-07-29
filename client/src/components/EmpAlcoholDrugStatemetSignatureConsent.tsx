import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SignaturePadComponent } from "./SignaturePad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/atoms/Label";
import { CheckCircle, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  DriverFormValues,
  SignatureData,
} from "@/types/driverApplicationForm";

interface EmpAlcoholDrugStatemetSignatureConsentProps {
  title: string;
  description: string;
  consentText: string;
  fieldName: keyof DriverFormValues;
  required?: boolean;
}

export const EmpAlcoholDrugStatemetSignatureConsent: React.FC<
  EmpAlcoholDrugStatemetSignatureConsentProps
> = ({ title, description, consentText, fieldName, required = true }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Get current signature data from form
  const currentSignature: SignatureData = watch(fieldName) || {
    data: null,
    uploaded: false,
  };

  // Get drug test question answer
  const drugTestAnswer = watch("drugTestQuestion") || "";

  // Create a consent field name based on the signature field
  const consentFieldName = `${fieldName}Consent` as keyof DriverFormValues;

  // Check if user has consented (using separate consent field)
  const isConsented = watch(consentFieldName) || false;

  // Auto-consent if signature exists but consent is not set
  useEffect(() => {
    if (currentSignature?.data && !isConsented) {
      setValue(consentFieldName, true);
    }
  }, [currentSignature?.data, isConsented, setValue, consentFieldName]);

  const handleDrugTestQuestionChange = (value: string) => {
    setValue("drugTestQuestion", value);
    // Auto-consent when drug test question is answered
    setValue(consentFieldName, true);
  };

  const handleSignatureChange = (signatureData: string | null) => {
    const newSignature: SignatureData = {
      data: signatureData,
      uploaded: false,
      timestamp: new Date().toISOString(),
    };

    setValue(fieldName, newSignature);

    // Auto-consent when signature is provided
    if (signatureData) {
      setValue(consentFieldName, true);
    }
  };

  const hasSignature = currentSignature?.data && !currentSignature.uploaded;
  const isCompleted = currentSignature?.uploaded;
  const hasAnsweredDrugTestQuestion = drugTestAnswer !== "";

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
          <div className="space-y-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              {consentText}
            </p>
          </div>
        </div>
        {/* Drug Test Question */}
        <div className="space-y-3">
          <Label className="">
            <p className="text-sm text-gray-700 font-medium">
              I HAVE tested positive, or refused to test, on any pre-employment
              drug or alcohol test administered by an employer to which the
              employee applied for, but did not obtain, safety-sensitive
              transportation work covered by DOT agency drug and alcohol testing
              rules during the past two years.
            </p>
          </Label>

          <RadioGroup
            value={drugTestAnswer}
            onValueChange={handleDrugTestQuestionChange}
            className="flex flex-row space-x-2"
          >
            <div className="flex items-center space-x-2 ">
              <RadioGroupItem value="yes" id="drug-test-yes" />
              <Label htmlFor="drug-test-yes" className="text-sm font-medium">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="drug-test-no" />
              <Label htmlFor="drug-test-no" className="text-sm font-medium">
                No
              </Label>
            </div>
          </RadioGroup>

          {/* Warning if answered Yes */}
          {drugTestAnswer === "yes" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ Important Notice
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                If you answered "Yes" to the above question, you may not be
                eligible for safety-sensitive transportation work until you have
                completed the return-to-duty process as required by 49 CFR
                Subpart O. Please contact our HR department for further
                guidance.
              </p>
            </div>
          )}
        </div>

        {/* Signature Section */}
        {isConsented && hasAnsweredDrugTestQuestion && (
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
                initialSignatureData={currentSignature?.data || null}
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
        {errors.drugTestQuestion && (
          <div className="text-red-500 text-sm">
            {errors.drugTestQuestion?.message as string}
          </div>
        )}
        {errors[consentFieldName] && (
          <div className="text-red-500 text-sm">
            {errors[consentFieldName]?.message as string}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
