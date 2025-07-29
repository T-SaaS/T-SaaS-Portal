import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SignaturePadComponent } from "./SignaturePad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/atoms/Label";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { SignatureData } from "@/types/driverApplicationForm";

interface ImportantDisclosureStepProps {
  companyName?: string;
  required?: boolean;
}

export const ImportantDisclosureStep: React.FC<
  ImportantDisclosureStepProps
> = ({ companyName,  required = true }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isConsented, setIsConsented] = useState(false);

  // Get current signature data from form
  const currentSignature: SignatureData = watch("pspOnlineServiceConsentSignature") || {
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

    setValue("pspOnlineServiceConsentSignature", newSignature);
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
          <span>IMPORTANT DISCLOSURE</span>
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL ACCOUNT HOLDERSIMPORTANT DISCLOSUREREGARDING BACKGROUND REPORTS FROM THE PSP ONLINE SERVICE.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Consent Checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id={`consent-pspOnlineServiceConsentSignature`}
            checked={isConsented}
            onCheckedChange={handleConsentChange}
            className="mt-1"
          />
          <div className="space-y-2">
            <Label
              htmlFor={`consent-pspOnlineServiceConsentSignature`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I consent to the following:
            </Label>
            <p className="text-sm text-gray-600 leading-relaxed">
            In connection with your application for employment with {companyName} ("Prospective Employer"), Prospective Employer, its employees, agents or contractors may obtain one or more reports regarding your driving, and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            When the application for employment is submitted in person, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer will provide you with a copy of the report upon which its decision was based and a written summary of your rights under the Fair Credit Reporting Act before taking any final adverse action. If any final adverse action is taken against you based upon your driving history or safety report, the Prospective Employer will notify you that the action has been taken and that the action was based in part or in whole on this report.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            When the application for employment is submitted by mail, telephone, computer, or other similar means, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer must provide you within three business days of taking adverse action oral, written or electronic notification: that adverse action has been taken based in whole or in part on information obtained from FMCSA; the name, address, and the toll free telephone number of FMCSA; that the FMCSA did not make the decision to take the adverse action and is unable to provide you the specific reasons why the adverse action was taken; and that you may, upon providing proper identification, request a free copy of the report and may dispute with the FMCSA the accuracy or completeness of any information or report. If you request a copy of a driver record from the Prospective Employer who procured the report, then, within 3 business days of receiving your request, together with proper identification, the Prospective Employer must send or provide to you a copy of your report and a summary of your rights under the Fair Credit Reporting Act.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            Neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. You may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov If you challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. Your request will be forwarded by the DataQs system to the appropriate State for adjudication. Any crash or inspection in which you were involved will display on your PSP report.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            Since the PSP report does not report, or assign, or imply fault, it will include all Commercial Motor Vehicle (CMV) crashes where you were a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, all inspections, with or without violations, appear on the PSP report. State citations associated with Federal Motor Carrier Safety Regulations (FMCSR) violations that have been adjudicated by a court of law will also appear, and remain, on a PSP report.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            The Prospective Employer cannot obtain background reports from FMCSA without your authorization.
            </p><br/>
            <p className="text-sm text-gray-600 leading-relaxed font-bold">
            Authorization
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            If you agree that the Prospective Employer may obtain such background reports, please read the following and sign below:
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            I authorize ("Prospective Employer") to access the FMCSA Pre-Employment Screening Program (PSP) system to seek information regarding my commercial driving safety record and information regarding my safety inspection history. I understand that I am authorizing the release of safety performance information, including crash data from the previous five (5) years and inspection history from the previous three (3) years. I understand and acknowledge that this release of information may assist the Prospective Employer to make a determination regarding my suitability as an employee.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            I further understand that neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. I understand I may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov If I challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. I understand my request will be forwarded by the DataQs system to the appropriate State for adjudication.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            I understand that any crash or inspection in which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
            I have read the above Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer and its employees, authorized agents, and/or affiliates to obtain the information authorized.
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
        {errors["pspOnlineServiceConsentSignature"] && (
          <div className="text-red-500 text-sm">
            {errors["pspOnlineServiceConsentSignature"]?.message as string}
          </div>
        )}
        <div className="flex items-start space-x-2">
          <div className="space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">
          <strong>NOTICE:</strong> This form is made available to monthly account holders by NIC on behalf of the U.S. Department of Transportation, Federal Motor Carrier Safety Administration (FMCSA Account holders are required by federal law to obtain an Applicant's written or electronic consent prior to accessing the Applicant's PSP report. Further, account holders are required by FMCSAto use the language contained in this Disclosure and Authorization form to obtain an Applicant's consent. The language must be used in whole, exactly as provided. Further, the language on this form must exist as one stand-alone document. The language may NOT be included with other consent forms or any other language.
            </p>
          <p className="text-sm text-gray-600 leading-relaxed">
          <strong>NOTICE:</strong> The prospective employment concept referenced in this form contemplates the definition of "employee" contained at 49 C.F.R. 383.5.
            </p>
          </div>
          </div>
      </CardContent>
    </Card>
  );
};
