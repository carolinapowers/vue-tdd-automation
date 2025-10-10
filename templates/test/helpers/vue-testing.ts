/**
 * Vue Component Testing Utilities
 * Based on Vue.js official testing recommendations
 */

import { expect } from 'vitest'
import { mount, shallowMount, VueWrapper, type MountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'

export interface RenderOptions<T = any> {
  /**
   * Use shallow mount to stub child components
   * Recommended when testing component in isolation
   */
  shallow?: boolean
  props?: MountingOptions<T>['props']
  slots?: MountingOptions<T>['slots']
  global?: MountingOptions<T>['global']
  attachTo?: MountingOptions<T>['attachTo']
  attrs?: MountingOptions<T>['attrs']
  data?: MountingOptions<T>['data']
}

/**
 * Enhanced mount function with better defaults
 * Following Vue testing best practices
 */
export function renderComponent(
  component: Component,
  options: RenderOptions = {}
): VueWrapper<any> {
  const { shallow: useShallow, ...mountOptions } = options

  // Default global stubs for common components
  const defaultGlobalStubs = {
    RouterLink: true,
    RouterView: true,
    Teleport: true,
    ...mountOptions.global?.stubs
  }

  const finalOptions: any = {
    ...mountOptions,
    global: {
      ...mountOptions.global,
      stubs: defaultGlobalStubs
    }
  }

  return useShallow
    ? shallowMount(component, finalOptions)
    : mount(component, finalOptions)
}

/**
 * Helper for testing component props
 */
export async function testProp<T>(
  wrapper: VueWrapper,
  propName: string,
  propValue: T,
  assertion: (wrapper: VueWrapper) => void | Promise<void>
) {
  await wrapper.setProps({ [propName]: propValue })
  await wrapper.vm.$nextTick()
  await assertion(wrapper)
}

/**
 * Helper for testing emitted events
 */
export function getEmittedEvent(
  wrapper: VueWrapper,
  eventName: string,
  index = 0
) {
  const emitted = wrapper.emitted(eventName)
  if (!emitted || !emitted[index]) {
    return undefined
  }
  return emitted[index][0]
}

/**
 * Helper for testing multiple emitted events
 */
export function getAllEmittedEvents(wrapper: VueWrapper, eventName: string) {
  const emitted = wrapper.emitted(eventName)
  if (!emitted) return []
  return emitted.map(emission => emission[0])
}

/**
 * Test component slots
 */
export function testSlot(
  component: Component,
  slotName: string,
  slotContent: string | Component,
  assertion: (wrapper: VueWrapper) => void
) {
  const wrapper = mount(component, {
    slots: {
      [slotName]: slotContent
    }
  })
  
  assertion(wrapper)
  wrapper.unmount()
}

/**
 * Test component with provide/inject
 */
export function mountWithProvide(
  component: Component,
  provides: Record<string, any>,
  options: MountingOptions<any> = {}
): VueWrapper {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      provide: {
        ...provides,
        ...options.global?.provide
      }
    }
  })
}

/**
 * Helper for testing v-model
 * Following Vue's v-model testing recommendations
 */
export async function testVModel(
  wrapper: VueWrapper,
  inputTestId: string,
  modelValue: any,
  expectedEmit: any
) {
  // Set initial value
  await wrapper.setProps({ modelValue })
  
  // Find input and change value
  const input = wrapper.find(`[data-test="${inputTestId}"]`)
  await input.setValue(expectedEmit)
  
  // Check emission
  expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([expectedEmit])
}

/**
 * Helper for testing async components
 */
export async function waitForAsyncComponent(
  wrapper: VueWrapper,
  timeout = 1000
): Promise<void> {
  const startTime = Date.now()
  
  while (wrapper.vm.$el.querySelector('.loading')) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Async component did not load in time')
    }
    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()
  }
}

/**
 * Helper for testing transitions
 */
export async function testTransition(
  wrapper: VueWrapper,
  triggerAction: () => Promise<void>,
  enterClass: string,
  leaveClass: string
) {
  // Check initial state
  const element = wrapper.find('[data-test="transition-element"]')
  
  // Trigger enter transition
  await triggerAction()
  expect(element.classes()).toContain(enterClass)
  
  // Wait for transition to complete
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Trigger leave transition
  await triggerAction()
  expect(element.classes()).toContain(leaveClass)
}

/**
 * Test component lifecycle hooks
 */
export function testLifecycleHook(
  component: Component,
  hookName: string,
  setup: () => any,
  assertion: (result: any) => void
) {
  let hookCalled = false
  let hookResult: any

  const TestComponent = {
    ...component,
    [hookName]() {
      hookCalled = true
      hookResult = setup()
      // Call original hook if exists
      const componentHook = (component as any)[hookName]
      if (componentHook) {
        componentHook.call(this)
      }
    }
  }

  const wrapper = mount(TestComponent)

  expect(hookCalled).toBe(true)
  assertion(hookResult)

  wrapper.unmount()
}

/**
 * Helper for testing computed properties
 */
export async function testComputed(
  wrapper: VueWrapper,
  computedName: string,
  setupState: () => Promise<void>,
  expectedValue: any
) {
  await setupState()
  await wrapper.vm.$nextTick()
  expect((wrapper.vm as any)[computedName]).toEqual(expectedValue)
}

/**
 * Helper for testing watchers
 */
export async function testWatcher(
  wrapper: VueWrapper,
  watchedProp: string,
  newValue: any,
  assertion: (wrapper: VueWrapper) => void | Promise<void>
) {
  await wrapper.setProps({ [watchedProp]: newValue })
  await wrapper.vm.$nextTick()
  await assertion(wrapper)
}

/**
 * Helper to test component error handling
 */
export function testErrorBoundary(
  component: Component,
  triggerError: (wrapper: VueWrapper) => void,
  errorMessage: string
) {
  const wrapper = mount(component, {
    global: {
      config: {
        errorHandler: (err: unknown) => {
          expect((err as Error).message).toBe(errorMessage)
        }
      }
    }
  })

  triggerError(wrapper)
  wrapper.unmount()
}

/**
 * Utility to create a wrapper factory for repeated tests
 */
export function createWrapperFactory(
  component: Component,
  defaultOptions: MountingOptions<any> = {}
) {
  return (overrides: MountingOptions<any> = {}) => {
    return mount(component, {
      ...defaultOptions,
      ...overrides,
      props: {
        ...defaultOptions.props,
        ...overrides.props
      },
      global: {
        ...defaultOptions.global,
        ...overrides.global
      }
    })
  }
}
