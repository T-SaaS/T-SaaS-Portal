import * as Yup from "yup";

// Reusable validation patterns
const PHONE_REGEX =
  /^[\+]?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const PHONE_ERROR_MESSAGE =
  "Phone number must be a valid US number (e.g., 123-456-7890, (123) 456-7890, +1-123-456-7890)";
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const ZIP_ERROR_MESSAGE = "ZIP code must be in format 12345 or 12345-6789";
const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
const SSN_ERROR_MESSAGE = "SSN must be in format 123-45-6789";

// Reusable validation schemas
const phoneValidation = Yup.string()
  .required("Phone number is required")
  .matches(PHONE_REGEX, PHONE_ERROR_MESSAGE);

const optionalPhoneValidation = Yup.string()
  .optional()
  .matches(PHONE_REGEX, PHONE_ERROR_MESSAGE);

const zipValidation = Yup.string()
  .required("ZIP code is required")
  .matches(ZIP_REGEX, ZIP_ERROR_MESSAGE);

const optionalZipValidation = Yup.string()
  .optional()
  .matches(ZIP_REGEX, ZIP_ERROR_MESSAGE);

const ssnValidation = Yup.string()
  .matches(SSN_REGEX, SSN_ERROR_MESSAGE)
  .required("Social Security Number is required");

const optionalSsnValidation = Yup.string()
  .optional()
  .matches(SSN_REGEX, SSN_ERROR_MESSAGE);

// Age calculation utility
const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Future date validation utility
const futureDateValidation = (value: string): boolean => {
  if (!value) return false;
  const expirationDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return expirationDate >= today;
};

// Image validation utility
const imageValidation = (value: string): boolean => {
  if (!value) return false;
  return value.startsWith("data:image/");
};

// Signature validation utility
const signatureValidation = (value: string): boolean => {
  if (!value) return false;
  return value.startsWith("data:image/");
};

