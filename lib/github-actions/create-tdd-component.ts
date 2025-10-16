#!/usr/bin/env node

/**
 * TDD Component Generator
 * Following Vue.js testing recommendations - tests live alongside components
 * Usage: node scripts/create-tdd-component.js ComponentName "Issue #1: Description"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get arguments
const componentName = process.argv[2];
const issueDescription = process.argv[3] || `Issue: ${componentName} Component`;

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: node scripts/create-tdd-component.js ComponentName "Issue #1: Description"');
  process.exit(1);
}

// Paths
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const testFile = path.join(componentsDir, `${componentName}.test.ts`);
const componentFile = path.join(componentsDir, `${componentName}.vue`);

// Test template
const testTemplate = `/**
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

// Component template (minimal - to be implemented after tests)
const componentTemplate = `<template>
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

// Create component directory if it doesn't exist
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Check if files already exist
if (fs.existsSync(testFile)) {
  console.error(`❌ Test file already exists: ${testFile}`);
  process.exit(1);
}

if (fs.existsSync(componentFile)) {
  console.error(`❌ Component file already exists: ${componentFile}`);
  process.exit(1);
}

// Write files
try {
  // Write test file first (TDD!)
  fs.writeFileSync(testFile, testTemplate);
  console.log(`✅ Created test file: ${testFile}`);

  // Write minimal component file
  fs.writeFileSync(componentFile, componentTemplate);
  console.log(`✅ Created component file: ${componentFile}`);

  console.log('\n📋 Next steps:');
  console.log('1. Update the test file with actual requirements from your GitHub issue');
  console.log('2. Run tests in watch mode: npm run tdd');
  console.log('3. Verify all tests fail (RED phase)');
  console.log('4. Implement the component to make tests pass (GREEN phase)');
  console.log('5. Refactor while keeping tests green (REFACTOR phase)');
  console.log('\n🚀 Happy TDD coding!');

} catch (error) {
  const err = error as Error;
  console.error('❌ Error creating files:', err.message);
  process.exit(1);
}
