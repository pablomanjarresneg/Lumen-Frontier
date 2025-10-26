# Components Architecture

This directory contains all reusable components for the frontend application, organized following a scalable architecture suitable for large projects.

## Directory Structure

```
components/
├── ui/                    # Atomic UI components (buttons, inputs, cards)
├── layout/               # Layout components (navbar, footer, sidebar)
├── sections/             # Page sections (hero, features, CTA)
├── features/             # Feature-specific components
├── common/               # Shared/common components used across features
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Component utilities and helpers
└── index.ts              # Barrel exports
```

## Component Categories

### 1. UI Components (`ui/`)
**Purpose:** Smallest, reusable building blocks following atomic design principles.

**Examples:**
- Buttons (primary, secondary, link)
- Input fields
- Cards
- Badges
- Icons
- Modals
- Tooltips

**Guidelines:**
- Should be highly reusable and generic
- Accept props for customization
- Should not contain business logic
- Should be fully typed with TypeScript

### 2. Layout Components (`layout/`)
**Purpose:** Components that define the page structure and frame.

**Examples:**
- Navbar
- Footer
- Sidebar
- Header
- Container/Wrapper components

**Guidelines:**
- Should be used across multiple pages
- Handle navigation and page structure
- Can contain routing logic

### 3. Section Components (`sections/`)
**Purpose:** Large, composable sections that make up page content.

**Examples:**
- Hero sections
- Feature showcases
- CTA sections
- Testimonials
- Pricing tables

**Guidelines:**
- Compose multiple UI and common components
- Represent distinct page sections
- Should be self-contained with their styles

### 4. Feature Components (`features/`)
**Purpose:** Feature-specific components with business logic.

**Examples:**
- FeatureCard
- FeaturePreview
- Feature comparison tables

**Guidelines:**
- May contain feature-specific logic
- Can be reused within feature contexts
- More opinionated than UI components

### 5. Common Components (`common/`)
**Purpose:** Shared components that don't fit other categories.

**Examples:**
- Loading spinners
- Error boundaries
- Empty states
- SEO components

**Guidelines:**
- Used across multiple features
- General-purpose utilities
- Cross-cutting concerns

### 6. Hooks (`hooks/`)
**Purpose:** Custom React hooks for reusable logic.

**Naming Convention:** Use `use` prefix (e.g., `useMediaQuery.ts`)

**Examples:**
- `useMediaQuery` - Responsive breakpoint detection
- `useLocalStorage` - Local storage management
- `useClickOutside` - Detect clicks outside elements
- `useDebounce` - Debounce values

### 7. Types (`types/`)
**Purpose:** TypeScript type definitions and interfaces.

**Examples:**
- Component prop types
- Shared data models
- Enum definitions

### 8. Utils (`utils/`)
**Purpose:** Helper functions for components.

**Examples:**
- Class name utilities
- Style helpers
- Formatting functions

## Naming Conventions

### Files
- **Components:** PascalCase (e.g., `Button.tsx`, `FeatureCard.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useMediaQuery.ts`)
- **Utils:** camelCase (e.g., `classNames.ts`, `formatDate.ts`)
- **Types:** PascalCase (e.g., `Button.types.ts` or `types.ts`)
- **Styles:** Same as component (e.g., `Button.css`, `Hero.css`)

### Component Structure
Each complex component can have its own folder:

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.css      # Styles (if needed)
├── ComponentName.types.ts # Type definitions
├── ComponentName.test.tsx # Tests
└── index.ts               # Barrel export
```

## Import Guidelines

### Preferred Import Pattern
```typescript
// Import from barrel exports
import { Button, Card, Modal } from '@/components/ui'
import { Navbar, Footer } from '@/components/layout'
import { Hero, CTASection } from '@/components/sections'
```

### Component File Template
```typescript
import { FC } from 'react'
import './ComponentName.css'

interface ComponentNameProps {
  title: string
  description?: string
  variant?: 'primary' | 'secondary'
}

export const ComponentName: FC<ComponentNameProps> = ({
  title,
  description,
  variant = 'primary'
}) => {
  return (
    <div className={`component-name component-name--${variant}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default ComponentName
```

## Best Practices

### 1. Component Composition
- Build complex components from simpler ones
- Use composition over inheritance
- Keep components focused on a single responsibility

### 2. Props and Types
- Always define TypeScript interfaces for props
- Use optional props with default values
- Document complex props with JSDoc comments

### 3. Styling
- Use Tailwind CSS for utility styling
- Create separate CSS files for complex animations
- Co-locate styles with components
- Use CSS modules for component-specific styles

### 4. Performance
- Use React.memo() for expensive re-renders
- Implement lazy loading for heavy components
- Extract static content outside components

### 5. Testing
- Write unit tests for UI components
- Test component behavior, not implementation
- Use React Testing Library

## Migration Guide

When moving components to this new structure:

1. Identify the component category
2. Move to appropriate folder
3. Update imports in consuming files
4. Update barrel exports in `index.ts`
5. Ensure styles are co-located
6. Add proper TypeScript types

## Examples

### Creating a New Button Component
```bash
components/ui/Button/
├── Button.tsx
├── Button.css
├── Button.types.ts
└── index.ts
```

### Using the Button Component
```typescript
import { Button } from '@/components/ui'

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

## Questions or Suggestions?

If you're unsure where a component belongs, consider:
- **Is it generic and reusable?** → `ui/`
- **Does it define page structure?** → `layout/`
- **Is it a large page section?** → `sections/`
- **Is it feature-specific?** → `features/`
- **Is it shared across features?** → `common/`
