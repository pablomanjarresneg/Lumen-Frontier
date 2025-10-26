/**
 * Component Exports
 *
 * Central barrel file for all component exports.
 * Import components from their category folders.
 */

// ============================================================================
// Layout Components
// ============================================================================
export { default as Navbar } from './layout/Navbar'
export { default as Footer } from './layout/Footer'

// ============================================================================
// Section Components
// ============================================================================
export { default as Hero } from './sections/Hero'
export { default as FeatureShowcase } from './sections/FeatureShowcase'
export { default as FeaturesGrid } from './sections/FeaturesGrid'
export { default as HowItWorks } from './sections/HowItWorks'
export { default as CTASection } from './sections/CTASection'
export { default as PlanetaryScene } from './sections/PlanetaryScene'

// ============================================================================
// Feature Components
// ============================================================================
export { default as FeatureCard } from './features/FeatureCard'
export { default as FeaturePreview } from './features/FeaturePreview'

// ============================================================================
// UI Components
// ============================================================================
// Export UI components as they are created
// Example: export * from './ui'

// ============================================================================
// Common Components
// ============================================================================
// Export common components as they are created
// Example: export * from './common'

// ============================================================================
// Hooks
// ============================================================================
// Export hooks from a dedicated hooks module
// Example: export * from './hooks'

// ============================================================================
// Types
// ============================================================================
// Export types for external consumption
export * from './types'

// ============================================================================
// Utilities
// ============================================================================
// Export utilities for external consumption
export * from './utils'
