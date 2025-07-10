# Supabase Setup Guide

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required for server-side operations)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Client-side environment variables (Optional, for future client-side operations)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Node Environment
NODE_ENV=development
```

## How to Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY` (for client-side)
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (for server-side)

## Database Setup

After setting up your environment variables, run the following command to create the database tables:

```bash
npm run db:push
```

This will create the `driver_applications` table with all the necessary columns based on your schema.

## Installation

Install the new dependencies:

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

## GraphQL API

The application now includes a GraphQL API alongside the existing REST API:

### GraphQL Endpoint

- **URL**: `http://localhost:5000/graphql`
- **GraphiQL Interface**: `http://localhost:5000/graphql` (in browser)

### Available Queries

#### Get All Driver Applications

```graphql
query {
  driverApplications {
    id
    firstName
    lastName
    email
    phone
    positionAppliedFor
    backgroundCheckStatus
    submittedAt
  }
}
```

#### Get Single Driver Application

```graphql
query {
  driverApplication(id: "1") {
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
    licenseNumber
    licenseState
    positionAppliedFor
    addresses
    jobs
    backgroundCheckStatus
    backgroundCheckResults
    submittedAt
  }
}
```

### Available Mutations

#### Create Driver Application

```graphql
mutation {
  createDriverApplication(
    input: {
      firstName: "John"
      lastName: "Doe"
      dob: "1990-01-01"
      phone: "555-123-4567"
      email: "john@example.com"
      currentAddress: "123 Main St"
      currentCity: "Anytown"
      currentState: "CA"
      currentZip: "12345"
      currentAddressFromMonth: 1
      currentAddressFromYear: 2020
      licenseNumber: "DL123456789"
      licenseState: "CA"
      positionAppliedFor: "Truck Driver"
      addresses: [
        {
          address: "123 Main St"
          city: "Anytown"
          state: "CA"
          zip: "12345"
          fromMonth: 1
          fromYear: 2020
          toMonth: 12
          toYear: 2023
        }
      ]
      jobs: [
        {
          employerName: "Previous Company"
          positionHeld: "Driver"
          fromMonth: 1
          fromYear: 2018
          toMonth: 12
          toYear: 2022
        }
      ]
      socialSecurityNumber: "123-45-6789"
      consentToBackgroundCheck: 1
    }
  ) {
    id
    firstName
    lastName
    email
    backgroundCheckStatus
    submittedAt
  }
}
```

#### Update Background Check Status

```graphql
mutation {
  updateBackgroundCheckStatus(id: "1", status: "completed") {
    id
    backgroundCheckStatus
    backgroundCheckResults
    backgroundCheckCompletedAt
  }
}
```

## Frontend GraphQL Usage

The frontend includes GraphQL hooks for easy integration:

```typescript
import {
  useDriverApplications,
  useCreateDriverApplication,
} from "@/hooks/useGraphQL";

// In your component
const { applications, loading, error } = useDriverApplications();
const { createApplication, loading: creating } = useCreateDriverApplication();

// Create a new application
const handleSubmit = async (formData) => {
  const result = await createApplication(formData);
  if (result.data) {
    // Success!
  }
};
```

## Important Notes

- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges and should never be exposed to the client
- The `VITE_SUPABASE_ANON_KEY` is safe to use in client-side code
- Make sure to add `.env` to your `.gitignore` file to keep your keys secure
- Both REST API and GraphQL API are available - you can use either or both
- GraphiQL interface is enabled for development and testing
