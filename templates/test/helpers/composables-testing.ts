/**
 * Composables Testing Utilities
 * Following Vue.js recommendations for testing composables
 * https://vuejs.org/guide/scaling-up/testing#testing-composables
 */

import { expect } from 'vitest'
import { createApp, defineComponent, type App } from 'vue'
import { mount } from '@vue/test-utils'

/**
 * Helper to test composables in isolation
 * Based on Vue's official recommendation
 */
export function withSetup<T>(composable: () => T): [T, App] {
  let result: T

  const app = createApp({
    setup() {
      result = composable()
      // Suppress missing template warning
      return () => {}
    }
  })

  app.mount(document.createElement('div'))

  // Return result and app instance for cleanup
  return [result!, app]
}

/**
 * Test a composable within a component context
 */
export function testComposable<T>(
  composable: () => T,
  testFn: (result: T) => void | Promise<void>
) {
  const TestComponent = defineComponent({
    setup() {
      const result = composable()
      // Expose for testing
      return { ...result }
    },
    template: '<div />'
  })
  
  const wrapper = mount(TestComponent)
  const result = wrapper.vm as unknown as T
  
  const cleanup = () => wrapper.unmount()
  
  // Run test and ensure cleanup
  try {
    const testResult = testFn(result)
    if (testResult instanceof Promise) {
      return testResult.finally(cleanup)
    }
    cleanup()
  } catch (error) {
    cleanup()
    throw error
  }
}

/**
 * Test reactive composable behavior
 */
export async function testReactiveComposable<T>(
  composable: () => T,
  mutations: Array<{
    mutate: (result: T) => void
    expect: (result: T) => void
  }>
) {
  const [result, app] = withSetup(composable)

  try {
    for (const { mutate, expect: assertion } of mutations) {
      mutate(result)
      // Wait for reactivity to update
      await new Promise(resolve => setTimeout(resolve, 0))
      assertion(result)
    }
  } finally {
    app.unmount()
  }
}

/**
 * Test composable with provide/inject
 */
export function testComposableWithProvide<T>(
  composable: () => T,
  provides: Record<string | symbol, any>,
  testFn: (result: T) => void | Promise<void>
) {
  const TestComponent = defineComponent({
    setup() {
      return composable()
    },
    template: '<div />'
  })
  
  const wrapper = mount(TestComponent, {
    global: {
      provide: provides
    }
  })
  
  const result = wrapper.vm as unknown as T
  
  try {
    const testResult = testFn(result)
    if (testResult instanceof Promise) {
      return testResult.finally(() => wrapper.unmount())
    }
    wrapper.unmount()
  } catch (error) {
    wrapper.unmount()
    throw error
  }
}

/**
 * Mock composable for testing components that use it
 */
export function mockComposable<T>(
  composablePath: string,
  mockImplementation: () => T
) {
  return {
    [composablePath]: mockImplementation
  }
}

/**
 * Test composable lifecycle hooks
 */
export function testComposableLifecycle(
  composable: () => any,
  hooks: {
    onMounted?: () => void
    onUnmounted?: () => void
    onUpdated?: () => void
  }
) {
  const TestComponent = defineComponent({
    setup() {
      const result = composable()
      
      // Override lifecycle hooks for testing
      if (hooks.onMounted) {
        result.onMounted = hooks.onMounted
      }
      if (hooks.onUnmounted) {
        result.onUnmounted = hooks.onUnmounted
      }
      if (hooks.onUpdated) {
        result.onUpdated = hooks.onUpdated
      }
      
      return result
    },
    template: '<div>{{ result }}</div>'
  })
  
  const wrapper = mount(TestComponent)
  
  // Trigger update if needed
  if (hooks.onUpdated) {
    wrapper.vm.$forceUpdate()
  }
  
  // Cleanup
  wrapper.unmount()
}

/**
 * Test async composable
 */
export async function testAsyncComposable<T>(
  composable: () => Promise<T>,
  testFn: (result: T) => void | Promise<void>
) {
  let result: T
  
  const TestComponent = defineComponent({
    async setup() {
      result = await composable()
      return { result }
    },
    template: '<div />'
  })
  
  const wrapper = mount(TestComponent)
  
  // Wait for async setup
  await wrapper.vm.$nextTick()
  
  try {
    await testFn(result!)
  } finally {
    wrapper.unmount()
  }
}

/**
 * Test composable error handling
 */
export function testComposableError(
  composable: () => any,
  expectedError: string | RegExp
) {
  const TestComponent = defineComponent({
    setup() {
      try {
        return composable()
      } catch (error: any) {
        if (typeof expectedError === 'string') {
          expect(error.message).toBe(expectedError)
        } else {
          expect(error.message).toMatch(expectedError)
        }
        throw error
      }
    },
    template: '<div />'
  })
  
  expect(() => mount(TestComponent)).toThrow(expectedError)
}

/**
 * Utility to create a test harness for a composable
 */
export function createComposableTestHarness<T>(
  composable: () => T,
  defaultProvides: Record<string | symbol, any> = {}
) {
  return {
    test: (testFn: (result: T) => void | Promise<void>) => {
      return testComposable(composable, testFn)
    },
    
    testWithProvide: (
      provides: Record<string | symbol, any>,
      testFn: (result: T) => void | Promise<void>
    ) => {
      return testComposableWithProvide(
        composable,
        { ...defaultProvides, ...provides },
        testFn
      )
    },
    
    testReactive: (mutations: Parameters<typeof testReactiveComposable>[1]) => {
      return testReactiveComposable(composable, mutations)
    }
  }
}
