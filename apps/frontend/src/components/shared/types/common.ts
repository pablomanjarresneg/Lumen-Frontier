/**
 * Common Type Definitions
 *
 * Shared types used across multiple components.
 */

import type { ReactNode, CSSProperties } from 'react'

// ============================================================================
// Size & Variant Types
// ============================================================================

/**
 * Standard size options for components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Standard variant/color options for components
 */
export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'outline'

/**
 * Component status states
 */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Standard color palette
 */
export type Color =
  | 'blue'
  | 'purple'
  | 'green'
  | 'red'
  | 'yellow'
  | 'gray'
  | 'indigo'
  | 'pink'

// ============================================================================
// Base Component Props
// ============================================================================

/**
 * Base props that all components should extend
 */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string

  /** Unique identifier for the component */
  id?: string

  /** Custom inline styles */
  style?: CSSProperties

  /** Test identifier for testing libraries */
  'data-testid'?: string

  /** Accessible label */
  'aria-label'?: string
}

/**
 * Props for components that can have children
 */
export interface WithChildren {
  children: ReactNode
}

/**
 * Props for components that can be disabled
 */
export interface WithDisabled {
  disabled?: boolean
}

/**
 * Props for components that can be in a loading state
 */
export interface WithLoading {
  loading?: boolean
}

// ============================================================================
// Spacing & Layout Types
// ============================================================================

/**
 * Spacing values for padding and margin
 */
export type Spacing =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'

/**
 * Alignment options
 */
export type Alignment = 'start' | 'center' | 'end' | 'stretch'

/**
 * Flex direction options
 */
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'

/**
 * Justify content options
 */
export type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'

// ============================================================================
// Responsive Types
// ============================================================================

/**
 * Breakpoint names matching Tailwind defaults
 */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Responsive value that can vary by breakpoint
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

// ============================================================================
// Icon Types
// ============================================================================

/**
 * Icon position relative to text
 */
export type IconPosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * Icon props
 */
export interface IconProps extends BaseComponentProps {
  /** Icon size */
  size?: Size | number

  /** Icon color */
  color?: Color | string

  /** Icon accessibility label */
  'aria-label'?: string
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Form field validation state
 */
export type ValidationState = 'valid' | 'invalid' | 'warning' | 'default'

/**
 * Input types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Generic click handler
 */
export type ClickHandler<T = HTMLElement> = (
  event: React.MouseEvent<T>
) => void

/**
 * Generic change handler
 */
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>
) => void

/**
 * Form submit handler
 */
export type SubmitHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void

/**
 * Keyboard event handler
 */
export type KeyboardHandler<T = HTMLElement> = (
  event: React.KeyboardEvent<T>
) => void

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Extract props type from a component
 */
export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never

/**
 * Polymorphic component props
 */
export type PolymorphicComponentProps<
  E extends React.ElementType,
  P = {}
> = P & Omit<React.ComponentPropsWithoutRef<E>, keyof P> & {
  as?: E
}
