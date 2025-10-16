/**
 * Copilot-Optimized Test Scaffold Generator
 *
 * Generates test scaffolds specifically designed to maximize GitHub Copilot's
 * ability to suggest accurate test implementations. These scaffolds include:
 *
 * - Rich contextual comments with user story and acceptance criteria
 * - Type hints and interface definitions
 * - Detailed examples and patterns
 * - Links to relevant documentation
 * - Step-by-step implementation guidance
 *
 * This approach allows users with GitHub Copilot (through their company)
 * to get high-quality test implementations without requiring separate API keys.
 */

import type { TestScenario } from './types.js';

export interface CopilotScaffoldContext {
  componentName: string;
  scenario: string;
  type: TestScenario['type'];
  description: string;
  props?: string;
  events?: string;
  userStory?: string;
  acceptanceCriteria?: string[];
}

/**
 * Generate a Copilot-optimized test scaffold
 */
export function generateCopilotScaffold(context: CopilotScaffoldContext): string {
  const { componentName, scenario, type, description, props, events, userStory, acceptanceCriteria } = context;

  const typeLabel: Record<typeof type, string> = {
    acceptance: 'Acceptance Criteria',
    happy: 'Happy Path',
    edge: 'Edge Case',
    error: 'Error Handling',
    accessibility: 'Accessibility'
  };

  // Build contextual header
  let contextHeader = `    // ${typeLabel[type]}: ${scenario}\n`;

  if (userStory) {
    contextHeader += `    // User Story: ${userStory}\n`;
  }

  if (acceptanceCriteria && acceptanceCriteria.length > 0) {
    contextHeader += `    // Acceptance Criteria:\n`;
    acceptanceCriteria.forEach(criteria => {
      contextHeader += `    //   - ${criteria}\n`;
    });
  }

  // Build the test based on type
  let testBody = '';

  if (type === 'accessibility') {
    testBody = generateCopilotAccessibilityScaffold(componentName, scenario, description, contextHeader);
  } else if (type === 'error') {
    testBody = generateCopilotErrorScaffold(componentName, scenario, description, props, events, contextHeader);
  } else {
    testBody = generateCopilotStandardScaffold(componentName, scenario, description, props, events, contextHeader, type);
  }

  return `    it('should ${description}', async () => {
${testBody}
  });`;
}

/**
 * Generate Copilot-optimized standard test scaffold (happy path, edge case, acceptance)
 */
function generateCopilotStandardScaffold(
  componentName: string,
  scenario: string,
  description: string,
  props?: string,
  events?: string,
  contextHeader?: string,
  _type?: 'happy' | 'edge' | 'acceptance'
): string {
  const propsInfo = props ? `\n    // Component props: ${props}` : '';
  const eventsInfo = events ? `\n    // Component events: ${events}` : '';

  return `${contextHeader}${propsInfo}${eventsInfo}
    //
    // COPILOT INSTRUCTIONS:
    // 1. Render the ${componentName} component with appropriate props
    // 2. Simulate user interactions that match the scenario: "${scenario}"
    // 3. Assert that the expected outcome is achieved
    //
    // Testing Library Best Practices:
    // - Use getByRole() for semantic queries (preferred)
    // - Use getByLabelText() for form inputs
    // - Use getByText() for text content
    // - Use user.click(), user.type(), user.keyboard() for interactions
    // - Use waitFor() for async state changes
    //
    // TDD Pattern: This test should FAIL initially (Red phase)
    // The component implementation will make it pass (Green phase)

    // STEP 1: Arrange - Set up the test environment
    // Render the component with the required props
    // Extract the user interaction helper from render
    const { user } = render(${componentName}, {
      props: {
        // TODO: Add props based on: ${props || 'component requirements'}
        // Example for a button: label: 'Click me', disabled: false
        // Example for a form: initialValue: '', onSubmit: vi.fn()
      }
    });

    // STEP 2: Act - Simulate user interactions
    // Perform the actions described in the scenario: "${scenario}"
    // Common patterns:
    //   - Click a button: await user.click(screen.getByRole('button', { name: /text/i }))
    //   - Type in input: await user.type(screen.getByLabelText('Label'), 'value')
    //   - Select option: await user.selectOptions(screen.getByLabelText('Label'), 'value')
    //   - Check checkbox: await user.click(screen.getByRole('checkbox', { name: /text/i }))
    //   - Tab navigation: await user.tab()

    // TODO: Implement user interactions here

    // STEP 3: Assert - Verify the expected outcome
    // Check that the scenario requirement is met: "${scenario}"
    // Common assertions:
    //   - Element visible: expect(screen.getByText('text')).toBeInTheDocument()
    //   - Element not visible: expect(screen.queryByText('text')).not.toBeInTheDocument()
    //   - Element has text: expect(screen.getByRole('alert')).toHaveTextContent('message')
    //   - Function called: expect(mockFn).toHaveBeenCalledWith(expectedArgs)
    //   - Element has class: expect(element).toHaveClass('className')
    //   - Element disabled: expect(screen.getByRole('button')).toBeDisabled()

    // TODO: Add assertions to verify: ${description}

    // TDD Red Phase: This should fail until component is implemented
    expect(true).toBe(false); // Remove this line after implementing the test`;
}

