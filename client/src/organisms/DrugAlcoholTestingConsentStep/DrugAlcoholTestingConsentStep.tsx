import React from "react";
import { EmpAlcoholDrugStatemetSignatureConsent } from "@/components/EmpAlcoholDrugStatemetSignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CONSENT_TEXTS } from "@/utils/consentTexts";

interface DrugAlcoholTestingConsentStepProps {
  companyName?: string;
  driverName?: string;
}

export const DrugAlcoholTestingConsentStep: React.FC<
  DrugAlcoholTestingConsentStepProps
> = ({ companyName, driverName }) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review and complete the drug and alcohol testing consent form.
          This is required by DOT regulations for all commercial drivers.
        </AlertDescription>
      </Alert>

      {/* Pre-Employment Employee Alcohol & Drug Test Statement */}
      <EmpAlcoholDrugStatemetSignatureConsent
        title="Pre-Employment Employee Alcohol & Drug Test Statement"
        description="49 CFR Part 40.25(j) states, as the employer, you must ask the employee whether he or she has tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which the employee applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years. If the employee admits that he or she had a positive test or a refusal to test, you must not use the employee to perform safety-sensitive functions for you, until and unless the employee documents successful completion of the return-to-duty process required in 49 CFR Subpart O."
        consentText={CONSENT_TEXTS.drugAlcoholTesting(driverName || "")}
        fieldName="drugTestConsentSignature"
        required={true}
      />

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Drug & Alcohol Testing Consent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <strong>Required Consent:</strong> The drug and alcohol testing
              consent form above must be completed to proceed.
            </p>
            <p className="text-blue-700">
              <strong>Purpose:</strong> This consent is required by DOT
              regulations and allows us to conduct drug and alcohol testing as
              required for commercial driver positions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
