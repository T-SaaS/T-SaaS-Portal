# Supabase + GraphQL Setup Guide

This guide will help you set up Supabase as the database and add GraphQL support to the Driver Qualification Tool.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Client-side Supabase (optional, for direct client access)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development
NODE_ENV=development
REPL_ID=your_replit_id (optional)
```

## Supabase Setup

1. **Create a Supabase Project:**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and service role key

2. **Database Schema:**
   The schema is defined in `shared/schema.ts` and will be automatically created when you run the application.

3. **Environment Variables:**
   - Copy your Supabase project URL to `SUPABASE_URL`
   - Copy your service role key to `SUPABASE_SERVICE_ROLE_KEY`

## Database Architecture

The project uses **Supabase directly** without additional ORM layers:

- **Database:** Supabase PostgreSQL
- **Client:** `@supabase/supabase-js`
- **Operations:** Direct Supabase queries in `server/db.ts`
- **Schema:** TypeScript types in `shared/schema.ts`

### Database Operations

All database operations are handled through the `db` object in `server/db.ts`:

```typescript
// Create a new driver application
const application = await db.createDriverApplication(data);

// Get all applications
const applications = await db.getAllDriverApplications();

// Get a specific application
const application = await db.getDriverApplication(id);

// Update an application
const updated = await db.updateDriverApplication(id, updates);
```

## GraphQL Setup

The project uses **Apollo Server** for the backend and **Apollo Client** for the frontend.

### Backend (Apollo Server)

- **Location:** `server/graphql/schema.ts`
- **Endpoint:** `http://localhost:3001/graphql`
- **Features:**
  - Full CRUD operations for driver applications
  - Real-time background check status updates
  - Type-safe schema with TypeScript

### Frontend (Apollo Client)

- **Location:** `client/src/lib/graphql.ts`
- **Hooks:** `client/src/hooks/useGraphQL.ts`
- **Queries:** `client/src/lib/queries.ts`

## Usage Examples

### Query Driver Applications

```typescript
import { useDriverApplications } from "./hooks/useGraphQL";

function DriverList() {
  const { data, loading, error } = useDriverApplications();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.driverApplications.map((app) => (
        <div key={app.id}>
          {app.firstName} {app.lastName}
        </div>
      ))}
    </div>
  );
}
```

### Create Driver Application

```typescript
import { useCreateDriverApplication } from "./hooks/useGraphQL";

function CreateForm() {
  const [createApplication, { loading }] = useCreateDriverApplication();

  const handleSubmit = async (formData) => {
    try {
      const result = await createApplication({
        variables: {
          input: formData,
        },
      });
      console.log("Created:", result.data.createDriverApplication);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Submit Application"}
      </button>
    </form>
  );
}
```

### Update Background Check Status

```typescript
import { useUpdateBackgroundCheckStatus } from "./hooks/useGraphQL";

function StatusUpdate({ applicationId }) {
  const [updateStatus, { loading }] = useUpdateBackgroundCheckStatus();

  const handleStatusUpdate = async (status) => {
    try {
      await updateStatus({
        variables: {
          id: applicationId,
          status: status,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={() => handleStatusUpdate("completed")} disabled={loading}>
      {loading ? "Updating..." : "Mark as Completed"}
    </button>
  );
}
```

## GraphQL Schema

The GraphQL schema includes:

- **DriverApplication:** Complete driver application data
- **Address:** Previous addresses with date ranges
- **Job:** Employment history
- **BackgroundCheckResult:** Detailed background check results
- **DrivingRecord:** Driving violations and suspensions
- **EmploymentVerification:** Employment verification status
- **DrugTest:** Drug test results

## Available Operations

### Queries

- `driverApplications`: Get all driver applications
- `driverApplication(id: ID!)`: Get a specific driver application

### Mutations

- `createDriverApplication(input: CreateDriverApplicationInput!)`: Create a new application
- `updateBackgroundCheckStatus(id: ID!, status: String!)`: Update background check status

## Development

1. **Start the server:**

   ```bash
   npm run dev:server
   ```

2. **Start the client:**

   ```bash
   npm run dev:client
   ```

3. **Access GraphQL Playground:**
   - Go to `http://localhost:3001/graphql`
   - Use the built-in GraphQL playground to test queries and mutations

## Architecture Benefits

### Simplified Stack

- ✅ **Supabase Only:** No additional ORM layers
- ✅ **Direct Queries:** Faster and more predictable
- ✅ **Type Safety:** Full TypeScript support
- ✅ **Real-time:** Built-in Supabase real-time features
- ✅ **Auth Ready:** Supabase auth integration ready

### Removed Dependencies

- ❌ **Drizzle ORM:** No longer needed
- ❌ **Postgres Driver:** Supabase handles connections
- ❌ **Complex Schema Management:** Supabase handles migrations

## Troubleshooting

### Common Issues

1. **Database Connection Error:**

   - Verify your Supabase credentials
   - Check that your IP is allowed in Supabase settings

2. **GraphQL Endpoint Not Found:**

   - Ensure the server is running on port 3001
   - Check that Apollo Server is properly configured

3. **Type Errors:**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all dependencies are installed

### Getting Help

- Check the Apollo Server documentation: [apollographql.com/docs/apollo-server](https://www.apollographql.com/docs/apollo-server/)
- Check the Apollo Client documentation: [apollographql.com/docs/react](https://www.apollographql.com/docs/react/)
- Review the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