/**
 * Generate Copilot-optimized error handling test scaffold
 */
function generateCopilotErrorScaffold(
  componentName: string,
  scenario: string,
  description: string,
  props?: string,
  events?: string,
  contextHeader?: string
): string {
  const propsInfo = props ? `\n    // Component props: ${props}` : '';
  const eventsInfo = events ? `\n    // Component events: ${events}` : '';

  return `${contextHeader}${propsInfo}${eventsInfo}
    //
    // COPILOT INSTRUCTIONS:
    // This is an ERROR HANDLING test - verify the component handles errors gracefully
    // 1. Set up conditions that trigger the error: "${scenario}"
    // 2. Verify the component displays appropriate error messages
    // 3. Ensure the component remains functional after the error
    //
    // Error Testing Patterns:
    // - Invalid form input validation
    // - Network request failures (mock rejected promises)
    // - Missing required props
    // - Boundary conditions (empty arrays, null values, etc.)
    //
    // TDD Pattern: This test should FAIL initially (Red phase)

    // STEP 1: Arrange - Set up error conditions
    // Mock functions or set up props that will trigger the error
    const mockErrorHandler = vi.fn();
    const { user } = render(${componentName}, {
      props: {
        // TODO: Add props that may trigger errors: ${props || 'component requirements'}
        // Example: onError: mockErrorHandler
      }
    });

    // STEP 2: Act - Trigger the error condition
    // Perform actions that cause the error: "${scenario}"
    // Common error triggers:
    //   - Submit invalid form data
    //   - Trigger failed API call (if mocked)
    //   - Provide out-of-range values
    //   - Remove required data

    // TODO: Trigger error scenario: ${scenario}

    // For async errors, use waitFor:
    // await waitFor(() => {
    //   expect(screen.getByRole('alert')).toBeInTheDocument();
    // });

    // STEP 3: Assert - Verify error handling
    // Check that errors are handled gracefully: "${description}"
    // Error handling assertions:
    //   - Error message displayed: expect(screen.getByRole('alert')).toHaveTextContent('Error message')
    //   - Error callback invoked: expect(mockErrorHandler).toHaveBeenCalledWith(expect.objectContaining({ message: 'error' }))
    //   - Component shows fallback UI: expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    //   - Form validation error: expect(screen.getByText(/invalid/i)).toBeInTheDocument()
    //   - Component still interactive: expect(screen.getByRole('button')).not.toBeDisabled()

    // TODO: Verify error handling: ${description}

    // TDD Red Phase: This should fail until error handling is implemented
    expect(true).toBe(false); // Remove this line after implementing the test`;
}

/**
 * Generate Copilot-optimized accessibility test scaffold
 */
