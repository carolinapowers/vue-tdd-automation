/**
 * Test Setup File
 * Following Vue.js official testing recommendations
 * Enhanced with Testing Library for better user-centric testing
 * https://vuejs.org/guide/scaling-up/testing
 */

import { config } from '@vue/test-utils'
import { vi, afterEach } from 'vitest'
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest matchers with Testing Library's jest-dom matchers
expect.extend(matchers)

// Configure Vue Test Utils global settings
config.global.mocks = {
  // Add any global mocks here
  $t: (key: string) => key, // Mock i18n if used
}

// Configure global stubs for commonly stubbed components
config.global.stubs = {
  // Stub router components by default
  RouterLink: true,
  RouterView: true,
  // Stub transition components for faster tests
  Transition: false,
  TransitionGroup: false,
  // Stub teleport for simpler testing
  Teleport: true,
}

// Configure global directives
config.global.directives = {
  // Add custom directives if needed
}

// Configure global components
config.global.components = {
  // Register global components if needed
}

// Mock browser APIs that don't exist in Node
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(() => []),
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
})

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock requestAnimationFrame for animation tests
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 0)
  return 0
})

global.cancelAnimationFrame = vi.fn()

// Set up custom matchers if needed
expect.extend({
  toHaveBeenCalledWithEvent(received: any, eventType: string) {
    const mock = received as ReturnType<typeof vi.fn>
    const calls = mock.mock.calls
    const pass = calls.some(([event]) => event.type === eventType)

    return {
      pass,
      message: () =>
        pass
          ? `Expected not to be called with event type "${eventType}"`
          : `Expected to be called with event type "${eventType}"`,
    }
  },
})

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks()

  // Clear localStorage
  localStorage.clear()
  sessionStorage.clear()

  // Reset document body
  document.body.innerHTML = ''
})

// Export test utilities for use in tests
export * from './helpers'
export * from './helpers/vue-testing'
export * from './helpers/composables-testing'
