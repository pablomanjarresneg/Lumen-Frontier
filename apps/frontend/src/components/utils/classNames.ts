/**
 * Class Name Utilities
 *
 * Helper functions for managing CSS class names in components.
 */

type ClassValue = string | number | boolean | undefined | null
type ClassArray = ClassValue[]
type ClassDictionary = Record<string, any>
type ClassNameInput = ClassValue | ClassDictionary | ClassArray

/**
 * Combines class names conditionally.
 *
 * @example
 * cn('base', 'extra') // 'base extra'
 * cn('base', isActive && 'active') // 'base active' or 'base'
 * cn('base', { active: isActive }) // 'base active' or 'base'
 * cn(['base', 'extra']) // 'base extra'
 *
 * @param inputs - Class names, objects, or arrays to combine
 * @returns Combined class name string
 */
export function cn(...inputs: ClassNameInput[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}

/**
 * Alternative alias for cn function.
 * Some developers prefer 'clsx' naming.
 */
export const clsx = cn

/**
 * Conditionally apply class names based on a condition.
 *
 * @example
 * conditionalClass(isActive, 'active', 'inactive') // 'active' or 'inactive'
 *
 * @param condition - Boolean condition
 * @param truthyClass - Class to apply when true
 * @param falsyClass - Class to apply when false
 * @returns The appropriate class name
 */
export function conditionalClass(
  condition: boolean,
  truthyClass: string,
  falsyClass: string = ''
): string {
  return condition ? truthyClass : falsyClass
}

/**
 * Merge multiple class names, removing duplicates.
 *
 * @example
 * mergeClasses('text-sm', 'text-sm text-blue-500') // 'text-sm text-blue-500'
 *
 * @param classes - Class names to merge
 * @returns Merged class names without duplicates
 */
export function mergeClasses(...classes: string[]): string {
  const classSet = new Set<string>()

  for (const cls of classes) {
    if (cls) {
      cls.split(' ').forEach(c => c && classSet.add(c))
    }
  }

  return Array.from(classSet).join(' ')
}

/**
 * Helper to combine base classes with optional additional classes.
 *
 * @example
 * withBase('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 * withBase('px-4 py-2', undefined) // 'px-4 py-2'
 *
 * @param baseClasses - Base classes always applied
 * @param additionalClasses - Optional additional classes
 * @returns Combined class names
 */
export function withBase(
  baseClasses: string,
  additionalClasses?: string
): string {
  return cn(baseClasses, additionalClasses)
}