function generateCopilotAccessibilityScaffold(
  componentName: string,
  scenario: string,
  description: string,
  contextHeader?: string
): string {
  const isKeyboardTest = description.includes('keyboard') || scenario.includes('keyboard');
  const isScreenReaderTest = description.includes('screen reader') || scenario.includes('screen reader') || scenario.includes('ARIA');

  if (isKeyboardTest) {
    return `${contextHeader}
    //
    // COPILOT INSTRUCTIONS:
    // This is a KEYBOARD ACCESSIBILITY test
    // Verify that: "${scenario}"
    //
    // Keyboard Testing Patterns:
    // - Tab navigation: user.tab() moves focus to next interactive element
    // - Enter/Space activation: user.keyboard('{Enter}') or user.keyboard(' ')
    // - Escape key: user.keyboard('{Escape}') closes dialogs/menus
    // - Arrow keys: user.keyboard('{ArrowDown}') for dropdowns/lists
    // - Focus management: Check focus moves logically through the component
    //
    // WCAG 2.1 AA Requirement: All interactive elements must be keyboard accessible
    //
    // TDD Pattern: This test should FAIL initially (Red phase)

    // STEP 1: Arrange - Render the component
    const { user } = render(${componentName});

    // STEP 2: Act - Test keyboard navigation
    // Navigate through the component using keyboard: "${scenario}"
    // Example keyboard interactions:
    //   await user.tab(); // Move to next element
    //   expect(screen.getByRole('button')).toHaveFocus();
    //
    //   await user.keyboard('{Enter}'); // Activate element
    //   expect(screen.getByText('Action completed')).toBeInTheDocument();
    //
    //   await user.keyboard('{Escape}'); // Close modal/menu
    //   expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //
    //   await user.keyboard('{ArrowDown}'); // Navigate dropdown
    //   expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Option 2');

    // TODO: Implement keyboard navigation test: ${scenario}

    // STEP 3: Assert - Verify keyboard accessibility
    // Confirm all interactive elements are accessible via keyboard
    // Common assertions:
    //   - Element receives focus: expect(element).toHaveFocus()
    //   - Focus indicator visible: Check computed styles (manual/visual test)
    //   - Tab order is logical: Test sequential tab navigation
    //   - Enter/Space activates buttons: Verify action occurs

    // TODO: Verify keyboard accessibility: ${description}

    // TDD Red Phase: This should fail until keyboard support is implemented
    expect(true).toBe(false); // Remove this line after implementing the test`;
  }

  if (isScreenReaderTest) {
    return `${contextHeader}
    //
    // COPILOT INSTRUCTIONS:
    // This is a SCREEN READER ACCESSIBILITY test
    // Verify that: "${scenario}"
    //
    // Screen Reader Testing Patterns:
    // - Semantic HTML: Use proper heading hierarchy (h1, h2, h3)
    // - ARIA labels: aria-label, aria-labelledby, aria-describedby
    // - ARIA roles: role="button", role="navigation", etc.
    // - Form labels: Every input must have an associated label
    // - Alt text: Images must have meaningful alt attributes
    // - Live regions: aria-live for dynamic content updates
    //
    // WCAG 2.1 AA Requirements:
    // - All interactive elements must have accessible names
    // - Form inputs must have labels
    // - Images must have alt text
    // - Dynamic content changes must be announced
    //
    // TDD Pattern: This test should FAIL initially (Red phase)

    // STEP 1: Arrange - Render the component
    render(${componentName});

    // STEP 2 & 3: Assert - Check accessibility attributes
    // Verify screen reader accessibility: "${scenario}"
    //
    // Testing Library provides accessible queries that mirror screen reader behavior:
    //
    // 1. Accessible names:
    //   const button = screen.getByRole('button', { name: /submit/i });
    //   expect(button).toHaveAccessibleName('Submit form');
    //   expect(button).toHaveAccessibleDescription('Click to submit the form');
    //
    // 2. Semantic HTML:
    //   const heading = screen.getByRole('heading', { level: 1 });
    //   expect(heading).toHaveTextContent('Page Title');
    //
    // 3. Form labels:
    //   const input = screen.getByLabelText('Email address');
    //   expect(input).toBeRequired();
    //   expect(input).toHaveAttribute('aria-invalid', 'false');
    //
    // 4. ARIA attributes:
    //   const nav = screen.getByRole('navigation');
    //   expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    //
    // 5. Live regions:
    //   const alert = screen.getByRole('alert');
    //   expect(alert).toHaveTextContent('Form submitted successfully');
    //   expect(alert).toHaveAttribute('aria-live', 'polite');
    //
    // 6. Image alt text:
    //   const image = screen.getByRole('img', { name: /profile photo/i });
    //   expect(image).toHaveAttribute('alt', 'Profile photo of John Doe');

    // TODO: Verify screen reader accessibility: ${description}

    // TDD Red Phase: This should fail until accessibility attributes are added
    expect(true).toBe(false); // Remove this line after implementing the test`;
  }

  // Generic accessibility test
  return `${contextHeader}
    //
    // COPILOT INSTRUCTIONS:
    // This is a general ACCESSIBILITY test
    // Verify that: "${scenario}"
    //
    // Accessibility Testing Checklist:
    // ✓ Semantic HTML elements (button, nav, main, header, etc.)
    // ✓ Proper heading hierarchy (h1 -> h2 -> h3)
    // ✓ Form labels and ARIA attributes
    // ✓ Color contrast (manual testing)
    // ✓ Focus indicators (manual testing)
    // ✓ Keyboard navigation
    // ✓ Screen reader announcements
    //
    // WCAG 2.1 AA Standards:
    // - Perceivable: Information must be presentable to all users
    // - Operable: UI components must be operable by all users
    // - Understandable: Information must be understandable
    // - Robust: Content must work with assistive technologies
    //
    // TDD Pattern: This test should FAIL initially (Red phase)

    // STEP 1: Arrange - Render the component
    render(${componentName});

    // STEP 2 & 3: Assert - Check accessibility requirement
    // Verify accessibility: "${scenario}"
    //
    // Common accessibility checks:
    //
    // 1. Semantic HTML:
    //   expect(screen.getByRole('button')).toBeInTheDocument();
    //   expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    //   expect(screen.getByRole('navigation')).toBeInTheDocument();
    //
    // 2. ARIA attributes:
    //   const region = screen.getByRole('region');
    //   expect(region).toHaveAttribute('aria-label', 'Main content');
    //
    // 3. Form accessibility:
    //   const input = screen.getByLabelText('Email');
    //   expect(input).toBeRequired();
    //   expect(input).toHaveAccessibleName('Email');
    //
    // 4. Link accessibility:
    //   const link = screen.getByRole('link', { name: /learn more/i });
    //   expect(link).toHaveAttribute('href', '/about');
    //
    // 5. Interactive element states:
    //   const button = screen.getByRole('button');
    //   expect(button).not.toBeDisabled();
    //   expect(button).toHaveAttribute('aria-pressed', 'false');
    //
    // Manual testing required for:
    // - Color contrast (use browser DevTools or axe extension)
    // - Focus indicator visibility (tab through and visually verify)
    // - Screen reader announcements (test with NVDA/JAWS/VoiceOver)

    // TODO: Verify accessibility requirement: ${description}

    // TDD Red Phase: This should fail until accessibility is implemented
    expect(true).toBe(false); // Remove this line after implementing the test`;
}
