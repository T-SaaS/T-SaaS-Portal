# Driver Qualification Tool

A comprehensive full-stack application for managing driver qualification applications with real-time form validation, background checks, administrative oversight, and email notifications.

## 🚀 Features

- **Multi-step Driver Application Form** - Comprehensive form with real-time validation and gap detection
- **Address & Employment History Tracking** - Automatic gap detection and validation with visual warnings
- **Background Check Integration** - Automated background verification services with status tracking
- **Admin Dashboard** - Complete application management interface with filtering and search
- **Authentication System** - Secure login/logout with role-based access control
- **Real-time Validation** - Live form validation with immediate feedback
- **Responsive Design** - Mobile-friendly interface using Tailwind CSS and shadcn/ui
- **GraphQL & REST API** - Modern API with Apollo Server and Express
- **Supabase Integration** - Real-time database with authentication and storage
- **Email Notifications** - Automated email system with customizable templates
- **Document Management** - Secure file upload and storage for signatures and documents
- **Photo Capture** - Webcam integration for document photos
- **Signature Pad** - Digital signature collection with edit capabilities

## 🏗️ Architecture

This is a full-stack TypeScript application with:

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Apollo Server (GraphQL) + REST API
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with session management
- **Styling**: Tailwind CSS + shadcn/ui components + Radix UI
- **Form Management**: React Hook Form + Zod validation
- **State Management**: React Query (TanStack Query) + Context API
- **File Storage**: Supabase Storage with public/private buckets
- **Email Service**: ZeptoMail integration with templated emails

## 📁 Project Structure

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
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts (Auth, Company)
│   │   ├── lib/           # Utility libraries (Supabase, QueryClient)
│   │   ├── services/      # API services
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── routes/        # Routing configuration
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── services/         # Business logic services
│   │   ├── emailService.ts
│   │   ├── emailTemplates.ts
│   │   ├── applicationStatusService.ts
│   │   └── loggingService.ts
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # REST API routes
│   ├── db.ts             # Database configuration
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript types and schemas
├── scripts/              # Build and utility scripts
├── docs/                 # Documentation
└── package.json          # Root package.json with scripts
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework with hooks
- **TypeScript 5.6** - Type safety
- **Vite 6.3** - Build tool and dev server
- **React Router DOM 7.6** - Client-side routing
- **React Hook Form 7.55** - Form management
- **Zod 3.24** - Schema validation
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Apollo Client 3.13** - GraphQL client
- **React Query (TanStack Query) 5.60** - Server state management
- **Framer Motion 11.13** - Animation library
- **React Webcam** - Camera integration
- **Signature Pad** - Digital signature component

### Backend

- **Node.js** - Runtime environment
- **Express 4.21** - Web framework
- **Apollo Server 4.12** - GraphQL server
- **TypeScript 5.6** - Type safety
- **Nodemon 3.1** - Development server
- **Supabase 2.50** - Database, auth, and storage
- **ZeptoMail 6.2** - Email service
- **Express Rate Limit 8.0** - API rate limiting
- **Express Session 1.18** - Session management
- **Passport 0.7** - Authentication middleware

### Database & Storage

- **Supabase** - PostgreSQL with real-time features
- **Row Level Security (RLS)** - Data protection
- **Real-time subscriptions** - Live updates
- **Storage buckets** - File storage for documents and signatures
- **Authentication** - User management and sessions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd DriverQualificationTool
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new Supabase project
   - Set up database tables and RLS policies
   - Configure storage buckets for documents and signatures
   - Copy your Supabase credentials

4. **Environment Variables**
   Create `.env` files in both `client/` and `server/` directories:

   **client/.env:**

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GRAPHQL_URL=http://localhost:5000/graphql
   ```

   **server/.env:**

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=5000
   SESSION_SECRET=your_session_secret
   ZEPTOMAIL_API_KEY=your_zeptomail_api_key
   ZEPTOMAIL_FROM_EMAIL=your_verified_email
   ```

5. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start both the client (port 3000) and server (port 5000) concurrently.

