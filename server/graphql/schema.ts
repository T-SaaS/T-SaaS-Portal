import type { DriverApplication } from "@shared/schema";
import { gql } from "graphql-tag";
import { db } from "../db";

// Define the GraphQL schema using SDL (Schema Definition Language)
export const typeDefs = gql`
  type DriverApplication {
    id: ID!
    firstName: String!
    lastName: String!
    dob: String!
    phone: String!
    email: String!
    currentAddress: String!
    currentCity: String!
    currentState: String!
    currentZip: String!
    currentAddressFromMonth: Int!
    currentAddressFromYear: Int!
    licenseNumber: String!
    licenseState: String!
    positionAppliedFor: String!
    addresses: [Address!]!
    jobs: [Job!]!
    socialSecurityNumber: String!
    consentToBackgroundCheck: Int!
    backgroundCheckStatus: String
    backgroundCheckResults: BackgroundCheckResult
    backgroundCheckCompletedAt: String
    submittedAt: String!
  }

  type Address {
    address: String!
    city: String!
    state: String!
    zip: String!
    fromMonth: Int!
    fromYear: Int!
    toMonth: Int!
    toYear: Int!
  }

  type Job {
    employerName: String!
    positionHeld: String!
    fromMonth: Int!
    fromYear: Int!
    toMonth: Int!
    toYear: Int!
  }

  type BackgroundCheckResult {
    criminalHistory: Boolean!
    drivingRecord: DrivingRecord!
    employmentVerification: EmploymentVerification!
    drugTest: DrugTest!
  }

  type DrivingRecord {
    violations: [Violation!]!
    suspensions: [Suspension!]!
    overallScore: String!
  }

  type Violation {
    type: String!
    date: String!
    severity: String!
  }

  type Suspension {
    reason: String!
    startDate: String!
    endDate: String!
  }

  type EmploymentVerification {
    verified: Boolean!
    discrepancies: [String!]!
  }

  type DrugTest {
    status: String!
    completedAt: String
  }

  input AddressInput {
    address: String!
    city: String!
    state: String!
    zip: String!
    fromMonth: Int!
    fromYear: Int!
    toMonth: Int!
    toYear: Int!
  }

  input JobInput {
    employerName: String!
    positionHeld: String!
    fromMonth: Int!
    fromYear: Int!
    toMonth: Int!
    toYear: Int!
  }

  input CreateDriverApplicationInput {
    firstName: String!
    lastName: String!
    dob: String!
    phone: String!
    email: String!
    currentAddress: String!
    currentCity: String!
    currentState: String!
    currentZip: String!
    currentAddressFromMonth: Int!
    currentAddressFromYear: Int!
    licenseNumber: String!
    licenseState: String!
    positionAppliedFor: String!
    addresses: [AddressInput!]!
    jobs: [JobInput!]!
    socialSecurityNumber: String!
    consentToBackgroundCheck: Int!
  }

  type Query {
    driverApplications: [DriverApplication!]!
    driverApplication(id: ID!): DriverApplication
  }

  type Mutation {
    createDriverApplication(
      input: CreateDriverApplicationInput!
    ): DriverApplication!
    updateBackgroundCheckStatus(id: ID!, status: String!): DriverApplication!
  }
`;

// Define resolvers
export const resolvers = {
  Query: {
    driverApplications: async () => {
      return await db.getAllDriverApplications();
    },
    driverApplication: async (_: any, { id }: { id: string }) => {
      return await db.getDriverApplication(id);
    },
  },
  Mutation: {
    createDriverApplication: async (_: any, { input }: { input: any }) => {
      return await db.createDriverApplication(input);
    },
    updateBackgroundCheckStatus: async (
      _: any,
      { id, status }: { id: string; status: string }
    ) => {
      return await db.updateDriverApplication(id, {
        background_check_status: status,
        background_check_completed_at: new Date().toISOString(),
      });
    },
  },
  DriverApplication: {
    id: (parent: DriverApplication) => parent.id.toString(),
    submittedAt: (parent: DriverApplication) => parent.submitted_at,
    backgroundCheckCompletedAt: (parent: DriverApplication) =>
      parent.background_check_completed_at,
  },
};
