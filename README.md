# Driver Qualification Tool

A comprehensive full-stack application for managing driver qualification applications with real-time form validation, background checks, and administrative oversight.

## 🚀 Features

- **Multi-step Driver Application Form** - Comprehensive form with real-time validation
- **Address & Employment History Tracking** - Automatic gap detection and validation
- **Background Check Integration** - Automated background verification services
- **Admin Dashboard** - Complete application management interface
- **Authentication System** - Secure login/logout with role-based access
- **Real-time Validation** - Live form validation with gap detection
- **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- **GraphQL API** - Modern API with Apollo Server
- **Supabase Integration** - Real-time database with authentication

## 🏗️ Architecture

This is a full-stack TypeScript application with:

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + Apollo Server (GraphQL)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Form Management**: React Hook Form + Zod validation

## 📁 Project Structure

```
DriverQualificationTool/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── app/           # Main app components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   └── templates/     # Layout templates
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # REST API routes
│   ├── db.ts             # Database configuration
│   └── backgroundCheckService.ts
├── shared/               # Shared TypeScript types
├── supabase/            # Supabase configuration
└── package.json         # Root package.json with scripts
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Apollo Client** - GraphQL client

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **TypeScript** - Type safety
- **Nodemon** - Development server
- **Supabase** - Database and auth

### Database

- **Supabase** - PostgreSQL with real-time features
- **Row Level Security (RLS)** - Data protection
- **Real-time subscriptions** - Live updates

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
   - Run the SQL setup script: `supabase-rls-setup.sql`
   - Copy your Supabase URL and anon key

4. **Environment Variables**
   Create `.env` files in both `client/` and `server/` directories:

   **client/.env:**

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GRAPHQL_URL=http://localhost:4000/graphql
   ```

   **server/.env:**

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=4000
   SESSION_SECRET=your_session_secret
   ```

5. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start both the client (port 3000) and server (port 4000) concurrently.

## 📝 Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

### Client Only

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication

The application uses Supabase authentication with:

- **Email/Password login** for administrators
- **Session management** with secure cookies
- **Role-based access control** (Admin/User)
- **Protected routes** for admin functionality
- **Automatic logout** on session expiry

### Test User (Development)

In development mode, a test user button is available on the login page with:

- Email: `admin@test.com`
- Password: `password123`

## 📊 Database Schema

The application uses the following main tables:

- `driver_applications` - Main application data
- `address_history` - Driver address history
- `employment_history` - Driver employment history
- `background_checks` - Background check results
- `users` - User accounts (managed by Supabase Auth)

## 🎨 UI Components

The frontend follows Atomic Design principles:

- **Atoms**: Basic UI elements (Button, Input, Label)
- **Molecules**: Simple combinations (FormField, StatusBadge)
- **Organisms**: Complex components (ApplicationCard, ProgressStepper)
- **Templates**: Page layouts (ExternalTemplate, PrivateTemplate)
- **Pages**: Complete pages (DriverForm, Dashboard)

## 🔍 Form Features

### Driver Application Form

- **Multi-step wizard** with progress tracking
- **Real-time validation** with immediate feedback
- **Address history tracking** with gap detection
- **Employment history tracking** with overlap detection
- **File upload** for documents
- **Auto-save** functionality

### Validation Features

- **Gap detection** in address and employment history
- **Required field validation**
- **Email format validation**
- **Phone number formatting**
- **Date range validation**

## 🚨 Background Check Integration

The application includes background check services:

- **Criminal record checks**
- **Driving record verification**
- **Employment verification**
- **Address verification**
- **Real-time status updates**

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first design**
- **Touch-friendly interfaces**
- **Adaptive layouts**
- **Optimized for all screen sizes**

## 🔧 Development

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional commits** for version control

### Testing

- **Unit tests** for components
- **Integration tests** for forms
- **E2E tests** for user flows

### Performance

- **Code splitting** with React.lazy()
- **Optimized builds** with Vite
- **Image optimization**
- **Bundle analysis**

## 🚀 Deployment

### Frontend Deployment

The client can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend Deployment

The server can be deployed to:

- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2
- Google Cloud Run

### Environment Setup

Ensure all environment variables are set in your deployment platform:

- Supabase credentials
- Session secrets
- API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation in `/docs`
- Review the Supabase setup guide
- Open an issue on GitHub

## 🔄 Updates

### Recent Changes

- Migrated from Pothos to Apollo Server for GraphQL
- Removed Drizzle ORM in favor of direct Supabase integration
- Added real-time gap detection for address and employment history
- Implemented comprehensive authentication system
- Added admin dashboard with application management
- Enhanced form validation and user experience

### Roadmap

- [ ] Email notifications
- [ ] Document management system
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced analytics
