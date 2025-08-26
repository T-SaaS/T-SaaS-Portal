export const CONSENT_TEXTS = {
  fairCreditReportingAct: (companyName: string) =>
    `Pursuant to the federal Fair Credit Reporting Act, I hereby authorize ${companyName} and its designated agents and representatives to conduct a comprehensive review of my background through any consumer report for employment. I understand that the scope of the consumer report/investigative consumer report may include, but is not limited to, the following areas: verification of Social Security number; current and previous residences; employment history, including all personnel files; education; references; credit history and reports; criminal history, including records from any criminal justice agency in any or all federal, state or county jurisdictions; birth records; motor vehicle records, including traffic citations and registration; and any other public records.`,

  fmcsaClearinghouse: (companyName: string, driverName: string) =>
    `I, ${driverName}, hereby provide consent to ${companyName} to conduct a limited query of the FMCSA Commercial Driver's License Drug and Alcohol Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse. I am consenting to multiple unlimited queries and for the duration of employment with ${companyName}. I understand that if the limited query conducted by ${companyName} indicates that drug or alcohol violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to ${companyName} without first obtaining additional specific consent from me. I further understand that if I refuse to provide consent for ${companyName} to conduct a limited query of the Clearinghouse, ${companyName} must prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA's drug and alcohol program regulations.`,

  motorVehicleRecord: (companyName: string) =>
    `I authorize ${companyName} to obtain my motor vehicle driving record from any state or jurisdiction where I have held a driver's license. I understand this authorization remains valid for the duration of my employment and may be used for periodic driving record reviews.`,

  drugAlcoholTesting: (driverName: string) =>
    `I, ${driverName}, as the prospective employee, certify that I have read and understand the drug and alcohol testing requirements as outlined in 49 CFR Part 40.25(j). I understand that I must disclose whether I have tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which I applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years. I further understand that if I have had a positive test or a refusal to test, I may not be used to perform safety-sensitive functions until and unless I document successful completion of the return-to-duty process required in 49 CFR Subpart O.`,

  generalApplication: (driverName: string, companyName: string) =>
    `I, ${driverName}, hereby acknowledge and agree to the following terms and conditions for my employment application with ${companyName}:

1. I understand that this application is for employment purposes and that any false statements, omissions, or misrepresentations may result in the rejection of my application or termination of employment if hired.

2. I authorize ${companyName} to contact my previous employers, educational institutions, and other references to verify the information provided in this application.

3. I understand that employment is contingent upon successful completion of a background check, drug and alcohol testing, and any other pre-employment requirements.

4. I agree to comply with all company policies, procedures, and safety requirements if employed.

5. I understand that this application does not constitute a contract of employment and that employment is at-will, meaning either party may terminate the employment relationship at any time with or without cause.

6. I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge.

7. I understand that ${companyName} is an equal opportunity employer and does not discriminate on the basis of race, color, religion, sex, national origin, age, disability, or any other protected characteristic.

By signing below, I acknowledge that I have read, understood, and agree to all the terms and conditions stated above.`,
};
