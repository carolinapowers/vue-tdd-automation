/**
 * Test Validator Module
 * Quality checks for generated test content
 */

import type { ValidationResult, FullValidationResult } from './types.js';

/**
 * Validates the quality of generated test content
 */
export function validateTestContent(
  testContent: string,
  componentName: string
): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check 1: Valid content exists
  if (!testContent || testContent.trim() === '') {
    errors.push('Test content is empty');
    return { valid: false, warnings, errors };
  }

  // Check 2: Required imports
  const requiredImports = [
    'describe',
    'it',
    'expect',
    'render',
    componentName
  ];

  for (const importName of requiredImports) {
    if (!testContent.includes(importName)) {
      errors.push(`Missing required import or usage: ${importName}`);
    }
  }

  // Check 3: Has at least one describe block
  if (!testContent.match(/describe\(/)) {
    errors.push('No describe blocks found');
  }

  // Check 4: Has at least one test case
  if (!testContent.match(/it\(/)) {
    errors.push('No test cases (it blocks) found');
  }

  // Check 5: TDD Red phase - should have failing assertions
  const hasRedPhase = testContent.includes('expect(true).toBe(false)') ||
                       testContent.includes('// Red phase');
  if (!hasRedPhase) {
    warnings.push('Tests may not follow TDD red phase pattern (no intentionally failing assertions)');
  }

  // Check 6: Has TODO comments for implementation guidance
  const todoCount = (testContent.match(/\/\/ TODO:/g) || []).length;
  if (todoCount === 0) {
    warnings.push('No TODO comments found - developers may lack implementation guidance');
  }

  // Check 7: Testing Library best practices
  if (testContent.includes('render(') && !testContent.includes('const { user }')) {
    warnings.push('Consider using Testing Library user-event for better user interaction testing');
  }

  // Check 8: Accessibility tests included
  if (!testContent.includes('Accessibility')) {
    warnings.push('No accessibility test section found');
  }

  // Check 9: Proper async/await usage
  const asyncTests = testContent.match(/it\([^,]+,\s*async\s*\(/g) || [];
  const awaitUsage = testContent.match(/await\s+/g) || [];

  if (asyncTests.length > awaitUsage.length) {
    warnings.push('Some async tests may be missing await statements');
  }

  // Check 10: beforeEach/afterEach hooks for cleanup
  if (testContent.includes('vi.') && !testContent.includes('afterEach')) {
    warnings.push('Using vi (mocks) but missing afterEach cleanup - may cause test interference');
  }

  // Check 11: Component name matches filename pattern
  const escapedComponentName = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const importPattern = new RegExp(`import ${escapedComponentName} from '\\.\\/${escapedComponentName}\\.vue'`);
  if (!importPattern.test(testContent)) {
    errors.push(`Component import path doesn't match expected pattern: ./${componentName}.vue`);
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Validates test file structure and organization
 */
export function validateTestStructure(testContent: string): ValidationResult {
  const warnings: string[] = [];

  // Extract all describe blocks
  const describeBlocks = extractDescribeBlocks(testContent);

  // Check for nested describe structure
  if (describeBlocks.length === 0) {
    return { valid: false, warnings: ['No describe blocks found'], errors: [] };
  }

  // Check for logical grouping
  const recommendedSections = [
    'Acceptance Criteria',
    'Happy Path',
    'Edge Cases',
    'Error Handling',
    'Accessibility'
  ];

  const missingSections = recommendedSections.filter(section =>
    !testContent.includes(`describe('${section}',`)
  );

  if (missingSections.length > 0) {
    warnings.push(`Consider adding test sections: ${missingSections.join(', ')}`);
  }

  // Check test naming conventions
  const testPattern = /it\(['"]should\s+(.+?)['"]/g;
  const tests = [...testContent.matchAll(testPattern)];

  const nonDescriptiveTests = tests.filter(match =>
    match[1].length < 10 || !match[1].includes(' ')
  );

  if (nonDescriptiveTests.length > 0) {
    warnings.push(`${nonDescriptiveTests.length} test(s) have very short or non-descriptive names`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
    errors: []
  };
}

/**
 * Extracts describe block names from test content
 */
function extractDescribeBlocks(content: string): string[] {
  const pattern = /describe\(['"](.+?)['"]/g;
  const blocks: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    blocks.push(match[1]);
  }

  return blocks;
}

/**
 * Performs comprehensive validation on generated test
 */
export function performFullValidation(
  testContent: string,
  componentName: string
): FullValidationResult {
  const contentValidation = validateTestContent(testContent, componentName);
  const structureValidation = validateTestStructure(testContent);

  return {
    valid: contentValidation.valid && structureValidation.valid,
    errors: contentValidation.errors,
    warnings: [...contentValidation.warnings, ...structureValidation.warnings],
    summary: {
      totalErrors: contentValidation.errors.length,
      totalWarnings: contentValidation.warnings.length + structureValidation.warnings.length,
      hasAccessibilityTests: testContent.includes('Accessibility'),
      hasTodoComments: testContent.includes('// TODO:'),
      followsTddPattern: testContent.includes('expect(true).toBe(false)')
    }
  };
}
