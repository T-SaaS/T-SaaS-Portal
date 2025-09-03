# DriverQualificationTool - Comprehensive Tech Stack Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Technology Stack](#frontend-technology-stack)
4. [Backend Technology Stack](#backend-technology-stack)
5. [Database & Storage](#database--storage)
6. [Authentication & Security](#authentication--security)
7. [API Architecture](#api-architecture)
8. [Development Tools & Configuration](#development-tools--configuration)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Third-Party Integrations](#third-party-integrations)
11. [Performance & Optimization](#performance--optimization)
12. [Security Features](#security-features)
13. [Development Workflow](#development-workflow)

## 🎯 Overview

The DriverQualificationTool is a comprehensive full-stack TypeScript application designed for managing driver qualification applications. It features real-time form validation, background checks, administrative oversight, email notifications, and PDF generation capabilities.

### Key Characteristics
- **Full-Stack TypeScript**: End-to-end type safety
- **Modern React Architecture**: Component-based with hooks
- **Real-time Capabilities**: Live updates and notifications
- **Mobile-First Design**: Responsive across all devices
- **Secure Draft System**: Token-based draft saving and resuming
- **Comprehensive PDF Generation**: Client-side PDF creation and viewing

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Express/     │◄──►│   (Supabase     │
│   Port: 3000    │    │   Apollo)       │    │   PostgreSQL)   │
│                 │    │   Port: 5000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Assets │    │   Email Service │    │   File Storage  │
│   (Vite Build)  │    │   (ZeptoMail)   │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Project Structure
```
DriverQualificationTool/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── atoms/         # Atomic UI components (Button, Input, Label)
│   │   ├── molecules/     # Molecular components (FormField, StatusBadge)
│   │   ├── organisms/     # Complex components (ApplicationCard, ProgressStepper)
│   │   ├── templates/     # Page layouts (ExternalTemplate, PrivateTemplate)
│   │   ├── pages/         # Page components (DriverForm, Dashboard)
│   │   ├── components/    # Reusable UI components and utilities
│   │   │   └── pdf/       # PDF generation and viewing components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts (Auth, Company)
│   │   ├── lib/           # Utility libraries (Supabase, QueryClient)
│   │   ├── services/      # API services and PDF service
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── routes/        # Routing configuration
│   ├── public/            # Static assets
│   └── index.html         # HTML entry point
├── server/                # Backend Node.js application
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── services/         # Business logic services
│   │   ├── emailService.ts
│   │   ├── emailTemplates.ts
│   │   ├── applicationStatusService.ts
│   │   ├── draftService.ts
│   │   └── loggingService.ts
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # REST API routes
│   ├── db.ts             # Database configuration
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript types and schemas
│   ├── schema.ts         # Shared validation schemas
│   └── utilities/        # Shared utility functions
├── scripts/              # Build and utility scripts
├── docs/                 # Documentation
└── package.json          # Root package.json with scripts
```

## 🎨 Frontend Technology Stack

### Core Framework & Runtime
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.6.3** - Type safety and enhanced developer experience
- **Vite 6.3.5** - Fast build tool and development server
- **Node.js 18+** - Runtime environment requirement

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Modern component library built on Radix UI
- **Radix UI** - Comprehensive set of accessible component primitives:
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-toast` - Toast notifications
  - `@radix-ui/react-accordion` - Collapsible content
  - `@radix-ui/react-avatar` - User avatars
  - `@radix-ui/react-checkbox` - Checkbox inputs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-popover` - Popover components
  - `@radix-ui/react-progress` - Progress indicators
  - `@radix-ui/react-radio-group` - Radio button groups
  - `@radix-ui/react-slider` - Range sliders
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-tooltip` - Tooltip components
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-separator` - Visual separators
  - `@radix-ui/react-scroll-area` - Custom scrollbars
  - `@radix-ui/react-navigation-menu` - Navigation components
  - `@radix-ui/react-menubar` - Menu bars
  - `@radix-ui/react-context-menu` - Context menus
  - `@radix-ui/react-hover-card` - Hover cards
  - `@radix-ui/react-alert-dialog` - Alert dialogs
  - `@radix-ui/react-aspect-ratio` - Aspect ratio containers
  - `@radix-ui/react-collapsible` - Collapsible content
  - `@radix-ui/react-slot` - Polymorphic components
  - `@radix-ui/react-toggle` - Toggle buttons
  - `@radix-ui/react-toggle-group` - Toggle groups

### State Management & Data Fetching
- **React Query (TanStack Query) 5.60.5** - Server state management
- **Apollo Client 3.13.8** - GraphQL client for data fetching
- **React Context API** - Local state management for auth and company data

### Form Management & Validation
- **React Hook Form 7.55.0** - Performant form library
- **Zod 3.24.2** - TypeScript-first schema validation
- **@hookform/resolvers 3.10.0** - Form validation resolvers
- **zod-validation-error 3.4.0** - Enhanced Zod error messages

### Routing & Navigation
- **React Router DOM 7.6.3** - Client-side routing
- **Wouter 3.3.5** - Lightweight routing alternative

### Animation & Interactions
- **Framer Motion 11.13.1** - Production-ready motion library
- **tailwindcss-animate 1.0.7** - Tailwind CSS animations
- **tw-animate-css 1.2.5** - Additional Tailwind animations

### Icons & Visual Elements
- **Lucide React 0.453.0** - Beautiful & consistent icon toolkit
- **React Icons 5.4.0** - Popular icon libraries
- **Embla Carousel React 8.6.0** - Carousel component
- **Recharts 2.15.2** - Composable charting library

### Specialized Components
- **React Webcam 7.2.0** - Webcam integration for photo capture
- **Signature Pad 5.0.10** - Digital signature collection
- **React Dropzone 14.3.8** - File drag-and-drop functionality
- **React Day Picker 8.10.1** - Date picker component
- **Input OTP 1.4.2** - One-time password input
- **React Resizable Panels 2.1.7** - Resizable panel layouts
- **Vaul 1.1.2** - Drawer component
- **CMDK 1.1.1** - Command palette component

### PDF Generation & Document Handling
- **@react-pdf/renderer 4.3.0** - Client-side PDF generation
- **@react-pdf/renderer** - PDF viewing and manipulation

### Utility Libraries
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 2.6.0** - Tailwind class merging
- **class-variance-authority 0.7.1** - Component variant management
- **date-fns 3.6.0** - Modern JavaScript date utility library
- **dayjs 1.11.13** - Minimalist JavaScript date library
- **nanoid 5.1.5** - Tiny, secure, URL-friendly unique string ID generator

### Theme & Styling
- **next-themes 0.4.6** - Theme management (dark/light mode)
- **@tailwindcss/typography 0.5.15** - Typography plugin for Tailwind

## ⚙️ Backend Technology Stack

### Core Framework & Runtime
- **Node.js 18+** - JavaScript runtime environment
- **Express 4.21.2** - Fast, unopinionated web framework
- **TypeScript 5.6.3** - Type safety for server-side code
- **Nodemon 3.1.10** - Development server with auto-restart

### API Architecture
- **Apollo Server 4.12.2** - GraphQL server implementation
- **GraphQL 16.11.0** - Query language and runtime
- **graphql-tag 2.12.6** - GraphQL query parsing
- **REST API** - Traditional REST endpoints alongside GraphQL

### Database & ORM
- **Supabase 2.50.5** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Primary database (via Supabase)
- **Row Level Security (RLS)** - Database-level security policies

### Authentication & Session Management
- **Passport 0.7.0** - Authentication middleware
- **Passport Local 1.0.0** - Local username/password strategy
- **Express Session 1.18.1** - Session middleware
- **Connect PG Simple 10.0.0** - PostgreSQL session store
- **Memorystore 1.6.7** - In-memory session store (development)

### Security & Middleware
- **Helmet 8.0.0** - Security headers middleware
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Express Rate Limit 8.0.1** - Rate limiting middleware
- **Compression 1.7.4** - Response compression

### Email Service
- **ZeptoMail 6.2.1** - Transactional email service
- **Custom Email Templates** - HTML email templates with company branding

### Development Tools
- **TSX 4.19.1** - TypeScript execution for Node.js
- **ESBuild 0.25.0** - Fast JavaScript bundler
- **Concurrently 9.2.0** - Run multiple commands concurrently
- **Cross-env 10.0.0** - Cross-platform environment variables

### Utility Libraries
- **dotenv 17.2.0** - Environment variable loading
- **Terser 5.28.1** - JavaScript minifier
- **WebSocket (ws) 8.18.0** - WebSocket implementation

## 🗄️ Database & Storage

### Primary Database
- **Supabase PostgreSQL** - Fully managed PostgreSQL database
- **Real-time Subscriptions** - Live data updates
- **Row Level Security (RLS)** - Database-level access control
- **Automatic Backups** - Point-in-time recovery

### Database Schema
```sql
-- Core Tables
driver_applications          -- Main application data
address_history             -- Driver address history with gap detection
employment_history          -- Driver employment history with overlap detection
background_checks           -- Background check results and status
users                       -- User accounts (Supabase Auth)
companies                   -- Company information and settings

-- Draft System Tables
draft_tokens                -- Secure draft access tokens
draft_sessions              -- Draft session tracking
```

### File Storage
- **Supabase Storage** - Object storage for files
- **Public Buckets** - Publicly accessible files (signatures, documents)
- **Private Buckets** - Secure file storage with access controls
- **File Types Supported**:
  - Images (JPEG, PNG, WebP)
  - Documents (PDF, DOC, DOCX)
  - Signatures (PNG, SVG)

### Data Security Features
- **Encryption at Rest** - All data encrypted in database
- **Encryption in Transit** - SSL/TLS for all connections
- **Access Control** - Row-level security policies
- **Audit Logging** - Comprehensive activity logging

## 🔐 Authentication & Security

### Authentication System
- **Supabase Auth** - Managed authentication service
- **Email/Password Authentication** - Traditional login method
- **Session Management** - Secure session handling
- **Role-Based Access Control** - Admin/User role separation

### Security Features
- **Rate Limiting** - API endpoint protection
- **CORS Configuration** - Cross-origin request control
- **Security Headers** - Helmet.js security middleware
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Content Security Policy

### Draft System Security
- **Cryptographic Tokens** - 64-character random tokens
- **Token Hashing** - SHA-256 hash storage
- **Time-based Expiry** - 7-day automatic expiration
- **IP Tracking** - Security monitoring
- **Magic Link System** - Secure email-based access

## 🔌 API Architecture

### GraphQL API
- **Endpoint**: `/graphql`
- **GraphiQL Interface** - Interactive query explorer
- **Schema-First Design** - Type-safe API development
- **Real-time Subscriptions** - Live data updates

#### Key Queries
```graphql
# Get all driver applications
query GetDriverApplications {
  driverApplications {
    id
    firstName
    lastName
    email
    backgroundCheckStatus
    submittedAt
  }
}

# Get single application with full details
query GetDriverApplication($id: ID!) {
  driverApplication(id: $id) {
    id
    firstName
    lastName
    addresses
    jobs
    backgroundCheckResults
  }
}
```

#### Key Mutations
```graphql
# Create new driver application
mutation CreateDriverApplication($input: DriverApplicationInput!) {
  createDriverApplication(input: $input) {
    id
    backgroundCheckStatus
  }
}

# Update background check status
mutation UpdateBackgroundCheck($id: ID!, $status: String!) {
  updateBackgroundCheckStatus(id: $id, status: $status) {
    id
    backgroundCheckStatus
  }
}
```

### REST API
- **Base URL**: `/api/v1`
- **RESTful Design** - Standard HTTP methods
- **JSON Responses** - Consistent response format
- **Error Handling** - Standardized error responses

#### Key Endpoints
```
GET    /api/v1/driver-applications          # List applications
POST   /api/v1/driver-applications          # Create application
GET    /api/v1/driver-applications/:id      # Get application
PUT    /api/v1/driver-applications/:id      # Update application
DELETE /api/v1/driver-applications/:id      # Delete application

POST   /api/v1/driver-applications/draft    # Save draft
GET    /api/v1/driver-applications/draft/resume # Resume draft

POST   /api/v1/auth/login                   # User login
POST   /api/v1/auth/logout                  # User logout
GET    /api/v1/auth/me                      # Get current user
```

## 🛠️ Development Tools & Configuration

### Build Tools
- **Vite 6.3.5** - Fast build tool and dev server
- **TypeScript 5.6.3** - Type checking and compilation
- **ESBuild 0.25.0** - Fast JavaScript bundler
- **Terser 5.28.1** - Production minification

### Development Configuration
- **TypeScript Config**:
  - `tsconfig.json` - Main TypeScript configuration
  - `tsconfig.server.json` - Server-specific configuration
- **Vite Config** - Build optimization and development server
- **Tailwind Config** - CSS framework configuration
- **PostCSS Config** - CSS processing configuration

### Code Quality
- **TypeScript Strict Mode** - Enhanced type checking
- **ESLint** - Code linting (configured)
- **Prettier** - Code formatting (configured)
- **Path Mapping** - Clean import paths with aliases

### Development Scripts
```json
{
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
  "dev:server": "nodemon",
  "dev:client": "vite",
  "build": "npm run build:client && npm run build:server",
  "build:client": "vite build",
  "build:server": "tsc --project tsconfig.server.json",
  "start": "node dist/server/index.js"
}
```

## 🚀 Deployment & Infrastructure

### Deployment Platform
- **Render** - Primary deployment platform
- **Configuration**: `render.yaml` - Infrastructure as Code
- **Auto-deployment** - GitHub integration
- **Health Checks** - `/api/health` endpoint monitoring

### Environment Configuration
```yaml
# Production Environment Variables
NODE_ENV: production
PORT: 10000
SUPABASE_URL: ${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
ZEPTOMAIL_API_KEY: ${ZEPTOMAIL_API_KEY}
COMPANY_NAME: TruckingMBA
```

### Build Process
1. **Client Build** - Vite production build
2. **Server Build** - TypeScript compilation
3. **Asset Optimization** - Minification and compression
4. **Static Asset Serving** - Express static file serving

### Alternative Deployment Options
- **Netlify** - Frontend static hosting
- **Vercel** - Full-stack deployment
- **AWS S3 + CloudFront** - Scalable static hosting
- **DigitalOcean App Platform** - Container deployment
- **Heroku** - Platform as a Service

## 🔗 Third-Party Integrations

### Email Service
- **ZeptoMail** - Transactional email delivery
- **Features**:
  - HTML email templates
  - Company branding
  - Delivery tracking
  - Bounce handling

### Database & Backend
- **Supabase** - Backend-as-a-Service
- **Features**:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Row Level Security

### Development & Deployment
- **GitHub** - Version control and CI/CD
- **Render** - Hosting and deployment
- **Vercel** - Alternative deployment option

## ⚡ Performance & Optimization

### Frontend Optimization
- **Code Splitting** - Dynamic imports and lazy loading
- **Bundle Optimization** - Manual chunk configuration
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image compression and lazy loading
- **Caching Strategy** - Browser and CDN caching

### Backend Optimization
- **Response Compression** - Gzip compression
- **Database Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Rate Limiting** - API protection and performance

### Build Optimization
```typescript
// Vite build configuration
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom"],
        ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
        pdf: ["@react-pdf/renderer"]
      }
    }
  },
  minify: "terser",
  target: "es2015"
}
```

## 🔒 Security Features

### Application Security
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Content Security Policy
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API abuse prevention

### Data Security
- **Encryption at Rest** - Database encryption
- **Encryption in Transit** - SSL/TLS connections
- **Secure Headers** - Helmet.js security middleware
- **Session Security** - Secure session management
- **Token Security** - Cryptographic token generation

### Draft System Security
- **Token Hashing** - SHA-256 hash storage
- **Time-based Expiry** - Automatic token expiration
- **IP Tracking** - Security monitoring
- **Magic Link Security** - Secure email-based access

## 🔄 Development Workflow

### Local Development
1. **Environment Setup** - Install Node.js 18+
2. **Dependencies** - `npm install`
3. **Environment Variables** - Configure `.env` files
4. **Database Setup** - Supabase project configuration
5. **Development Server** - `npm run dev`

### Code Organization
- **Atomic Design** - Component architecture
- **TypeScript** - Type safety throughout
- **Shared Types** - Common type definitions
- **Service Layer** - Business logic separation
- **Utility Functions** - Reusable code organization

### Testing Strategy
- **Type Checking** - TypeScript compilation
- **Component Testing** - React component tests
- **API Testing** - GraphQL and REST endpoint tests
- **Integration Testing** - End-to-end workflows
- **Performance Testing** - Load and stress testing

### Version Control
- **Git** - Version control system
- **Conventional Commits** - Standardized commit messages
- **Branch Strategy** - Feature branch workflow
- **Pull Requests** - Code review process

---

## 📚 Additional Resources

- **README.md** - Project overview and setup instructions
- **SUPABASE_SETUP.md** - Database configuration guide
- **docs/SIGNATURE_ARCHITECTURE.md** - Signature system documentation
- **package.json** - Complete dependency list
- **tsconfig.json** - TypeScript configuration
- **vite.config.ts** - Build tool configuration
- **tailwind.config.ts** - Styling framework configuration
- **render.yaml** - Deployment configuration

This comprehensive tech stack documentation provides a complete overview of all technologies, frameworks, and tools used in the DriverQualificationTool application. The stack represents a modern, scalable, and maintainable approach to full-stack web development with TypeScript.