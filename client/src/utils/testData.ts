import type { DriverFormValues } from "@/types/driverApplicationForm";

export const testDriverData: DriverFormValues = {
  // Step 1: Personal Information
  firstName: "John",
  lastName: "Smith",
  dob: "1985-06-15",

  // Step 2: Contact & Address
  phone: "(555) 123-4567",
  email: "john.smith@email.com",
  currentAddress: "123 Main Street",
  currentCity: "San Francisco",
  currentState: "CA",
  currentZip: "94102",
  currentAddressFromMonth: 3,
  currentAddressFromYear: 2022,

  // Step 3: License Information
  licenseNumber: "D123456789",
  licenseState: "CA",
  positionAppliedFor: "regional-driver",

  // Step 4: Address History
  addresses: [
    {
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      fromMonth: 1,
      fromYear: 2020,
      toMonth: 2,
      toYear: 2022,
    },
    {
      address: "789 Pine Street",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      fromMonth: 6,
      fromYear: 2018,
      toMonth: 12,
      toYear: 2019,
    },
  ],

  // Step 5: Employment History
  jobs: [
    {
      employerName: "ABC Transportation",
      positionHeld: "Delivery Driver",
      businessName: "ABC Transportation",
      companyEmail: "abc@transportation.com",
      fromMonth: 1,
      fromYear: 2021,
      toMonth: 12,
      toYear: 2023,
    },
    {
      employerName: "XYZ Logistics",
      positionHeld: "Warehouse Associate",
      businessName: "XYZ Logistics",
      companyEmail: "xyz@logistics.com",
      fromMonth: 3,
      fromYear: 2019,
      toMonth: 12,
      toYear: 2020,
    },
    {
      employerName: "Fast Freight Inc",
      positionHeld: "Truck Driver",
      businessName: "Fast Freight Inc",
      companyEmail: "fast@freight.com",
      fromMonth: 1,
      fromYear: 2017,
      toMonth: 2,
      toYear: 2019,
    },
  ],

  // Step 6: Background Check
  socialSecurityNumber: "123-45-6789",
  consentToBackgroundCheck: 1,
};

// Alternative test data with different scenarios
export const testDriverDataMinimal: DriverFormValues = {
  // Step 1: Personal Information
  firstName: "Jane",
  lastName: "Doe",
  dob: "1990-03-20",

  // Step 2: Contact & Address
  phone: "(555) 987-6543",
  email: "jane.doe@email.com",
  currentAddress: "321 Elm Street",
  currentCity: "New York",
  currentState: "NY",
  currentZip: "10001",
  currentAddressFromMonth: 1,
  currentAddressFromYear: 2020, // 4+ years ago, so no address history needed

  // Step 3: License Information
  licenseNumber: "D987654321",
  licenseState: "NY",
  positionAppliedFor: "delivery-driver",

  // Step 4: Address History (empty since current address is 4+ years)
  addresses: [],

  // Step 5: Employment History
  jobs: [
    {
      employerName: "Metro Delivery", 
      positionHeld: "Driver",
      businessName: "Metro Delivery",
      companyEmail: "metro@delivery.com",
      fromMonth: 1,
      fromYear: 2020,
      toMonth: 12,
      toYear: 2023,
    },
  ],

  // Step 6: Background Check
  socialSecurityNumber: "987-65-4321",
  consentToBackgroundCheck: 1,
};

// Test data with gaps in employment/address history
export const testDriverDataWithGaps: DriverFormValues = {
  // Step 1: Personal Information
  firstName: "Bob",
  lastName: "Johnson",
  dob: "1988-11-10",

  // Step 2: Contact & Address
  phone: "(555) 456-7890",
  email: "bob.johnson@email.com",
  currentAddress: "654 Maple Drive",
  currentCity: "Chicago",
  currentState: "IL",
  currentZip: "60601",
  currentAddressFromMonth: 6,
  currentAddressFromYear: 2023,

  // Step 3: License Information
  licenseNumber: "D456789123",
  licenseState: "IL",
  positionAppliedFor: "local-driver",

  // Step 4: Address History
  addresses: [
    {
      address: "321 Oak Lane",
      city: "Chicago",
      state: "IL",
      zip: "60602",
      fromMonth: 1,
      fromYear: 2022,
      toMonth: 5,
      toYear: 2023,
    },
  ],

  // Step 5: Employment History (with gaps)
  jobs: [
    {
      employerName: "City Transport",
      positionHeld: "Driver",
      businessName: "City Transport",
      companyEmail: "city@transport.com",
      fromMonth: 1,
      fromYear: 2023,
      toMonth: 6,
      toYear: 2023,
    },
    {
      employerName: "Regional Hauling",
      positionHeld: "Truck Driver",
      businessName: "Regional Hauling",
      companyEmail: "regional@hauling.com",
      fromMonth: 1,
      fromYear: 2021,
      toMonth: 8,
      toYear: 2022,
    },
  ],

  // Step 6: Background Check
  socialSecurityNumber: "456-78-9012",
  consentToBackgroundCheck: 1,
};

// Function to load test data into form
export const loadTestData = (
  form: any,
  dataType: "full" | "minimal" | "gaps" = "full"
) => {
  let testData: DriverFormValues;

  switch (dataType) {
    case "minimal":
      testData = testDriverDataMinimal;
      break;
    case "gaps":
      testData = testDriverDataWithGaps;
      break;
    default:
      testData = testDriverData;
  }

  // Reset form and load test data
  form.reset(testData);

  // Force form to re-render with new values
  Object.keys(testData).forEach((key) => {
    if (key === "addresses" || key === "jobs") {
      // Handle field arrays separately
      form.setValue(key, testData[key as keyof DriverFormValues]);
    } else {
      form.setValue(
        key as keyof DriverFormValues,
        testData[key as keyof DriverFormValues]
      );
    }
  });

  return testData;
};