export const stepSchemas = [
  // Step 1: Personal Information
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    dob: Yup.string()
      .required("Date of Birth is required")
      .test("age", "You must be at least 18 years old", function (value) {
        if (!value) return false;
        return calculateAge(value) >= 18;
      }),
    socialSecurityNumber: ssnValidation,
    positionAppliedFor: Yup.string().required("Position is required"),
  }),

  // Step 2: Contact & Address
  Yup.object().shape({
    phone: phoneValidation,
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    currentAddress: Yup.string().required("Current Address is required"),
    currentCity: Yup.string().required("Current City is required"),
    currentState: Yup.string().required("Current State is required"),
    currentZip: zipValidation,
    currentAddressFromMonth: Yup.number()
      .min(1)
      .max(12)
      .required("Move-in Month is required"),
    currentAddressFromYear: Yup.number()
      .min(1900)
      .required("Move-in Year is required"),
  }),

  // Step 3: License Information
  Yup.object().shape({
    licenseNumber: Yup.string().required("License Number is required"),
    licenseState: Yup.string().required("License State is required"),
    licenseExpirationDate: Yup.string()
      .required("License Expiration Date is required")
      .test("future-date", "License must not be expired", futureDateValidation),
    medicalCardExpirationDate: Yup.string()
      .required("Medical Card Expiration Date is required")
      .test(
        "future-date",
        "Medical Card must not be expired",
        futureDateValidation
      ),
    licensePhoto: Yup.string()
      .required("Driver's License photo is required")
      .test("valid-image", "Please provide a valid image", imageValidation),
    medicalCardPhoto: Yup.string()
      .required("Medical Card photo is required")
      .test("valid-image", "Please provide a valid image", imageValidation),
  }),

  // Step 4: Address History
  Yup.object().shape({
    addresses: Yup.array().of(
      Yup.object().shape({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zip: zipValidation,
        fromMonth: Yup.number()
          .min(1)
          .max(12)
          .required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    ),
  }),

  // Step 5: Employment History
  Yup.object().shape({
    jobs: Yup.array()
      .min(1, "At least one job is required")
      .of(
        Yup.object().shape({
          employerName: Yup.string().required("Employer Name is required"),
          positionHeld: Yup.string().required("Position Held is required"),
          businessName: Yup.string().required("Business Name is required"),
          companyEmail: Yup.string().email("Invalid email format").optional(),
          companyPhone: optionalPhoneValidation,
          reasonForLeaving: Yup.string().optional(),
          fromMonth: Yup.number()
            .min(1)
            .max(12)
            .required("From Month is required"),
          fromYear: Yup.number().min(1900).required("From Year is required"),
          toMonth: Yup.number().min(1).max(12).required("To Month is required"),
          toYear: Yup.number().min(1900).required("To Year is required"),
        })
      ),
  }),

  // Step 6: Background Check Consents
  Yup.object().shape({
    fairCreditReportingActConsentSignatureConsent: Yup.boolean()
      .required("Fair Credit Reporting Act consent is required")
      .oneOf([true], "You must consent to the Fair Credit Reporting Act"),
    fairCreditReportingActConsentSignature: Yup.object().shape({
      data: Yup.string()
        .required("Fair Credit Reporting Act consent signature is required")
        .test(
          "valid-signature",
          "Please provide a valid signature",
          signatureValidation
        ),
    }),
    fmcsaClearinghouseConsentSignatureConsent: Yup.boolean()
      .required("FMCSA Clearinghouse consent is required")
      .oneOf([true], "You must consent to the FMCSA Clearinghouse query"),
    fmcsaClearinghouseConsentSignature: Yup.object().shape({
      data: Yup.string()
        .required("FMCSA Clearinghouse consent signature is required")
        .test(
          "valid-signature",
          "Please provide a valid signature",
          signatureValidation
        ),
    }),
    motorVehicleRecordConsentSignatureConsent: Yup.boolean()
      .required("Motor vehicle record consent is required")
      .oneOf([true], "You must consent to motor vehicle record checks"),
    motorVehicleRecordConsentSignature: Yup.object().shape({
      data: Yup.string()
        .required("Motor vehicle record consent signature is required")
        .test(
          "valid-signature",
          "Please provide a valid signature",
          signatureValidation
        ),
    }),
  }),

  // Step 7: Drug & Alcohol Testing Consent
  Yup.object().shape({
    drugTestConsentSignatureConsent: Yup.boolean()
      .required("Drug test consent is required")
      .oneOf([true], "You must consent to drug and alcohol testing"),
    drugTestConsentSignature: Yup.object().shape({
      data: Yup.string()
        .required("Drug test consent signature is required")
        .test(
          "valid-signature",
          "Please provide a valid signature",
          signatureValidation
        ),
    }),
    drugTestQuestion: Yup.string()
      .required("Drug test question must be answered")
      .oneOf(["yes", "no"], "Please select Yes or No"),
  }),

  // Step 8: General Application Consent
  Yup.object().shape({
    generalConsentSignatureConsent: Yup.boolean()
      .required("General application consent is required")
      .oneOf([true], "You must consent to the general application terms"),
    generalConsentSignature: Yup.object().shape({
      data: Yup.string()
        .required("General consent signature is required")
        .test(
          "valid-signature",
          "Please provide a valid signature",
          signatureValidation
        ),
    }),
  }),
];

export const completeFormSchema = Yup.object().shape({
  // Step 1: Personal Information
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  dob: Yup.string()
    .required("Date of Birth is required")
    .test("age", "You must be at least 18 years old", function (value) {
      if (!value) return false;
      return calculateAge(value) >= 18;
    }),
  socialSecurityNumber: ssnValidation,
  positionAppliedFor: Yup.string().required("Position is required"),

  // Step 2: Contact & Address
  phone: phoneValidation,
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  currentAddress: Yup.string().required("Current Address is required"),
  currentCity: Yup.string().required("Current City is required"),
  currentState: Yup.string().required("Current State is required"),
  currentZip: zipValidation,
  currentAddressFromMonth: Yup.number()
    .min(1)
    .max(12)
    .required("Move-in Month is required"),
  currentAddressFromYear: Yup.number()
    .min(1900)
    .required("Move-in Year is required"),

  // Step 3: License Information
  licenseNumber: Yup.string().required("License Number is required"),
  licenseState: Yup.string().required("License State is required"),
  licenseExpirationDate: Yup.string()
    .required("License Expiration Date is required")
    .test("future-date", "License must not be expired", futureDateValidation),
  medicalCardExpirationDate: Yup.string()
    .required("Medical Card Expiration Date is required")
    .test(
      "future-date",
      "Medical Card must not be expired",
      futureDateValidation
    ),
  licensePhoto: Yup.string()
    .required("Driver's License photo is required")
    .test("valid-image", "Please provide a valid image", imageValidation),
  medicalCardPhoto: Yup.string()
    .required("Medical Card photo is required")
    .test("valid-image", "Please provide a valid image", imageValidation),

  // Step 4: Address History
  addresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: zipValidation,
      fromMonth: Yup.number().min(1).max(12).required("From Month is required"),
      fromYear: Yup.number().min(1900).required("From Year is required"),
      toMonth: Yup.number().min(1).max(12).required("To Month is required"),
      toYear: Yup.number().min(1900).required("To Year is required"),
    })
  ),

  // Step 5: Employment History
  jobs: Yup.array()
    .min(1, "At least one job is required")
    .of(
      Yup.object().shape({
        employerName: Yup.string().required("Employer Name is required"),
        positionHeld: Yup.string().required("Position Held is required"),
        businessName: Yup.string().required("Business Name is required"),
        companyEmail: Yup.string().email("Invalid email format").optional(),
        companyPhone: optionalPhoneValidation,
        reasonForLeaving: Yup.string().optional(),
        fromMonth: Yup.number()
          .min(1)
          .max(12)
          .required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    ),

  // Step 6: Background Check Consents
  fairCreditReportingActConsentSignatureConsent: Yup.boolean()
    .required("Fair Credit Reporting Act consent is required")
    .oneOf([true], "You must consent to the Fair Credit Reporting Act"),
  fairCreditReportingActConsentSignature: Yup.object().shape({
    data: Yup.string()
      .required("Fair Credit Reporting Act consent signature is required")
      .test(
        "valid-signature",
        "Please provide a valid signature",
        signatureValidation
      ),
  }),
  fmcsaClearinghouseConsentSignatureConsent: Yup.boolean()
    .required("FMCSA Clearinghouse consent is required")
    .oneOf([true], "You must consent to the FMCSA Clearinghouse query"),
  fmcsaClearinghouseConsentSignature: Yup.object().shape({
    data: Yup.string()
      .required("FMCSA Clearinghouse consent signature is required")
      .test(
        "valid-signature",
        "Please provide a valid signature",
        signatureValidation
      ),
  }),
  motorVehicleRecordConsentSignatureConsent: Yup.boolean()
    .required("Motor vehicle record consent is required")
    .oneOf([true], "You must consent to motor vehicle record checks"),
  motorVehicleRecordConsentSignature: Yup.object().shape({
    data: Yup.string()
      .required("Motor vehicle record consent signature is required")
      .test(
        "valid-signature",
        "Please provide a valid signature",
        signatureValidation
      ),
  }),

  // Step 7: Drug & Alcohol Testing Consent
  drugTestConsentSignatureConsent: Yup.boolean()
    .required("Drug test consent is required")
    .oneOf([true], "You must consent to drug and alcohol testing"),
  drugTestConsentSignature: Yup.object().shape({
    data: Yup.string()
      .required("Drug test consent signature is required")
      .test(
        "valid-signature",
        "Please provide a valid signature",
        signatureValidation
      ),
  }),
  drugTestQuestion: Yup.string()
    .required("Drug test question must be answered")
    .oneOf(["yes", "no"], "Please select Yes or No"),

  // Step 8: General Application Consent
  generalConsentSignatureConsent: Yup.boolean()
    .required("General application consent is required")
    .oneOf([true], "You must consent to the general application terms"),
  generalConsentSignature: Yup.object().shape({
    data: Yup.string()
      .required("General consent signature is required")
      .test(
        "valid-signature",
        "Please provide a valid signature",
        signatureValidation
      ),
  }),
});

