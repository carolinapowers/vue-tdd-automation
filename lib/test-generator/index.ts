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
import { generateTestWithAI, validateAIConfig } from './ai-generator.js';
import { generateEnhancedScaffold, type EnhancedScaffoldContext } from './enhanced-scaffold.js';

/**
 * Generates a complete test file content based on requirements
 */
export async function generateTestContent(
  componentName: string,
  requirements: TestRequirements,
  options: TestGenerationOptions = {}
): Promise<string> {
  const {
    userStory = '',
    acceptanceCriteria = [],
    happyPath = [],
    edgeCases = [],
    errorCases = [],
    props = '',
    events = ''
  } = requirements;

  const { issueNumber, issueTitle, aiGenerate = false } = options;

  // Log AI generation status
  if (aiGenerate) {
    const config = validateAIConfig();
    if (config.valid) {
      console.log(`✨ AI test generation enabled (${config.provider})`);
    } else {
      console.log(`⚠️  AI generation requested but ${config.message}`);
      console.log('📝 Falling back to enhanced scaffolds');
    }
  }

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

  const sectionContext = {
    props,
    events,
    userStory,
    acceptanceCriteria,
    aiGenerate
  };

  // Acceptance Criteria section
  if (acceptanceCriteria.length > 0) {
    sections.push(await generateTestSection(
      'Acceptance Criteria',
      acceptanceCriteria,
      componentName,
      'acceptance',
      sectionContext
    ));
  }

  // Happy Path section
  if (happyPath.length > 0) {
    sections.push(await generateTestSection(
      'Happy Path',
      happyPath,
      componentName,
      'happy',
      sectionContext
    ));
  }

  // Edge Cases section
  if (edgeCases.length > 0) {
    sections.push(await generateTestSection(
      'Edge Cases',
      edgeCases,
      componentName,
      'edge',
      sectionContext
    ));
  }

  // Error Handling section
  if (errorCases.length > 0) {
    sections.push(await generateTestSection(
      'Error Handling',
      errorCases,
      componentName,
      'error',
      sectionContext
    ));
  }

  // Accessibility section (always included)
  sections.push(await generateAccessibilitySection(componentName, sectionContext));

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
async function generateTestSection(
  sectionTitle: string,
  scenarios: string[],
  componentName: string,
  type: TestCaseType,
  context: TestSectionContext = {}
): Promise<string> {
  const testCases = await Promise.all(
    scenarios.map(scenario =>
      generateTestCase(scenario, componentName, type, context)
    )
  );

  return `  describe('${sectionTitle}', () => {
${testCases.join('\n\n')}
  });`;
}

/**
 * Generates a single test case
 */
async function generateTestCase(
  scenario: string,
  componentName: string,
  type: TestCaseType,
  context: TestSectionContext = {}
): Promise<string> {
  const testName = normalizeTestName(scenario);
  const verb = type === 'edge' || type === 'error' ? 'handle' : '';
  const description = verb ? `${verb} ${testName}` : testName;

  const typeLabel: Record<TestCaseType, string> = {
    acceptance: 'Acceptance Criteria',
    happy: 'Happy Path',
    edge: 'Edge Case',
    error: 'Error Case'
  };

  // Try AI generation if enabled
  if (context.aiGenerate) {
    const aiResult = await generateTestWithAI({
      componentName,
      scenario,
      type: type as 'acceptance' | 'happy' | 'edge' | 'error' | 'accessibility',
      props: context.props,
      events: context.events,
      userStory: context.userStory,
      acceptanceCriteria: context.acceptanceCriteria
    });

    if (aiResult) {
      return `    it('should ${description}', async () => {
      // ${typeLabel[type]}: ${scenario}
${aiResult.split('\n').map(line => `      ${line}`).join('\n')}
    });`;
    }
  }

  // Fallback to enhanced scaffold
  const scaffoldContext: EnhancedScaffoldContext = {
    componentName,
    scenario,
    type: type as 'acceptance' | 'happy' | 'edge' | 'error' | 'accessibility',
    description,
    props: context.props,
    events: context.events
  };

  return generateEnhancedScaffold(scaffoldContext);
}

/**
 * Generates the accessibility test section
 */
async function generateAccessibilitySection(
  componentName: string,
  context: TestSectionContext = {}
): Promise<string> {
  const scenarios = [
    { description: 'be accessible to screen readers', scenario: 'Component should have proper ARIA labels and semantic HTML' },
    { description: 'be keyboard navigable', scenario: 'User should be able to navigate and interact using keyboard only' }
  ];

  const testCases = await Promise.all(
    scenarios.map(async ({ description, scenario }) => {
      // Try AI generation if enabled
      if (context.aiGenerate) {
        const aiResult = await generateTestWithAI({
          componentName,
          scenario,
          type: 'accessibility',
          props: context.props,
          events: context.events,
          userStory: context.userStory,
          acceptanceCriteria: context.acceptanceCriteria
        });

        if (aiResult) {
          return `    it('should ${description}', async () => {
${aiResult.split('\n').map(line => `      ${line}`).join('\n')}
    });`;
        }
      }

      // Fallback to enhanced scaffold
      const scaffoldContext: EnhancedScaffoldContext = {
        componentName,
        scenario,
        type: 'accessibility',
        description,
        props: context.props,
        events: context.events
      };

      return generateEnhancedScaffold(scaffoldContext);
    })
  );

  return `  describe('Accessibility', () => {
${testCases.join('\n\n')}
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
