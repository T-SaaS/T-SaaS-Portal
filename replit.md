# Driver Application System

## Overview

This is a full-stack web application for managing driver applications. The system features a modern React frontend with a multi-step form for driver applications and an Express.js backend with RESTful API endpoints. The application uses a PostgreSQL database via Drizzle ORM for data persistence, with shadcn/ui components for a polished user interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Management**: React Hook Form with Yup validation
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Storage**: PostgreSQL database with DatabaseStorage implementation

## Key Components

### Database Schema
- **Driver Applications Table**: Stores comprehensive driver application data
  - Personal information (name, DOB, contact details)
  - Current address information with move-in date
  - License information (number, state, position applied for)
  - Address history (JSON array with date ranges) - conditional based on residency
  - Employment history (JSON array with date ranges)
  - Background check information (SSN, consent, status, results)
  - Submission timestamp

### Background Check Integration
- **Automated Processing**: Background checks initiate automatically after form submission
- **Status Tracking**: Real-time status updates (pending, in_progress, completed, failed)
- **Comprehensive Results**: Criminal history, driving record, employment verification, drug testing
- **Service Architecture**: Dedicated background check service with mock API integration

### API Endpoints
- `POST /api/driver-applications` - Submit new driver application
- `GET /api/driver-applications` - Retrieve all applications
- `GET /api/driver-applications/:id` - Retrieve specific application

### Frontend Components
- **Multi-step Form**: Progressive form with 6 steps and intelligent navigation
- **Current Address Collection**: Integrated into contact information step
- **Smart Address History**: Conditional step based on 3-year residency requirement
- **Residency Gap Detection**: Validates 3-year address history completeness
- **Employment Gap Detection**: Validates 36-month employment history with gap acknowledgment
- **Background Check Integration**: SSN collection with auto-formatting and comprehensive consent
- **Dynamic Field Arrays**: Address and employment history management
- **Progress Tracking**: Visual progress indicator with conditional steps
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. User fills out multi-step driver application form
2. Form data is validated at each step using Yup schemas
3. Complete form submission triggers API call to backend
4. Backend validates data using Drizzle-Zod schemas
5. Data is stored in PostgreSQL database
6. Success/error response is returned to frontend
7. User receives confirmation or error feedback

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Database migration and schema management

### UI Components
- **shadcn/ui**: Complete component library built on Radix UI
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development
- Vite dev server for frontend with hot module replacement
- tsx for running TypeScript server with auto-reload
- PostgreSQL database for persistent data storage

### Production
- Frontend built and served as static files
- Backend bundled with esbuild for optimal performance
- PostgreSQL database for persistent data storage
- Environment-based configuration for database connections

### Build Process
1. Frontend: `vite build` - Creates optimized static assets
2. Backend: `esbuild` - Bundles server code for production
3. Database: `drizzle-kit push` - Applies schema migrations

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Added current address collection at stage 2 with move-in date
- July 07, 2025. Implemented smart residency gap detection (3-year requirement)
- July 07, 2025. Added conditional address history step based on residency duration
- July 07, 2025. Integrated PostgreSQL database with Drizzle ORM
- July 07, 2025. Added comprehensive background check integration (Step 6)
- July 07, 2025. Added SSN collection with auto-formatting and consent forms
- July 07, 2025. Built background check service with automatic processing
- July 07, 2025. Fixed employment gap handling to allow submission with gaps
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```