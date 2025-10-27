/**
 * DOM Utility Functions
 * 
 * Helper functions for DOM manipulation and queries.
 */

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get element offset from document
 */
export function getOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  }
}

/**
 * Check if click is outside element
 */
export function isClickOutside(event: MouseEvent, element: HTMLElement): boolean {
  return !element.contains(event.target as Node)
}

/**
 * Prevent body scroll (useful for modals)
 */
export function preventBodyScroll(prevent: boolean): void {
  if (prevent) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Get scrollbar width
 */
export function getScrollbarWidth(): number {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
