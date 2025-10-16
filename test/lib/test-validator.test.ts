/**
 * Unit tests for test validator module
 */

import { describe, it, expect } from 'vitest';
import {
  validateTestContent,
  validateTestStructure,
  performFullValidation
} from '../../lib/shared/test-generator/validator.js';

describe('Test Validator', () => {
  describe('validateTestContent', () => {
    const validTestContent = `
/**
 * TestComponent Component Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/helpers/testing-library'
import TestComponent from './TestComponent.vue'

describe('TestComponent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(TestComponent);
      // TODO: Add accessibility checks
      expect(true).toBe(false); // Red phase
    });

    it('should be keyboard navigable', async () => {
      const { user } = render(TestComponent);
      // TODO: Test keyboard navigation
      expect(true).toBe(false); // Red phase
    });
  });
});
`;

    it('should validate content with all required elements', () => {
      const result = validateTestContent(validTestContent, 'TestComponent');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing imports', () => {
      const content = `
describe('Test', () => {
  it('test', () => {});
});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required import or usage: render');
      expect(result.errors).toContain('Missing required import or usage: TestComponent');
    });

    it('should detect missing describe blocks', () => {
      const content = `
import { describe, it, expect } from 'vitest'
it('test', () => {});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No describe blocks found');
    });

    it('should detect missing test cases', () => {
      const content = `
import { describe, it, expect } from 'vitest'
describe('Test', () => {});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No test cases (it blocks) found');
    });

    it('should warn about missing TDD red phase', () => {
      const content = `
import { describe, it, expect, render } from 'vitest'
import TestComponent from './TestComponent.vue'

describe('TestComponent', () => {
  it('test', () => {
    render(TestComponent);
    const { user } = render(TestComponent);
    expect(true).toBe(true);
  });
});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.warnings).toContain('Tests may not follow TDD red phase pattern (no intentionally failing assertions)');
    });

    it('should warn about missing TODO comments', () => {
      const content = `
import { describe, it, expect, render } from 'vitest'
import TestComponent from './TestComponent.vue'

describe('TestComponent', () => {
  it('test', () => {
    const { user } = render(TestComponent);
    expect(true).toBe(false);
  });
});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.warnings).toContain('No TODO comments found - developers may lack implementation guidance');
    });

    it('should warn about missing accessibility tests', () => {
      const content = `
import { describe, it, expect, render } from 'vitest'
import TestComponent from './TestComponent.vue'

describe('TestComponent', () => {
  it('test', () => {
    const { user } = render(TestComponent);
    // TODO: test
    expect(true).toBe(false);
  });
});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.warnings).toContain('No accessibility test section found');
    });

    it('should validate component import path', () => {
      const content = `
import { describe, it, expect, render } from 'vitest'
import TestComponent from './WrongComponent.vue'

describe('TestComponent', () => {
  it('test', () => {
    const { user } = render(TestComponent);
    // TODO: test
    expect(true).toBe(false);
  });
});
`;
      const result = validateTestContent(content, 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Component import path doesn't match expected pattern: ./TestComponent.vue");
    });

    it('should return error for empty content', () => {
      const result = validateTestContent('', 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Test content is empty');
    });
  });

  describe('validateTestStructure', () => {
    it('should validate well-structured tests', () => {
      const content = `
describe('Component', () => {
  describe('Acceptance Criteria', () => {
    it('should do something important', () => {});
  });

  describe('Happy Path', () => {
    it('should work in normal case', () => {});
  });

  describe('Edge Cases', () => {
    it('should handle edge case', () => {});
  });

  describe('Error Handling', () => {
    it('should handle errors', () => {});
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {});
  });
});
`;
      const result = validateTestStructure(content);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about missing recommended sections', () => {
      const content = `
describe('Component', () => {
  it('should do something', () => {});
});
`;
      const result = validateTestStructure(content);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('Consider adding test sections'))).toBe(true);
    });

    it('should warn about non-descriptive test names', () => {
      const content = `
describe('Component', () => {
  it('should test', () => {});
  it('should x', () => {});
});
`;
      const result = validateTestStructure(content);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('very short or non-descriptive names') || w.includes('Consider adding test sections'))).toBe(true);
    });

    it('should return invalid for content with no describe blocks', () => {
      const result = validateTestStructure('it("test", () => {})');

      expect(result.valid).toBe(false);
      expect(result.warnings).toContain('No describe blocks found');
    });
  });

  describe('performFullValidation', () => {
    it('should provide comprehensive validation results', () => {
      const validContent = `
/**
 * TestComponent Component Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/helpers/testing-library'
import { mount } from '@vue/test-utils'
import TestComponent from './TestComponent.vue'

describe('TestComponent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Acceptance Criteria', () => {
    it('should render component correctly and verify all expected behaviors', async () => {
      const { user } = render(TestComponent);
      // TODO: implement test
      expect(true).toBe(false); // Red phase
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(TestComponent);
      // TODO: Add accessibility checks
      expect(true).toBe(false);
    });
  });
});
`;

      const result = performFullValidation(validContent, 'TestComponent');

      // Should have warnings but no errors
      expect(result.errors).toHaveLength(0);
      expect(result.summary.hasAccessibilityTests).toBe(true);
      expect(result.summary.hasTodoComments).toBe(true);
      expect(result.summary.followsTddPattern).toBe(true);
      expect(result.summary.totalErrors).toBe(0);
    });

    it('should aggregate errors and warnings', () => {
      const invalidContent = `
describe('Test', () => {
  it('test', () => {});
});
`;

      const result = performFullValidation(invalidContent, 'TestComponent');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.summary.totalErrors).toBeGreaterThan(0);
      expect(result.summary.totalWarnings).toBeGreaterThan(0);
    });

    it('should provide accurate summary statistics', () => {
      const contentWithIssues = `
import { describe, it, expect, render } from 'vitest'
import TestComponent from './TestComponent.vue'

describe('TestComponent', () => {
  it('short test', () => {
    const { user } = render(TestComponent);
    expect(true).toBe(true); // Not following TDD
  });
});
`;

      const result = performFullValidation(contentWithIssues, 'TestComponent');

      expect(result.summary.hasAccessibilityTests).toBe(false);
      expect(result.summary.hasTodoComments).toBe(false);
      expect(result.summary.followsTddPattern).toBe(false);
    });
  });
});
