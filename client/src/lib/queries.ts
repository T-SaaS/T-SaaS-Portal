import { gql } from "@apollo/client";

export const GET_DRIVER_APPLICATIONS = gql`
  query GetDriverApplications {
    driverApplications {
      id
      firstName
      lastName
      dob
      phone
      email
      currentAddress
      currentCity
      currentState
      currentZip
      currentAddressFromMonth
      currentAddressFromYear
      licenseNumber
      licenseState
      positionAppliedFor
      addresses
      jobs
      socialSecurityNumber
      consentToBackgroundCheck
      backgroundCheckStatus
      backgroundCheckResults
      backgroundCheckCompletedAt
      submittedAt
    }
  }
`;

export const GET_DRIVER_APPLICATION = gql`
  query GetDriverApplication($id: ID!) {
    driverApplication(id: $id) {
      id
      firstName
      lastName
      dob
      phone
      email
      currentAddress
      currentCity
      currentState
      currentZip
      currentAddressFromMonth
      currentAddressFromYear
      licenseNumber
      licenseState
      positionAppliedFor
      addresses
      jobs
      socialSecurityNumber
      consentToBackgroundCheck
      backgroundCheckStatus
      backgroundCheckResults
      backgroundCheckCompletedAt
      submittedAt
    }
  }
`;

export const CREATE_DRIVER_APPLICATION = gql`
  mutation CreateDriverApplication($input: CreateDriverApplicationInput!) {
    createDriverApplication(input: $input) {
      id
      firstName
      lastName
      dob
      phone
      email
      currentAddress
      currentCity
      currentState
      currentZip
      currentAddressFromMonth
      currentAddressFromYear
      licenseNumber
      licenseState
      positionAppliedFor
      addresses
      jobs
      socialSecurityNumber
      consentToBackgroundCheck
      backgroundCheckStatus
      backgroundCheckResults
      backgroundCheckCompletedAt
      submittedAt
    }
  }
`;

export const UPDATE_BACKGROUND_CHECK_STATUS = gql`
  mutation UpdateBackgroundCheckStatus($id: ID!, $status: String!) {
    updateBackgroundCheckStatus(id: $id, status: $status) {
      id
      backgroundCheckStatus
      backgroundCheckCompletedAt
    }
  }
`;