## 📝 Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with production environment
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run preview` - Preview production build

### Build Scripts

- `npm run build:server` - Build server TypeScript
- `npm run vercel-build` - Build for Vercel deployment

## 🔐 Authentication

The application uses Supabase authentication with:

- **Email/Password login** for administrators
- **Session management** with secure cookies
- **Role-based access control** (Admin/User)
- **Protected routes** for admin functionality
- **Automatic logout** on session expiry
- **Rate limiting** for security

### Test User (Development)

In development mode, a test user button is available on the login page with:

- Email: `admin@test.com`
- Password: `password123`

## 📊 Database Schema

The application uses the following main tables:

- `driver_applications` - Main application data
- `address_history` - Driver address history with gap detection
- `employment_history` - Driver employment history with overlap detection
- `background_checks` - Background check results and status
- `users` - User accounts (managed by Supabase Auth)
- `companies` - Company information and settings

## 🎨 UI Components

The frontend follows Atomic Design principles:

- **Atoms**: Basic UI elements (Button, Input, Label, Badge)
- **Molecules**: Simple combinations (FormField, StatusBadge, SearchInput)
- **Organisms**: Complex components (ApplicationCard, ProgressStepper, ApplicationsTable)
- **Templates**: Page layouts (ExternalTemplate, PrivateTemplate)
- **Pages**: Complete pages (DriverForm, Dashboard, Applications)

## 🔍 Form Features

### Driver Application Form

- **Multi-step wizard** with progress tracking and navigation
- **Real-time validation** with immediate feedback
- **Address history tracking** with automatic gap detection
- **Employment history tracking** with overlap detection
- **File upload** for documents with drag-and-drop
- **Auto-save** functionality with form persistence
- **Photo capture** for license and medical card photos
- **Digital signatures** with edit capabilities

### Validation Features

- **Gap detection** in address and employment history
- **Required field validation** with visual indicators
- **Email format validation**
- **Phone number formatting** and validation
- **Date range validation** with overlap detection
- **SSN input** with masking and validation

## 🚨 Background Check Integration

The application includes comprehensive background check services:

- **Criminal record checks** with status tracking
- **Driving record verification** with violation tracking
- **Employment verification** with discrepancy detection
- **Address verification** with history validation
- **Real-time status updates** via GraphQL subscriptions
- **Email notifications** for status changes

## 📧 Email System

The application includes a comprehensive email notification system:

- **Templated emails** for various application events
- **Custom email sending** with HTML support
- **ZeptoMail integration** for reliable delivery
- **Email templates** for:
  - Application submission confirmation
  - Background check initiation/completion
  - Application approval/rejection
  - Document requests
  - Welcome emails
  - Reminder notifications

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first design** approach
- **Touch-friendly interfaces** with proper touch targets
- **Adaptive layouts** for all screen sizes
- **Optimized for tablets and mobile devices**
- **Progressive Web App** capabilities

## 🔧 Development

### Code Style

- **TypeScript** for type safety throughout
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional commits** for version control
- **Atomic Design** for component organization

### Testing

- **Unit tests** for components and utilities
- **Integration tests** for forms and API endpoints
- **E2E tests** for complete user flows
- **Type checking** with TypeScript

### Performance

- **Code splitting** with React.lazy() and dynamic imports
- **Optimized builds** with Vite
- **Image optimization** and lazy loading
- **Bundle analysis** and optimization
- **Caching strategies** for API responses

## 🚀 Deployment

### Frontend Deployment

The client can be deployed to:

- **Vercel** - Optimized for React applications
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable static hosting
- **Any static hosting service**

### Backend Deployment

The server can be deployed to:

- **Render** - Full-stack platform (configured)
- **Heroku** - Platform as a service
- **Railway** - Modern deployment platform
- **DigitalOcean App Platform** - Managed containers
- **AWS EC2** - Virtual servers
- **Google Cloud Run** - Serverless containers

### Environment Setup

Ensure all environment variables are set in your deployment platform:

- Supabase credentials (URL, keys)
- Session secrets
- Email service credentials
- API endpoints and CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the established patterns
4. Add tests if applicable
5. Ensure all TypeScript types are properly defined
6. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation in `/docs`
- Review the Supabase setup guide (`SUPABASE_SETUP.md`)
- Check email service documentation (`server/services/EMAIL_API.md`)
- Open an issue on GitHub

## 🔄 Updates

### Recent Changes

- ✅ **Email System** - Complete email notification system with ZeptoMail
- ✅ **Document Management** - Secure file upload and storage system
- ✅ **Signature Pad** - Digital signature collection with edit capabilities
- ✅ **Photo Capture** - Webcam integration for document photos
- ✅ **Enhanced Validation** - Improved gap detection and form validation
- ✅ **Admin Dashboard** - Complete application management interface
- ✅ **GraphQL API** - Modern GraphQL API alongside REST endpoints
- ✅ **Real-time Updates** - Live status updates and notifications
- ✅ **Mobile Optimization** - Fully responsive design with touch support

### Current Status

- **Core Features**: ✅ Complete
- **Authentication**: ✅ Complete
- **Form System**: ✅ Complete
- **Admin Dashboard**: ✅ Complete
- **Email Notifications**: ✅ Complete
- **Document Management**: ✅ Complete
- **Background Checks**: ✅ Complete
- **Mobile Responsiveness**: ✅ Complete

### Roadmap

- [ ] **Advanced Analytics** - Dashboard analytics and reporting
- [ ] **API Rate Limiting** - Enhanced rate limiting and security
- [ ] **Mobile App** - Native mobile application
- [ ] **Advanced Reporting** - Custom report generation
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Search** - Full-text search capabilities
- [ ] **Bulk Operations** - Batch processing for applications
- [ ] **API Documentation** - Interactive API documentation
