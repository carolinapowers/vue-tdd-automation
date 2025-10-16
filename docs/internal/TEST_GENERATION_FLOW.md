# Test Generation System - Detailed Flow

This document provides an in-depth look at how the test generation system works in `@carolinappowers/vue-tdd-automation`.

## Table of Contents

1. [Overview](#overview)
2. [Generation Modes](#generation-modes)
3. [Test Content Structure](#test-content-structure)
4. [Detailed Flows](#detailed-flows)
5. [Examples](#examples)

---

## Overview

The test generation system is the heart of the package. It takes feature requirements (user stories, acceptance criteria, test scenarios) and generates complete test files in three different modes:

1. **AI Generation** - Uses OpenAI or GitHub Models API to generate actual test implementations
2. **Copilot-Ready** - Generates scaffolds optimized for GitHub Copilot completion
3. **Enhanced Scaffold** - Generates structured scaffolds with Arrange/Act/Assert pattern

```mermaid
graph TB
    INPUT[Test Requirements] --> VALIDATOR{Valid?}
    VALIDATOR -->|No| ERROR[Validation Error]
    VALIDATOR -->|Yes| GENERATOR[Test Generator]

    GENERATOR --> MODE{Mode?}

    MODE -->|AI| AI_PATH[AI Generation Path]
    MODE -->|Copilot| COPILOT_PATH[Copilot Scaffold Path]
    MODE -->|Default| SCAFFOLD_PATH[Enhanced Scaffold Path]

    AI_PATH --> AI_CHECK{API Key?}
    AI_CHECK -->|Yes| AI_GEN[Generate with AI]
    AI_CHECK -->|No| FALLBACK[Fallback to Scaffold]

    AI_GEN --> AI_SUCCESS{Success?}
    AI_SUCCESS -->|Yes| OUTPUT
    AI_SUCCESS -->|No| FALLBACK

    COPILOT_PATH --> COPILOT_GEN[Generate Rich Scaffold]
    SCAFFOLD_PATH --> SCAFFOLD_GEN[Generate Basic Scaffold]
    FALLBACK --> SCAFFOLD_GEN

    COPILOT_GEN --> OUTPUT[Complete Test File]
    SCAFFOLD_GEN --> OUTPUT

    style INPUT fill:#e1f5ff
    style GENERATOR fill:#ffffcc
    style OUTPUT fill:#ccffcc
    style ERROR fill:#ffcccc
```

---

## Generation Modes

### Mode Comparison

| Feature | AI Generation | Copilot-Ready | Enhanced Scaffold |
|---------|--------------|---------------|-------------------|
| **Requires** | API Key | GitHub Copilot | Nothing |
| **Output** | Working tests | Rich scaffolds | Basic scaffolds |
| **Speed** | Slower (API calls) | Fast | Fast |
| **Cost** | API usage fees | Free | Free |
| **Accuracy** | High (AI-powered) | Medium (developer completes) | Low (developer writes) |
| **Customization** | Limited | High | High |
| **Learning Curve** | Low | Medium | High |
| **Best For** | Fast development | Teams with Copilot | Learning TDD |

### Mode Selection Flow

```mermaid
graph TD
    START[User runs command] --> FLAGS{Flags?}

    FLAGS -->|--ai-generate| CHECK_KEY{API Key set?}
    FLAGS -->|--copilot-ready| COPILOT[Copilot Mode]
    FLAGS -->|none| DEFAULT[Default Mode]

    CHECK_KEY -->|Yes| VALIDATE{Valid key?}
    CHECK_KEY -->|No| WARN1[Warn: No key found]

    VALIDATE -->|Yes| AI[AI Mode]
    VALIDATE -->|No| WARN2[Warn: Invalid key]

    WARN1 --> AUTO_FALLBACK1[Auto-fallback to Default]
    WARN2 --> AUTO_FALLBACK2[Auto-fallback to Default]

    AI --> PROCESS[Generate Tests]
    COPILOT --> PROCESS
    DEFAULT --> PROCESS
    AUTO_FALLBACK1 --> PROCESS
    AUTO_FALLBACK2 --> PROCESS

    style AI fill:#ccffcc
    style COPILOT fill:#ffffcc
    style DEFAULT fill:#ccccff
    style WARN1 fill:#ffcccc
    style WARN2 fill:#ffcccc
```

---

## Test Content Structure

Every generated test file follows this structure:

```mermaid
graph TD
    FILE[Test File] --> HEADER[Header Comment]
    FILE --> IMPORTS[Import Statements]
    FILE --> DESCRIBE[Main describe Block]

    HEADER --> META[Metadata:<br/>- Component name<br/>- Issue info<br/>- User story<br/>- TDD notes]

    IMPORTS --> VITEST[Vitest imports]
    IMPORTS --> TESTING_LIB[Testing Library imports]
    IMPORTS --> VTU[Vue Test Utils imports]
    IMPORTS --> COMPONENT[Component import]

    DESCRIBE --> HOOKS[beforeEach/afterEach]
    DESCRIBE --> SECTIONS[Test Sections]

    SECTIONS --> ACCEPTANCE[Acceptance Criteria<br/>describe block]
    SECTIONS --> HAPPY[Happy Path<br/>describe block]
    SECTIONS --> EDGE[Edge Cases<br/>describe block]
    SECTIONS --> ERROR[Error Handling<br/>describe block]
    SECTIONS --> A11Y[Accessibility<br/>describe block]

    ACCEPTANCE --> TESTS1[it blocks]
    HAPPY --> TESTS2[it blocks]
    EDGE --> TESTS3[it blocks]
    ERROR --> TESTS4[it blocks]
    A11Y --> TESTS5[it blocks]

    style FILE fill:#e1f5ff
    style HEADER fill:#ffffcc
    style IMPORTS fill:#ffcccc
    style DESCRIBE fill:#ccffcc
    style SECTIONS fill:#ccccff
```

### Test File Template

```typescript
/**
 * ComponentName Component Tests
 * GitHub Issue #123: Feature Title
 *
 * User Story: As a user, I want...
 *
 * This test file follows TDD approach - all tests should fail initially (Red phase)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/helpers/testing-library'
import { mount } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'

describe('ComponentName Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Acceptance Criteria', () => {
    // Generated test cases...
  });

  describe('Happy Path', () => {
    // Generated test cases...
  });

  describe('Edge Cases', () => {
    // Generated test cases...
  });

  describe('Error Handling', () => {
    // Generated test cases...
  });

  describe('Accessibility', () => {
    // Always included - keyboard & screen reader tests
  });
});
```

---

## Detailed Flows

### 1. Main Generation Flow

```mermaid
sequenceDiagram
    participant C as Caller
    participant TG as Test Generator
    participant V as Validator
    participant SG as Section Generator
    participant CG as Case Generator

    C->>TG: generateTestContent(name, requirements, options)

    TG->>V: validateRequirements(requirements)
    V-->>TG: ValidationResult

    alt Invalid requirements
        TG-->>C: Throw error
    end

    TG->>TG: Log generation mode
    TG->>TG: Build header comment
    TG->>TG: Build imports

    Note over TG: Generate test sections

    opt Acceptance Criteria exist
        TG->>SG: generateTestSection('Acceptance Criteria', criteria)
        SG->>CG: generateTestCase() for each criterion
        CG-->>SG: Test case code
        SG-->>TG: Section code
    end

    opt Happy Path scenarios exist
        TG->>SG: generateTestSection('Happy Path', scenarios)
        SG->>CG: generateTestCase() for each scenario
        CG-->>SG: Test case code
        SG-->>TG: Section code
    end

    opt Edge Cases exist
        TG->>SG: generateTestSection('Edge Cases', cases)
        SG->>CG: generateTestCase() for each case
        CG-->>SG: Test case code
        SG-->>TG: Section code
    end

    opt Error Cases exist
        TG->>SG: generateTestSection('Error Handling', cases)
        SG->>CG: generateTestCase() for each case
        CG-->>SG: Test case code
        SG-->>TG: Section code
    end

    TG->>SG: generateAccessibilitySection()
    SG->>CG: generateTestCase() for keyboard
    SG->>CG: generateTestCase() for screen readers
    SG-->>TG: Accessibility section

    TG->>TG: Combine all sections into describe block
    TG->>TG: Assemble complete file

    TG-->>C: Complete test file content
```

### 2. AI Generation Flow

```mermaid
sequenceDiagram
    participant CG as Case Generator
    participant AI as AI Generator
    participant PROMPT as Prompt Builder
    participant API as AI API
    participant EXTRACT as Code Extractor

    CG->>AI: generateTestWithAI(context)

    AI->>AI: Check for API key
    alt No API key
        AI-->>CG: null (fallback to scaffold)
    end

    AI->>PROMPT: buildPrompt(context)

    PROMPT->>PROMPT: Add component name
    PROMPT->>PROMPT: Add test type
    PROMPT->>PROMPT: Add scenario
    PROMPT->>PROMPT: Add user story
    PROMPT->>PROMPT: Add props/events
    PROMPT->>PROMPT: Add acceptance criteria
    PROMPT->>PROMPT: Add requirements:<br/>- Testing Library<br/>- user-event<br/>- Async/await<br/>- Arrange/Act/Assert

    PROMPT-->>AI: Complete prompt

    AI->>AI: Detect provider (OpenAI vs GitHub)

    alt GitHub Models
        AI->>API: POST to models.inference.ai.azure.com
        API-->>AI: Chat completion response
    else OpenAI
        AI->>API: POST to api.openai.com
        API-->>AI: Chat completion response
    end

    alt API error
        AI-->>CG: null (fallback)
    end

    AI->>EXTRACT: extractTestCode(response)

    EXTRACT->>EXTRACT: Remove markdown code blocks
    EXTRACT->>EXTRACT: Check for it() wrapper
    alt Has it() wrapper
        EXTRACT->>EXTRACT: Extract body only
    end
    EXTRACT->>EXTRACT: Trim whitespace

    EXTRACT-->>AI: Clean test code
    AI-->>CG: Test implementation

    CG->>CG: Wrap in it() block
    CG-->>CG: Return complete test case
```

### 3. Copilot Scaffold Generation Flow

```mermaid
sequenceDiagram
    participant CG as Case Generator
    participant CS as Copilot Scaffold
    participant CTX as Context Builder

    CG->>CS: generateCopilotScaffold(context)

    CS->>CTX: Build context object
    CTX->>CTX: Extract component name
    CTX->>CTX: Extract scenario
    CTX->>CTX: Extract test type
    CTX->>CTX: Extract props/events
    CTX->>CTX: Extract user story
    CTX->>CTX: Extract acceptance criteria
    CTX-->>CS: Rich context

    CS->>CS: Build test header comment:<br/>- Acceptance criteria<br/>- User story<br/>- Component props/events

    CS->>CS: Add COPILOT INSTRUCTIONS:<br/>1. Render component<br/>2. Simulate interactions<br/>3. Assert outcomes

    CS->>CS: Add Testing Library best practices:<br/>- getByRole() examples<br/>- getByLabelText() examples<br/>- getByText() examples

    CS->>CS: Add TDD pattern note

    CS->>CS: Build STEP 1: Arrange<br/>- render() call<br/>- Props TODO with examples<br/>- Component props in comment

    CS->>CS: Build STEP 2: Act<br/>- Common patterns<br/>- user.click() example<br/>- user.type() example<br/>- Scenario-specific guidance

    CS->>CS: Build STEP 3: Assert<br/>- Common assertions<br/>- toBeInTheDocument() example<br/>- toHaveTextContent() example<br/>- Scenario-specific expectations

    CS->>CS: Add TDD Red phase note
    CS->>CS: Add expect(true).toBe(false)

    CS->>CS: Wrap in it() block with description

    CS-->>CG: Complete Copilot-optimized scaffold
```

### 4. Enhanced Scaffold Generation Flow

```mermaid
sequenceDiagram
    participant CG as Case Generator
    participant ES as Enhanced Scaffold
    participant TYPE as Type Detector

    CG->>ES: generateEnhancedScaffold(context)

    ES->>TYPE: Determine test type

    alt Accessibility test
        TYPE->>ES: generateAccessibilityScaffold()
        ES->>ES: Check for 'keyboard' in scenario
        alt Keyboard test
            ES->>ES: Build keyboard test structure:<br/>- user.tab()<br/>- focus checks<br/>- keyboard events
        else Screen reader test
            ES->>ES: Build screen reader structure:<br/>- ARIA checks<br/>- semantic HTML<br/>- accessible names
        else Generic a11y
            ES->>ES: Build generic structure:<br/>- role checks<br/>- ARIA attributes<br/>- manual testing notes
        end
    else Error test
        TYPE->>ES: generateErrorScaffold()
        ES->>ES: Build error structure:<br/>- Arrange with props<br/>- Act to trigger error<br/>- Assert error handling<br/>- waitFor() example
    else Standard test
        TYPE->>ES: generateStandardScaffold()
        ES->>ES: Build standard structure:<br/>- Arrange with render()<br/>- Act with user interactions<br/>- Assert expected outcomes
    end

    ES->>ES: Add TODO comments with examples
    ES->>ES: Add props/events context
    ES->>ES: Add expect(true).toBe(false) for TDD Red

    ES->>ES: Wrap in it() block

    ES-->>CG: Complete enhanced scaffold
```

---

## Examples

### Example 1: AI-Generated Test

**Input:**
```javascript
{
  componentName: 'UserCard',
  scenario: 'Display user name and email',
  type: 'acceptance',
  props: 'name: string, email: string',
  userStory: 'As a user, I want to view user profile cards'
}
```

**Output:**
```typescript
it('should display user name and email', async () => {
  // Acceptance Criteria: Display user name and email

  // Arrange
  const { user } = render(UserCard, {
    props: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });

  // Act
  // Component renders immediately, no interaction needed

  // Assert
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('John Doe');
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

### Example 2: Copilot-Ready Scaffold

**Input:**
```javascript
{
  componentName: 'LoginForm',
  scenario: 'User submits valid credentials',
  type: 'happy',
  props: 'onSubmit: (email: string, password: string) => void',
  userStory: 'As a user, I want to log in to access my account'
}
```

**Output:**
```typescript
it('should user submits valid credentials', async () => {
  // Happy Path: User submits valid credentials
  // User Story: As a user, I want to log in to access my account
  // Component props: onSubmit: (email: string, password: string) => void
  //
  // COPILOT INSTRUCTIONS:
  // 1. Render the LoginForm component with appropriate props
  // 2. Simulate user interactions that match the scenario: "User submits valid credentials"
  // 3. Assert that the expected outcome is achieved
  //
  // Testing Library Best Practices:
  // - Use getByRole() for semantic queries (preferred)
  // - Use getByLabelText() for form inputs
  // - Use getByText() for text content
  //
  // TDD Pattern: This test should FAIL initially (Red phase)

  // STEP 1: Arrange - Set up the test environment
  const { user } = render(LoginForm, {
    props: {
      // TODO: Add props based on: onSubmit: (email: string, password: string) => void
      // Example: onSubmit: vi.fn()
    }
  });

  // STEP 2: Act - Simulate user interactions
  // Common patterns:
  //   - Click: await user.click(screen.getByRole('button', { name: /text/i }))
  //   - Type: await user.type(screen.getByLabelText('Label'), 'value')
  //
  // For this scenario: User submits valid credentials
  // TODO: Type email and password, click submit button

  // STEP 3: Assert - Verify the expected outcome
  // Common assertions:
  //   - Element visible: expect(screen.getByText('text')).toBeInTheDocument()
  //   - Function called: expect(mockFn).toHaveBeenCalledWith(expected)
  //
  // TODO: Verify onSubmit was called with correct credentials

  // TDD Red Phase: This should fail until component is implemented
  expect(true).toBe(false); // Remove this line after implementing the test
});
```

### Example 3: Enhanced Scaffold

**Input:**
```javascript
{
  componentName: 'Counter',
  scenario: 'Increment button increases count',
  type: 'happy',
  events: 'increment, decrement'
}
```

**Output:**
```typescript
it('should increment button increases count', async () => {
  // Happy Path: Increment button increases count

  // Arrange
  const { user } = render(Counter, {
    props: {
      // TODO: Add required props if needed
    }
  });
  // Available events: increment, decrement

  // Act
  // TODO: Implement user interactions based on scenario:
  // Increment button increases count
  // Examples:
  //   await user.click(screen.getByRole('button', { name: /submit/i }));
  //   await user.type(screen.getByLabelText('Email'), 'test@example.com');
  //   await user.selectOptions(screen.getByLabelText('Country'), 'US');

  // Assert
  // TODO: Add assertions to verify: Increment button increases count
  // Examples:
  //   expect(screen.getByText('Success!')).toBeInTheDocument();
  //   expect(screen.queryByText('Error')).not.toBeInTheDocument();
  //   expect(screen.getByRole('alert')).toHaveTextContent('Saved');

  expect(true).toBe(false); // This should fail (TDD - Red phase)
});
```

---

## Test Generation Decision Tree

```mermaid
graph TD
    START[Generate Test Case] --> CHECK_AI{AI enabled?}

    CHECK_AI -->|Yes| HAS_KEY{Valid API key?}
    CHECK_AI -->|No| CHECK_COPILOT{Copilot mode?}

    HAS_KEY -->|Yes| TRY_AI[Try AI generation]
    HAS_KEY -->|No| LOG_WARN1[Log warning]

    TRY_AI --> AI_CALL{API call success?}

    AI_CALL -->|Yes| EXTRACT[Extract test code]
    AI_CALL -->|No| LOG_ERROR[Log error]

    EXTRACT --> VALID{Valid code?}
    VALID -->|Yes| FORMAT_AI[Format as test case]
    VALID -->|No| LOG_WARN2[Log warning]

    FORMAT_AI --> DONE[Return test case]

    LOG_ERROR --> CHECK_COPILOT
    LOG_WARN1 --> CHECK_COPILOT
    LOG_WARN2 --> CHECK_COPILOT

    CHECK_COPILOT -->|Yes| GEN_COPILOT[Generate Copilot scaffold]
    CHECK_COPILOT -->|No| GEN_ENHANCED[Generate enhanced scaffold]

    GEN_COPILOT --> FORMAT_COPILOT[Format with rich context]
    GEN_ENHANCED --> FORMAT_ENHANCED[Format with TODOs]

    FORMAT_COPILOT --> DONE
    FORMAT_ENHANCED --> DONE

    style START fill:#e1f5ff
    style TRY_AI fill:#ffffcc
    style GEN_COPILOT fill:#ccffcc
    style GEN_ENHANCED fill:#ffcccc
    style DONE fill:#ccccff
```

---

## Component Creation Complete Flow

This shows the entire flow from command to generated files:

```mermaid
graph TD
    CMD[npx vue-tdd create Button] --> CLI[bin/cli.ts]

    CLI --> CREATE[lib/cli/create.ts]
    CREATE --> SCRIPT[scripts/create-tdd-component.js]

    SCRIPT --> GEN_COMP[Generate Component File]
    SCRIPT --> GEN_TEST[Generate Test File]

    GEN_COMP --> COMP_TEMPLATE[Minimal Vue scaffold]
    GEN_TEST --> TEST_GEN[lib/shared/test-generator/]

    TEST_GEN --> BUILD_REQ[Build requirements object]
    BUILD_REQ --> VALIDATE[Validate requirements]

    VALIDATE --> GEN_HEADER[Generate header comment]
    VALIDATE --> GEN_IMPORTS[Generate imports]
    VALIDATE --> GEN_SECTIONS[Generate test sections]

    GEN_SECTIONS --> SEC_ACCEPTANCE[Acceptance Criteria section]
    GEN_SECTIONS --> SEC_HAPPY[Happy Path section]
    GEN_SECTIONS --> SEC_EDGE[Edge Cases section]
    GEN_SECTIONS --> SEC_ERROR[Error Handling section]
    GEN_SECTIONS --> SEC_A11Y[Accessibility section]

    SEC_ACCEPTANCE --> CASES1[Generate test cases]
    SEC_HAPPY --> CASES2[Generate test cases]
    SEC_EDGE --> CASES3[Generate test cases]
    SEC_ERROR --> CASES4[Generate test cases]
    SEC_A11Y --> CASES5[Generate test cases]

    CASES1 --> MODE_CHECK{Generation mode?}
    CASES2 --> MODE_CHECK
    CASES3 --> MODE_CHECK
    CASES4 --> MODE_CHECK
    CASES5 --> MODE_CHECK

    MODE_CHECK -->|AI| AI_GEN[AI generation]
    MODE_CHECK -->|Copilot| COPILOT_GEN[Copilot scaffold]
    MODE_CHECK -->|Default| SCAFFOLD_GEN[Enhanced scaffold]

    AI_GEN --> ASSEMBLE
    COPILOT_GEN --> ASSEMBLE
    SCAFFOLD_GEN --> ASSEMBLE

    ASSEMBLE[Assemble complete test file] --> WRITE_COMP[Write Button.vue]
    ASSEMBLE --> WRITE_TEST[Write Button.test.ts]

    WRITE_COMP --> SUCCESS[Success message]
    WRITE_TEST --> SUCCESS

    style CMD fill:#e1f5ff
    style TEST_GEN fill:#ffffcc
    style MODE_CHECK fill:#ffcccc
    style SUCCESS fill:#ccffcc
```

---

## Summary

The test generation system is a sophisticated multi-mode generator that:

1. **Validates** input requirements
2. **Structures** tests into logical sections
3. **Generates** test cases in three modes:
   - AI-powered implementations
   - Copilot-optimized scaffolds
   - Enhanced scaffolds with TODOs
4. **Handles** fallbacks gracefully when AI is unavailable
5. **Produces** complete, well-structured test files ready for TDD

This flexible system allows teams to choose the right mode for their workflow while maintaining consistent test structure and quality.
