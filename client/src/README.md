# Driver Qualification Tool - Frontend Architecture

This project follows the **Atomic Design** methodology for component organization and reusability.

## 📁 Folder Structure

```
src/
├── atoms/           # Basic building blocks (Button, Input, Label, Badge)
├── molecules/       # Combinations of atoms (FormField, StatusBadge)
├── organisms/       # Complex UI components (ApplicationCard, ProgressStepper)
├── templates/       # Page layouts (ExternalTemplate, PrivateTemplate)
├── pages/           # Full pages (DriverFormPage, DashboardPage, etc.)
├── routes/          # Routing configuration
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
├── lib/             # Library configurations
└── styles/          # Global styles
```

## 🧩 Atomic Design Principles

### Atoms

The smallest building blocks - basic UI elements that can't be broken down further.

**Available Atoms:**

- `Button` - Reusable button component with variants
- `Input` - Form input with error handling
- `Label` - Form labels with required indicator
- `Badge` - Status indicators with color variants

### Molecules

Simple combinations of atoms that work together as a unit.

**Available Molecules:**

- `FormField` - Combines Label, Input, and error handling
- `StatusBadge` - Application status display with appropriate styling

### Organisms

Complex UI components composed of molecules and/or atoms.

**Available Organisms:**

- `ApplicationCard` - Complete application display card
- `ProgressStepper` - Multi-step form progress indicator

### Templates

Page-level layouts that define the structure and placement of organisms.

**Available Templates:**

- `ExternalTemplate` - Public-facing layout with header/footer
- `PrivateTemplate` - Admin layout with sidebar navigation

### Pages

Complete pages that use templates and populate them with content.

**Available Pages:**

- `DriverFormPage` - Multi-step driver application form
- `DashboardPage` - Admin dashboard with statistics
- `ApplicationsPage` - Application management interface
- `NotFoundPage` - 404 error page

## 🚀 Usage Examples

### Using Atoms

```tsx
import { Button, Input, Label } from "@/atoms";

function MyComponent() {
  return (
    <div>
      <Label required>Email Address</Label>
      <Input placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

### Using Molecules

```tsx
import { FormField } from "@/molecules";
import { useForm } from "react-hook-form";

function MyForm() {
  const form = useForm();

  return (
    <FormField
      control={form.control}
      name="email"
      label="Email Address"
      required
      type="email"
    />
  );
}
```

### Using Organisms

```tsx
import { ApplicationCard } from "@/organisms";
import { DriverApplication } from "@/types";

function ApplicationsList() {
  const applications: DriverApplication[] = [...];

  return (
    <div>
      {applications.map(app => (
        <ApplicationCard
          key={app.id}
          application={app}
          onView={(id) => console.log('View', id)}
          onApprove={(id) => console.log('Approve', id)}
        />
      ))}
    </div>
  );
}
```

## 🛣️ Routing

The application uses React Router with a clear separation between external and private routes:

### External Routes (Public)

- `/` → Redirects to `/apply`
- `/apply` → Driver application form

### Private Routes (Admin)

- `/dashboard` → Admin dashboard
- `/applications` → Application management
- `/applications/:id` → Individual application details

## 🎨 Styling

The project uses:

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for base components
- **Lucide React** for icons

## 📝 TypeScript

All components are fully typed with TypeScript. Common types are defined in `src/types/index.ts`:

- `DriverFormValues` - Form data structure
- `DriverApplication` - Application data structure
- `ButtonProps`, `InputProps` - Component prop types

## 🔧 Development

### Adding New Components

1. **Atoms**: Create in `src/atoms/[ComponentName]/`
2. **Molecules**: Create in `src/molecules/[ComponentName]/`
3. **Organisms**: Create in `src/organisms/[ComponentName]/`
4. **Templates**: Create in `src/templates/[TemplateName]/`
5. **Pages**: Create in `src/pages/[PageName]/`

### Component Structure

Each component should have:

- Main component file (`ComponentName.tsx`)
- Index file (`index.ts`) for exports
- Types defined in the component file or `src/types/`

### Best Practices

1. **Composition over inheritance** - Build complex components from simpler ones
2. **Props interface** - Always define TypeScript interfaces for component props
3. **Forward refs** - Use `forwardRef` for form components
4. **Consistent naming** - Use PascalCase for components, camelCase for props
5. **Reusability** - Design components to be reusable across the application

## 🧪 Testing

Components should be tested at their appropriate level:

- **Atoms**: Unit tests for basic functionality
- **Molecules**: Integration tests for atom combinations
- **Organisms**: Component tests for complex interactions
- **Pages**: E2E tests for complete user flows

## 📚 Resources

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
