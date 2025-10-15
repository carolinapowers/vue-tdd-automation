/**
 * Type definitions for TDD test generator
 */

/**
 * Feature requirements for test generation
 */
export interface TestRequirements {
  /** User story describing the feature (e.g., "As a user, I want...") */
  userStory: string;

  /** List of acceptance criteria that must be met */
  acceptanceCriteria?: string[];

  /** Happy path test scenarios */
  happyPath?: string[];

  /** Edge case scenarios to test */
  edgeCases?: string[];

  /** Error case scenarios to test */
  errorCases?: string[];

  /** Component props definition (e.g., "value: string, disabled: boolean") */
  props?: string;

  /** Component events definition (e.g., "change, submit, cancel") */
  events?: string;
}

/**
 * Additional options for test generation
 */
export interface TestGenerationOptions {
  /** GitHub issue number (optional) */
  issueNumber?: string | number;

  /** GitHub issue title (optional) */
  issueTitle?: string;

  /** Enable AI-powered test generation (requires API key) */
  aiGenerate?: boolean;
}

/**
 * Test case type identifier
 */
export type TestCaseType = 'acceptance' | 'happy' | 'edge' | 'error';

/**
 * Validation result structure
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** List of error messages (blocking issues) */
  errors: string[];

  /** List of warning messages (non-blocking issues) */
  warnings: string[];
}

/**
 * Extended validation result with detailed summary
 */
export interface FullValidationResult extends ValidationResult {
  /** Summary of validation checks */
  summary: ValidationSummary;
}

/**
 * Validation summary statistics
 */
export interface ValidationSummary {
  /** Total number of errors found */
  totalErrors: number;

  /** Total number of warnings found */
  totalWarnings: number;

  /** Whether accessibility tests are included */
  hasAccessibilityTests: boolean;

  /** Whether TODO comments are present for guidance */
  hasTodoComments: boolean;

  /** Whether TDD red phase pattern is followed */
  followsTddPattern: boolean;
}

/**
 * Test section context for generation
 */
export interface TestSectionContext {
  /** Component props definition */
  props?: string;

  /** Component events definition */
  events?: string;

  /** User story for context */
  userStory?: string;

  /** Acceptance criteria for context */
  acceptanceCriteria?: string[];

  /** Enable AI generation */
  aiGenerate?: boolean;
}

/**
 * Test scenario for enhanced scaffold generation
 */
export interface TestScenario {
  type: 'acceptance' | 'happy' | 'edge' | 'error' | 'accessibility';
  description: string;
  scenario: string;
}
