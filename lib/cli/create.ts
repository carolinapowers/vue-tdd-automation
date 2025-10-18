/**
 * Create a new component with TDD tests
 * Self-contained implementation - no need for copied scripts
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export interface CreateOptions {
  description?: string;
}

export function createComponent(name: string, options: CreateOptions = {}): void {
  const { description = `Component: ${name}` } = options;
  const cwd = process.cwd();

  // Validate component name
  if (!name || !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Component name must start with a capital letter and contain only alphanumeric characters');
  }

  // Paths
  const componentsDir = path.join(cwd, 'src', 'components');
  const testFile = path.join(componentsDir, `${name}.test.ts`);
  const componentFile = path.join(componentsDir, `${name}.vue`);

  // Create components directory if it doesn't exist
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Check if files already exist
  if (fs.existsSync(testFile)) {
    throw new Error(`Test file already exists: ${testFile}`);
  }
  if (fs.existsSync(componentFile)) {
    throw new Error(`Component file already exists: ${componentFile}`);
  }

  // Generate test template
  const testTemplate = generateTestTemplate(name, description);

  // Generate component template
  const componentTemplate = generateComponentTemplate(name);

  // Write files
  try {
    // Write test file first (TDD!)
    fs.writeFileSync(testFile, testTemplate);
    console.log(chalk.green(`✅ Created test file: ${testFile}`));

    // Write minimal component file
    fs.writeFileSync(componentFile, componentTemplate);
    console.log(chalk.green(`✅ Created component file: ${componentFile}`));

    console.log(chalk.blue('\n📋 Next steps:'));
    console.log(chalk.white('1. Update the test file with actual requirements from your GitHub issue'));
    console.log(chalk.white('2. Run tests in watch mode: npm run tdd'));
    console.log(chalk.white('3. Verify all tests fail (RED phase)'));
    console.log(chalk.white('4. Implement the component to make tests pass (GREEN phase)'));
    console.log(chalk.white('5. Refactor while keeping tests green (REFACTOR phase)'));
    console.log(chalk.blue('\n🚀 Happy TDD coding!'));
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to create files: ${err.message}`);
  }
}

function generateTestTemplate(componentName: string, issueDescription: string): string {
  return `/**
 * ${issueDescription}
 *
 * User Story: As a [user type], I want [feature] so that [benefit]
 *
 * Acceptance Criteria:
 * - Given [context], when [action], then [expected outcome]
 * - Given [context], when [action], then [expected outcome]
 *
 * TODO: Update this with actual requirements from GitHub issue
 */

import { describe, it, expect, beforeEach } from 'vitest'
// import { vi } from 'vitest' // Uncomment if you need to mock functions
import { mount, VueWrapper } from '@vue/test-utils'
import ${componentName} from './${componentName}.vue'

describe('${componentName}', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(${componentName}, {
      props: {
        // Add default props here
      }
    })
  })

  describe('Component Initialization', () => {
    it('should render the component', () => {
      expect(wrapper.find('[data-testid="${componentName.toLowerCase()}-container"]').exists()).toBe(true)
    })

    it('should display the correct initial state', () => {
      // TODO: Add initialization tests
      expect(true).toBe(false) // This should fail initially (TDD!)
    })
  })

  describe('Props', () => {
    it('should accept and display prop values correctly', async () => {
      // TODO: Test prop handling
      expect(true).toBe(false)
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      // TODO: Test user interactions
      expect(true).toBe(false)
    })
  })

  describe('Emitted Events', () => {
    it('should emit events with correct payload', async () => {
      // TODO: Test event emissions
      expect(true).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      // TODO: Test accessibility
      expect(true).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle edge cases gracefully', () => {
      // TODO: Test edge cases
      expect(true).toBe(false)
    })
  })
})
`;
}

function generateComponentTemplate(componentName: string): string {
  return `<template>
  <div data-testid="${componentName.toLowerCase()}-container">
    <!-- TODO: Implement component to pass tests -->
    <h2>${componentName} Component</h2>
    <p>Implementation pending - write tests first!</p>
  </div>
</template>

<script setup lang="ts">
// Uncomment imports as needed
// import { ref, computed, watch } from 'vue'

// Props - uncomment and define when needed
// interface Props {
//   // TODO: Define props based on test requirements
// }
// const props = defineProps<Props>()

// Emits - uncomment and define when needed
// const emit = defineEmits<{
//   // TODO: Define events based on test requirements
// }>()

// State
// TODO: Add reactive state as needed

// Methods
// TODO: Implement methods to satisfy tests

// Computed
// TODO: Add computed properties as needed
</script>

<style scoped>
/* TODO: Add styles */
</style>
`;
}