// Relaxed validation for draft saving (allows partial data)
export const draftValidationSchema = Yup.object().shape({
  // Personal Information - all optional for drafts
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
  dob: Yup.string()
    .optional()
    .test("age", "You must be at least 18 years old", function (value) {
      if (!value) return true; // Skip validation if not provided
      return calculateAge(value) >= 18;
    }),
  socialSecurityNumber: optionalSsnValidation,
  positionAppliedFor: Yup.string().optional(),

  // Contact & Address - all optional for drafts
  phone: optionalPhoneValidation,
  email: Yup.string().email("Invalid email format").optional(),
  currentAddress: Yup.string().optional(),
  currentCity: Yup.string().optional(),
  currentState: Yup.string().optional(),
  currentZip: optionalZipValidation,
  currentAddressFromMonth: Yup.number().min(1).max(12).optional(),
  currentAddressFromYear: Yup.number().min(1900).optional(),

  // License Information - all optional for drafts
  licenseNumber: Yup.string().optional(),
  licenseState: Yup.string().optional(),
  licenseExpirationDate: Yup.string()
    .optional()
    .test(
      "future-date",
      "Expiration date must be in the future",
      function (value) {
        if (!value) return true; // Skip validation if not provided
        return new Date(value) > new Date();
      }
    ),
  medicalCardExpirationDate: Yup.string()
    .optional()
    .test(
      "future-date",
      "Expiration date must be in the future",
      function (value) {
        if (!value) return true; // Skip validation if not provided
        return new Date(value) > new Date();
      }
    ),

  // Address History - optional for drafts
  addresses: Yup.array()
    .of(
      Yup.object().shape({
        address: Yup.string().optional(),
        city: Yup.string().optional(),
        state: Yup.string().optional(),
        zip: optionalZipValidation,
        fromMonth: Yup.number().min(1).max(12).optional(),
        fromYear: Yup.number().min(1900).optional(),
        toMonth: Yup.number().min(1).max(12).optional(),
        toYear: Yup.number().min(1900).optional(),
      })
    )
    .optional(),

  // Employment History - optional for drafts
  jobs: Yup.array()
    .of(
      Yup.object().shape({
        employerName: Yup.string().optional(),
        positionHeld: Yup.string().optional(),
        businessName: Yup.string().optional(),
        companyEmail: Yup.string().email("Invalid email format").optional(),
        companyPhone: optionalPhoneValidation,
        reasonForLeaving: Yup.string().optional(),
        fromMonth: Yup.number().min(1).max(12).optional(),
        fromYear: Yup.number().min(1900).optional(),
        toMonth: Yup.number().min(1).max(12).optional(),
        toYear: Yup.number().min(1900).optional(),
      })
    )
    .optional(),

  // Documents - optional for drafts
  licensePhoto: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
  medicalCardPhoto: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),

  // Consents and Signatures - optional for drafts
  fairCreditReportingActConsentSignatureConsent: Yup.boolean().optional(),
  fairCreditReportingActConsentSignature: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
  fmcsaClearinghouseConsentSignatureConsent: Yup.boolean().optional(),
  fmcsaClearinghouseConsentSignature: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
  motorVehicleRecordConsentSignatureConsent: Yup.boolean().optional(),
  motorVehicleRecordConsentSignature: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
  drugTestConsentSignatureConsent: Yup.boolean().optional(),
  drugTestConsentSignature: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
  drugTestQuestion: Yup.string().optional(),
  generalConsentSignatureConsent: Yup.boolean().optional(),
  generalConsentSignature: Yup.object()
    .shape({
      uploaded: Yup.boolean().optional(),
    })
    .optional(),
});

export type DriverFormSchema = typeof completeFormSchema;
