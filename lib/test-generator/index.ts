/**
 * Test Generator Module
 * Shared logic for generating TDD test files from feature requirements
 * Used by both CLI tool and GitHub Actions workflow
 */

import type {
  TestRequirements,
  TestGenerationOptions,
  TestCaseType,
  TestSectionContext,
  ValidationResult
} from './types.js';

/**
 * Generates a complete test file content based on requirements
 */
export function generateTestContent(
  componentName: string,
  requirements: TestRequirements,
  options: TestGenerationOptions = {}
): string {
  const {
    userStory = '',
    acceptanceCriteria = [],
    happyPath = [],
    edgeCases = [],
    errorCases = [],
    props = ''
    // events is available in requirements but not currently used in generation
  } = requirements;

  const { issueNumber, issueTitle } = options;

  // Build header comment
  let headerComment = `/**\n * ${componentName} Component Tests\n`;

  if (issueNumber && issueTitle) {
    headerComment += ` * GitHub Issue #${issueNumber}: ${issueTitle}\n *\n`;
  } else {
    headerComment += ` * Auto-generated from TDD Feature CLI\n *\n`;
  }

  headerComment += ` * User Story: ${userStory}\n`;
  headerComment += ` *\n`;
  headerComment += ` * This test file follows TDD approach - all tests should fail initially (Red phase)\n`;
  headerComment += ` */\n`;

  // Build imports
  const imports = `
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/helpers/testing-library'
import { mount } from '@vue/test-utils'
import ${componentName} from './${componentName}.vue'
`.trim();

  // Build test sections
  const sections: string[] = [];

  // Acceptance Criteria section
  if (acceptanceCriteria.length > 0) {
    sections.push(generateTestSection(
      'Acceptance Criteria',
      acceptanceCriteria,
      componentName,
      'acceptance',
      { props }
    ));
  }

  // Happy Path section
  if (happyPath.length > 0) {
    sections.push(generateTestSection(
      'Happy Path',
      happyPath,
      componentName,
      'happy',
      { props }
    ));
  }

  // Edge Cases section
  if (edgeCases.length > 0) {
    sections.push(generateTestSection(
      'Edge Cases',
      edgeCases,
      componentName,
      'edge',
      { props }
    ));
  }

  // Error Handling section
  if (errorCases.length > 0) {
    sections.push(generateTestSection(
      'Error Handling',
      errorCases,
      componentName,
      'error',
      { props }
    ));
  }

  // Accessibility section (always included)
  sections.push(generateAccessibilitySection(componentName));

  // Combine all sections
  const testBody = `
describe('${componentName} Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

${sections.join('\n\n')}
});`.trim();

  // Return complete test file
  return `${headerComment}\n\n${imports}\n\n${testBody}\n`;
}

/**
 * Generates a test section with multiple test cases
 */
function generateTestSection(
  sectionTitle: string,
  scenarios: string[],
  componentName: string,
  type: TestCaseType,
  context: TestSectionContext = {}
): string {
  const testCases = scenarios.map(scenario =>
    generateTestCase(scenario, componentName, type, context)
  ).join('\n\n');

  return `  describe('${sectionTitle}', () => {
${testCases}
  });`;
}

/**
 * Generates a single test case
 */
function generateTestCase(
  scenario: string,
  componentName: string,
  type: TestCaseType,
  context: TestSectionContext = {}
): string {
  const testName = normalizeTestName(scenario);
  const verb = type === 'edge' || type === 'error' ? 'handle' : '';
  const description = verb ? `${verb} ${testName}` : testName;

  const typeLabel: Record<TestCaseType, string> = {
    acceptance: 'Acceptance Criteria',
    happy: 'Happy Path',
    edge: 'Edge Case',
    error: 'Error Case'
  };

  const propsComment = context.props
    ? `\n      // TODO: Add required props based on: ${context.props}`
    : '';

  return `    it('should ${description}', async () => {
      // ${typeLabel[type]}: ${scenario}
      const { user } = render(${componentName}${context.props ? `, {
        props: {${propsComment}
        }
      }` : ''});

      // TODO: Implement test for: ${scenario}

      expect(true).toBe(false); // Red phase - this should fail
    });`;
}

/**
 * Generates the accessibility test section
 */
function generateAccessibilitySection(componentName: string): string {
  return `  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(${componentName});

      // TODO: Add accessibility checks
      // - Check for proper ARIA labels
      // - Verify semantic HTML elements
      // - Ensure proper heading hierarchy

      expect(true).toBe(false); // Red phase - this should fail
    });

    it('should be keyboard navigable', async () => {
      const { user } = render(${componentName});

      // TODO: Test keyboard navigation
      // await user.tab();
      // expect(element).toHaveFocus();

      expect(true).toBe(false); // Red phase - this should fail
    });
  });`;
}

/**
 * Normalizes a test scenario into a valid test name
 */
function normalizeTestName(scenario: string): string {
  return scenario
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates component name follows PascalCase convention
 */
export function isValidComponentName(componentName: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(componentName);
}

/**
 * Validates requirements object has minimum required fields
 */
export function validateRequirements(requirements: TestRequirements): ValidationResult {
  const errors: string[] = [];

  if (!requirements) {
    return { valid: false, errors: ['Requirements object is required'], warnings: [] };
  }

  // At least one test scenario is required
  const hasScenarios =
    (requirements.acceptanceCriteria?.length ?? 0) > 0 ||
    (requirements.happyPath?.length ?? 0) > 0 ||
    (requirements.edgeCases?.length ?? 0) > 0 ||
    (requirements.errorCases?.length ?? 0) > 0;

  if (!hasScenarios) {
    errors.push('At least one test scenario is required (acceptance criteria, happy path, edge case, or error case)');
  }

  // Validate user story exists
  if (!requirements.userStory || requirements.userStory.trim() === '') {
    errors.push('User story is required');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
