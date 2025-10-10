/**
 * Vue Testing Library Utilities
 * Combining Testing Library's user-centric approach with Vue
 * For better accessibility and user interaction testing
 */

import { render as tlRender, RenderOptions, RenderResult } from '@testing-library/vue'
import { Component } from 'vue'
import userEvent from '@testing-library/user-event'

/**
 * Custom render function that sets up user event
 * and provides sensible defaults for Vue Testing Library
 */
export function render<C extends Component>(
  component: C,
  options: RenderOptions<C> = {} as RenderOptions<C>
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup()

  const renderResult = tlRender(component, {
    ...options,
    global: {
      stubs: {
        // Stub router components by default
        RouterLink: true,
        RouterView: true,
        Teleport: true,
        ...options.global?.stubs
      },
      ...options.global
    }
  })

  return {
    ...renderResult,
    user
  }
}

// Re-export everything from Testing Library
export * from '@testing-library/vue'
export { userEvent }

// Export custom queries
export const queries = {
  /**
   * Find by data-test attribute (Vue convention)
   */
  getByTestId: (container: HTMLElement, testId: string) => {
    const element = container.querySelector(`[data-test="${testId}"]`)
    if (!element) {
      throw new Error(`Unable to find element with data-test="${testId}"`)
    }
    return element
  },
  
  queryByTestId: (container: HTMLElement, testId: string) => {
    return container.querySelector(`[data-test="${testId}"]`)
  },
  
  getAllByTestId: (container: HTMLElement, testId: string) => {
    const elements = container.querySelectorAll(`[data-test="${testId}"]`)
    if (elements.length === 0) {
      throw new Error(`Unable to find elements with data-test="${testId}"`)
    }
    return Array.from(elements)
  },
  
  queryAllByTestId: (container: HTMLElement, testId: string) => {
    return Array.from(container.querySelectorAll(`[data-test="${testId}"]`))
  }
}

/**
 * Accessibility testing utilities
 */
export const a11y = {
  /**
   * Check if element is accessible to screen readers
   */
  isAccessible: (element: HTMLElement): boolean => {
    // Check if element is hidden from screen readers
    if (element.getAttribute('aria-hidden') === 'true') {
      return false
    }
    
    // Check if element or parent has display: none or visibility: hidden
    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false
    }
    
    // Check for aria-label or accessible text
    const hasAriaLabel = !!element.getAttribute('aria-label')
    const hasAriaLabelledBy = !!element.getAttribute('aria-labelledby')
    const hasText = !!element.textContent?.trim()
    
    return hasAriaLabel || hasAriaLabelledBy || hasText
  },
  
  /**
   * Get accessible name of an element
   */
  getAccessibleName: (element: HTMLElement): string => {
    // Check aria-label first
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel
    
    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      const label = document.getElementById(labelledBy)
      if (label) return label.textContent || ''
    }
    
    // Check for label element (for form inputs)
    if (element instanceof HTMLInputElement || 
        element instanceof HTMLSelectElement || 
        element instanceof HTMLTextAreaElement) {
      const id = element.id
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`)
        if (label) return label.textContent || ''
      }
    }
    
    // Fall back to text content
    return element.textContent || ''
  },
  
  /**
   * Check if element has required ARIA attributes for its role
   */
  hasRequiredAriaAttributes: (element: HTMLElement): boolean => {
    const role = element.getAttribute('role')
    
    if (!role) return true // No role means no required attributes
    
    // Define required attributes for common roles
    const requiredAttributes: Record<string, string[]> = {
      button: [],
      link: [],
      navigation: ['aria-label'],
      main: [],
      complementary: ['aria-label'],
      contentinfo: [],
      banner: [],
      region: ['aria-label'],
      alert: [],
      alertdialog: ['aria-labelledby', 'aria-describedby'],
      dialog: ['aria-labelledby'],
      tab: ['aria-selected', 'aria-controls'],
      tabpanel: ['aria-labelledby'],
      progressbar: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      slider: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      combobox: ['aria-expanded', 'aria-controls'],
      menu: [],
      menuitem: [],
      tooltip: [],
    }
    
    const required = requiredAttributes[role] || []
    
    // Check if at least one of the required attributes exists
    // (some roles require either/or attributes)
    if (required.length === 0) return true
    
    return required.some(attr => element.hasAttribute(attr))
  }
}

/**
 * Custom Testing Library matchers for Vue
 */
export const customMatchers = {
  toBeAccessible(element: HTMLElement) {
    const pass = a11y.isAccessible(element)
    return {
      pass,
      message: () => 
        pass 
          ? `Expected element not to be accessible to screen readers`
          : `Expected element to be accessible to screen readers`
    }
  },
  
  toHaveAccessibleName(element: HTMLElement, name: string) {
    const actualName = a11y.getAccessibleName(element)
    const pass = actualName === name
    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to have accessible name "${name}"`
          : `Expected element to have accessible name "${name}", but got "${actualName}"`
    }
  },
  
  toHaveRequiredAriaAttributes(element: HTMLElement) {
    const pass = a11y.hasRequiredAriaAttributes(element)
    const role = element.getAttribute('role')
    return {
      pass,
      message: () =>
        pass
          ? `Expected element with role="${role}" not to have required ARIA attributes`
          : `Expected element with role="${role}" to have required ARIA attributes`
    }
  }
}

// Extend expect with custom matchers
import { expect } from 'vitest'
expect.extend(customMatchers)

// TypeScript support for custom matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeAccessible(): void
    toHaveAccessibleName(name: string): void
    toHaveRequiredAriaAttributes(): void
  }
  interface AsymmetricMatchersContaining {
    toBeAccessible(): void
    toHaveAccessibleName(name: string): void
    toHaveRequiredAriaAttributes(): void
  }
}
