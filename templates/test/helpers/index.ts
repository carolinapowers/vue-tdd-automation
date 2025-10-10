/**
 * Test Utilities and Helpers
 * Following Vue.js testing best practices
 */

import { VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Waits for a condition to be true
 * Useful for async operations and DOM updates
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 1000,
  interval = 10
): Promise<void> {
  const startTime = Date.now()
  
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
}

/**
 * Finds an element by data-test attribute
 * Following Vue's recommendation to use data-test for test selectors
 */
export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-test="${testId}"]`)
}

/**
 * Finds all elements by data-test attribute
 */
export function findAllByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.findAll(`[data-test="${testId}"]`)
}

/**
 * Helper to trigger form submission
 */
export async function submitForm(wrapper: VueWrapper, formTestId: string) {
  const form = findByTestId(wrapper, formTestId)
  await form.trigger('submit.prevent')
  await wrapper.vm.$nextTick()
}

/**
 * Helper to set input value and wait for update
 */
export async function setInputValue(
  wrapper: VueWrapper,
  testId: string,
  value: string | number
) {
  const input = findByTestId(wrapper, testId)
  await input.setValue(value)
  await wrapper.vm.$nextTick()
}

/**
 * Helper to click a button and wait for update
 */
export async function clickButton(wrapper: VueWrapper, testId: string) {
  const button = findByTestId(wrapper, testId)
  await button.trigger('click')
  await wrapper.vm.$nextTick()
}

/**
 * Mock API response helper
 */
export function mockApiResponse<T>(data: T, delay = 0) {
  return vi.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data }), delay)
    })
  })
}

/**
 * Mock API error helper
 */
export function mockApiError(message = 'API Error', delay = 0) {
  return vi.fn().mockImplementation(() => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), delay)
    })
  })
}

/**
 * Creates a mock router for testing
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        params: {},
        query: {}
      }
    }
  }
}

/**
 * Creates a mock store for testing
 */
export function createMockStore(initialState = {}) {
  return {
    state: initialState,
    getters: {},
    dispatch: vi.fn(),
    commit: vi.fn()
  }
}

/**
 * Flushes all promises
 * Useful for ensuring all async operations are complete
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

/**
 * Helper to test accessibility attributes
 */
export function testAccessibility(wrapper: VueWrapper, testId: string) {
  const element = findByTestId(wrapper, testId)
  
  return {
    hasAriaLabel: () => {
      const label = element.attributes('aria-label')
      return label !== undefined && label !== ''
    },
    hasAriaDescribedBy: () => {
      const describedBy = element.attributes('aria-describedby')
      return describedBy !== undefined && describedBy !== ''
    },
    hasRole: () => {
      const role = element.attributes('role')
      return role !== undefined && role !== ''
    },
    isAriaHidden: () => {
      return element.attributes('aria-hidden') === 'true'
    },
    isAriaExpanded: () => {
      return element.attributes('aria-expanded') === 'true'
    },
    getAriaLabel: () => element.attributes('aria-label'),
    getRole: () => element.attributes('role')
  }
}

/**
 * Test data factory for creating consistent test data
 */
export class TestDataFactory {
  static createTeeTime(overrides = {}) {
    return {
      id: Math.random(),
      course: 'Test Golf Course',
      date: '2024-03-15',
      time: '10:00 AM',
      price: 150,
      available: true,
      ...overrides
    }
  }
  
  static createUser(overrides = {}) {
    return {
      id: Math.random(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      ...overrides
    }
  }
  
  static createBooking(overrides = {}) {
    return {
      id: Math.random(),
      userId: 1,
      teeTimeId: 1,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...overrides
    }
  }
}
