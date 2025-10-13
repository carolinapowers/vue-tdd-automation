/**
 * Unit tests for test generator module
 */

import { describe, it, expect } from 'vitest';
import {
  generateTestContent,
  isValidComponentName,
  validateRequirements
} from '../../lib/test-generator/index.js';
import type { TestRequirements } from '../../lib/test-generator/types.js';

describe('Test Generator', () => {
  describe('isValidComponentName', () => {
    it('should accept valid PascalCase names', () => {
      expect(isValidComponentName('UserProfile')).toBe(true);
      expect(isValidComponentName('TodoList')).toBe(true);
      expect(isValidComponentName('Button')).toBe(true);
      expect(isValidComponentName('HTTPClient')).toBe(true);
    });

    it('should reject invalid component names', () => {
      expect(isValidComponentName('userProfile')).toBe(false); // camelCase
      expect(isValidComponentName('user-profile')).toBe(false); // kebab-case
      expect(isValidComponentName('user_profile')).toBe(false); // snake_case
      expect(isValidComponentName('123Component')).toBe(false); // starts with number
      expect(isValidComponentName('')).toBe(false); // empty
    });
  });

  describe('validateRequirements', () => {
    it('should accept valid requirements', () => {
      const requirements: TestRequirements = {
        userStory: 'As a user, I want to login',
        acceptanceCriteria: ['User can enter credentials', 'User can submit form'],
        happyPath: ['Successful login'],
        edgeCases: ['Empty credentials'],
        errorCases: ['Invalid credentials']
      };

      const result = validateRequirements(requirements);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require at least one test scenario', () => {
      const requirements: TestRequirements = {
        userStory: 'As a user, I want to login'
      };

      const result = validateRequirements(requirements);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one test scenario is required (acceptance criteria, happy path, edge case, or error case)');
    });

    it('should require a user story', () => {
      const requirements: TestRequirements = {
        userStory: '',
        acceptanceCriteria: ['Test']
      };

      const result = validateRequirements(requirements);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('User story is required');
    });
  });

  describe('generateTestContent', () => {
    it('should generate valid test content with all sections', () => {
      const requirements: TestRequirements = {
        userStory: 'As a user, I want to see a button',
        acceptanceCriteria: ['Button is visible', 'Button is clickable'],
        happyPath: ['Click button successfully'],
        edgeCases: ['Button disabled state'],
        errorCases: ['Button with invalid props'],
        props: 'label: string, disabled: boolean',
        events: 'click, focus'
      };

      const content = generateTestContent('TestButton', requirements);

      // Check header
      expect(content).toContain('TestButton Component Tests');
      expect(content).toContain('User Story: As a user, I want to see a button');
      expect(content).toContain('TDD approach');

      // Check imports
      expect(content).toContain("import { describe, it, expect");
      expect(content).toContain("import { render");
      expect(content).toContain("import TestButton from './TestButton.vue'");

      // Check test structure
      expect(content).toContain("describe('TestButton Component'");
      expect(content).toContain("beforeEach(");
      expect(content).toContain("afterEach(");

      // Check test sections
      expect(content).toContain("describe('Acceptance Criteria'");
      expect(content).toContain("describe('Happy Path'");
      expect(content).toContain("describe('Edge Cases'");
      expect(content).toContain("describe('Error Handling'");
      expect(content).toContain("describe('Accessibility'");

      // Check test cases
      expect(content).toContain('Button is visible');
      expect(content).toContain('Click button successfully');
      expect(content).toContain('Button disabled state');
      expect(content).toContain('Button with invalid props');

      // Check TDD red phase
      expect(content).toContain('expect(true).toBe(false)');
      expect(content).toContain('// Red phase');
    });

    it('should include issue information when provided', () => {
      const requirements: TestRequirements = {
        userStory: 'As a user, I want to see a button',
        acceptanceCriteria: ['Button is visible']
      };

      const content = generateTestContent('TestButton', requirements, {
        issueNumber: 42,
        issueTitle: 'Add button component'
      });

      expect(content).toContain('GitHub Issue #42');
      expect(content).toContain('Add button component');
    });

    it('should handle minimal requirements', () => {
      const requirements: TestRequirements = {
        userStory: 'As a user, I want a component',
        happyPath: ['Component renders']
      };

      const content = generateTestContent('MinimalComponent', requirements);

      expect(content).toContain("describe('MinimalComponent Component'");
      expect(content).toContain("describe('Happy Path'");
      expect(content).toContain('Component renders');
      expect(content).toContain("describe('Accessibility'"); // Always included
    });

    it('should normalize test names', () => {
      const requirements: TestRequirements = {
        userStory: 'Test',
        acceptanceCriteria: ['User can click the "Submit" button!']
      };

      const content = generateTestContent('TestComponent', requirements);

      // Should normalize to lowercase and remove special characters
      expect(content).toContain("should user can click the submit button");
    });

    it('should include TODO comments for guidance', () => {
      const requirements: TestRequirements = {
        userStory: 'Test',
        acceptanceCriteria: ['Test criterion']
      };

      const content = generateTestContent('TestComponent', requirements);

      expect(content).toContain('// TODO:');
    });

    it('should include accessibility tests', () => {
      const requirements: TestRequirements = {
        userStory: 'Test',
        acceptanceCriteria: ['Test']
      };

      const content = generateTestContent('TestComponent', requirements);

      expect(content).toContain('should be accessible to screen readers');
      expect(content).toContain('should be keyboard navigable');
      expect(content).toContain('// TODO: Add accessibility checks');
    });
  });
});
