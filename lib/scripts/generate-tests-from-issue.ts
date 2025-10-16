#!/usr/bin/env node

/**
 * Generate Tests from GitHub Issue
 * Used by GitHub Actions workflow to create test files from parsed issue data
 * Usage: node generate-tests-from-issue.js <componentName> <requirementsJson> [issueNumber] [issueTitle]
 */

import { generateTestContent, validateRequirements } from '../test-generator/index.js';
import { performFullValidation } from '../test-generator/validator.js';
import type { TestRequirements } from '../test-generator/types.js';

// Parse command line arguments
const [,, componentName, requirementsJson, issueNumber, issueTitle, ...flags] = process.argv;

if (!componentName || !requirementsJson) {
  console.error('Usage: node generate-tests-from-issue.js <componentName> <requirementsJson> [issueNumber] [issueTitle] [--ai-generate] [--copilot-ready]');
  process.exit(1);
}

// Validate component name to prevent path traversal
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Invalid component name. Must be PascalCase (e.g., MyComponent)');
  console.error('Component names can only contain letters and numbers, and must start with an uppercase letter.');
  process.exit(1);
}

// Check for generation flags
const aiGenerate = flags.includes('--ai-generate') || process.env.AI_GENERATE === 'true';
const copilotReady = flags.includes('--copilot-ready') || process.env.COPILOT_READY === 'true';

async function main() {
  try {
    // Parse requirements from JSON
    const requirements = JSON.parse(requirementsJson) as TestRequirements;

    // Validate requirements
    const validation = validateRequirements(requirements);
    if (!validation.valid) {
      console.error('❌ Invalid requirements:');
      validation.errors.forEach((error: string) => console.error(`  - ${error}`));
      process.exit(1);
    }

    // Generate test content
    const testContent = await generateTestContent(
      componentName,
      requirements,
      {
        issueNumber,
        issueTitle,
        aiGenerate,
        copilotReady
      }
    );

  // Validate generated test content
  const contentValidation = performFullValidation(testContent, componentName);

  if (!contentValidation.valid) {
    console.error('❌ Generated test content has errors:');
    contentValidation.errors.forEach((error: string) => console.error(`  - ${error}`));
    process.exit(1);
  }

  if (contentValidation.warnings.length > 0) {
    console.warn('⚠️  Generated test content has warnings:');
    contentValidation.warnings.forEach((warning: string) => console.warn(`  - ${warning}`));
  }

  // Output test content to stdout for GitHub Actions to capture
  console.log('TEST_CONTENT_START');
  console.log(testContent);
  console.log('TEST_CONTENT_END');

  console.error('\n✅ Test generation successful');
  console.error(`  - Total tests: ${contentValidation.summary.totalErrors + contentValidation.summary.totalWarnings}`);
  console.error(`  - Has accessibility tests: ${contentValidation.summary.hasAccessibilityTests}`);
  console.error(`  - Follows TDD pattern: ${contentValidation.summary.followsTddPattern}`);

    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error generating tests:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run main function
void main();
