import { calculateAge } from "@/utils/dateUtils";
import * as Yup from "yup";

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
    socialSecurityNumber: Yup.string()
      .matches(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format 123-45-6789")
      .required("Social Security Number is required"),
    positionAppliedFor: Yup.string().required("Position is required"),
  }),

  // Step 2: Contact & Address
  Yup.object().shape({
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    currentAddress: Yup.string().required("Current Address is required"),
    currentCity: Yup.string().required("Current City is required"),
    currentState: Yup.string().required("Current State is required"),
    currentZip: Yup.string()
      .required("Current ZIP code is required")
      .matches(
        /^\d{5}(-\d{4})?$/,
        "ZIP code must be in format 12345 or 12345-6789"
      ),
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
      .test("future-date", "License must not be expired", function (value) {
        if (!value) return false;
        const expirationDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        return expirationDate >= today;
      }),
    medicalCardExpirationDate: Yup.string()
      .required("Medical Card Expiration Date is required")
      .test(
        "future-date",
        "Medical Card must not be expired",
        function (value) {
          if (!value) return false;
          const expirationDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day
          return expirationDate >= today;
        }
      ),
    licensePhoto: Yup.string()
      .required("Driver's License photo is required")
      .test("valid-image", "Please provide a valid image", function (value) {
        if (!value) return false;
        return value.startsWith("data:image/");
      }),
    medicalCardPhoto: Yup.string()
      .required("Medical Card photo is required")
      .test("valid-image", "Please provide a valid image", function (value) {
        if (!value) return false;
        return value.startsWith("data:image/");
      }),
  }),

  // Step 4: Address History
  Yup.object().shape({
    addresses: Yup.array().of(
      Yup.object().shape({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zip: Yup.string()
          .required("ZIP code is required")
          .matches(
            /^\d{5}(-\d{4})?$/,
            "ZIP code must be in format 12345 or 12345-6789"
          ),
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
      .of(
        Yup.object().shape({
          employerName: Yup.string().required("Employer Name is required"),
          positionHeld: Yup.string().required("Position Held is required"),
          fromMonth: Yup.number()
            .min(1)
            .max(12)
            .required("From Month is required"),
          fromYear: Yup.number().min(1900).required("From Year is required"),
          toMonth: Yup.number().min(1).max(12).required("To Month is required"),
          toYear: Yup.number().min(1900).required("To Year is required"),
        })
      )
      .min(1, "At least one job is required"),
  }),

  // Step 5: Background Check Consents
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
          function (value) {
            if (!value) return false;
            return value.startsWith("data:image/");
          }
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
          function (value) {
            if (!value) return false;
            return value.startsWith("data:image/");
          }
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
          function (value) {
            if (!value) return false;
            return value.startsWith("data:image/");
          }
        ),
    }),
  }),

  // Step 6: Drug & Alcohol Testing Consent
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
          function (value) {
            if (!value) return false;
            return value.startsWith("data:image/");
          }
        ),
    }),
    drugTestQuestion: Yup.string()
      .required("Drug test question must be answered")
      .oneOf(["yes", "no"], "Please select Yes or No"),
  }),

  // Step 7: General Application Consent
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
          function (value) {
            if (!value) return false;
            return value.startsWith("data:image/");
          }
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
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  socialSecurityNumber: Yup.string()
    .matches(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format 123-45-6789")
    .required("Social Security Number is required"),
  positionAppliedFor: Yup.string().required("Position is required"),

  // Step 2: Contact & Address
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  currentAddress: Yup.string().required("Current Address is required"),
  currentCity: Yup.string().required("Current City is required"),
  currentState: Yup.string().required("Current State is required"),
  currentZip: Yup.string()
    .required("Current ZIP code is required")
    .matches(
      /^\d{5}(-\d{4})?$/,
      "ZIP code must be in format 12345 or 12345-6789"
    ),
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
    .test("future-date", "License must not be expired", function (value) {
      if (!value) return false;
      const expirationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return expirationDate >= today;
    }),
  medicalCardExpirationDate: Yup.string()
    .required("Medical Card Expiration Date is required")
    .test("future-date", "Medical Card must not be expired", function (value) {
      if (!value) return false;
      const expirationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return expirationDate >= today;
    }),
  licensePhoto: Yup.string()
    .nullable()
    .test("valid-image", "Please provide a valid image", function (value) {
      if (!value) return true; // Allow null/empty
      return value.startsWith("data:image/");
    }),
  medicalCardPhoto: Yup.string()
    .nullable()
    .test("valid-image", "Please provide a valid image", function (value) {
      if (!value) return true; // Allow null/empty
      return value.startsWith("data:image/");
    }),

  // Step 4: Address History
  addresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: Yup.string()
        .required("ZIP code is required")
        .matches(
          /^\d{5}(-\d{4})?$/,
          "ZIP code must be in format 12345 or 12345-6789"
        ),
      fromMonth: Yup.number().min(1).max(12).required("From Month is required"),
      fromYear: Yup.number().min(1900).required("From Year is required"),
      toMonth: Yup.number().min(1).max(12).required("To Month is required"),
      toYear: Yup.number().min(1900).required("To Year is required"),
    })
  ),

  // Step 5: Employment History
  jobs: Yup.array()
    .of(
      Yup.object().shape({
        employerName: Yup.string().required("Employer Name is required"),
        positionHeld: Yup.string().required("Position Held is required"),
        fromMonth: Yup.number()
          .min(1)
          .max(12)
          .required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    )
    .min(1, "At least one job is required"),

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
        function (value) {
          if (!value) return false;
          return value.startsWith("data:image/");
        }
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
        function (value) {
          if (!value) return false;
          return value.startsWith("data:image/");
        }
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
        function (value) {
          if (!value) return false;
          return value.startsWith("data:image/");
        }
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
        function (value) {
          if (!value) return false;
          return value.startsWith("data:image/");
        }
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
        function (value) {
          if (!value) return false;
          return value.startsWith("data:image/");
        }
      ),
  }),
});

export type DriverFormSchema = typeof completeFormSchema;
