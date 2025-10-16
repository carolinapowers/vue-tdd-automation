# CLI Usage Guide with Visual Flows

This document provides visual flowcharts and detailed explanations for using the `vue-tdd` CLI tool.

## Table of Contents

1. [CLI Overview](#cli-overview)
2. [Command: vue-tdd init](#command-vue-tdd-init)
3. [Command: vue-tdd create](#command-vue-tdd-create)
4. [Command: vue-tdd feature](#command-vue-tdd-feature)
5. [GitHub Actions Integration](#github-actions-integration)
6. [Common Workflows](#common-workflows)

---

## CLI Overview

The `vue-tdd` CLI provides three main commands:

```mermaid
graph TB
    CLI[vue-tdd CLI] --> INIT[init]
    CLI --> CREATE[create]
    CLI --> FEATURE[feature]

    INIT --> INIT_DESC[Initialize TDD in project<br/>Copy templates & setup config]
    CREATE --> CREATE_DESC[Create single component<br/>with test file]
    FEATURE --> FEATURE_DESC[Interactive wizard<br/>Full feature creation]

    style CLI fill:#e1f5ff
    style INIT fill:#ccffcc
    style CREATE fill:#ffffcc
    style FEATURE fill:#ffcccc
```

### Command Summary

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `init` | Setup TDD infrastructure | Once per project, at the start |
| `create` | Create a single component | Quick component creation |
| `feature` | Interactive feature wizard | Complex features with full requirements |

---

## Command: vue-tdd init

### Purpose

Initializes the TDD workflow in your Vue.js project by installing test helpers, configurations, scripts, and workflows.

### Syntax

```bash
npx vue-tdd init [options]
```

### Options

```
--no-workflows     Skip GitHub Actions workflows
--no-docs          Skip documentation files
--no-scripts       Skip component creation scripts
--copilot          Add GitHub Copilot instructions file
--force            Overwrite existing files
```

### Flow Diagram

```mermaid
graph TD
    START[npx vue-tdd init] --> PARSE[Parse command options]

    PARSE --> CHECK_PKG{package.json exists?}

    CHECK_PKG -->|No| ERROR1[Error: Not in Vue project]
    CHECK_PKG -->|Yes| CHECK_VUE{Vue in dependencies?}

    CHECK_VUE -->|No| WARN[Warn: Vue not found<br/>Continue anyway]
    CHECK_VUE -->|Yes| CONTINUE[Continue]

    WARN --> CONTINUE
    CONTINUE --> CORE[Copy core test files]

    CORE --> SETUP[Copy src/test/setup.ts]
    CORE --> HELPERS[Copy src/test/helpers/*]
    CORE --> VITEST[Copy vitest.config.ts]

    VITEST --> CHECK_EXISTS{File exists?}
    CHECK_EXISTS -->|Yes & --force| OVERWRITE[Overwrite]
    CHECK_EXISTS -->|Yes & no --force| SKIP[Skip, show merge instructions]
    CHECK_EXISTS -->|No| COPY[Copy file]

    OVERWRITE --> SCRIPTS_CHECK
    SKIP --> SCRIPTS_CHECK
    COPY --> SCRIPTS_CHECK

    SCRIPTS_CHECK{--scripts?}
    SCRIPTS_CHECK -->|Yes| COPY_SCRIPTS[Copy scripts/*.js]
    SCRIPTS_CHECK -->|No| WORKFLOWS_CHECK

    COPY_SCRIPTS --> WORKFLOWS_CHECK

    WORKFLOWS_CHECK{--workflows?}
    WORKFLOWS_CHECK -->|Yes| COPY_WF[Copy .github/workflows/*<br/>Copy .github/ISSUE_TEMPLATE/*]
    WORKFLOWS_CHECK -->|No| COPILOT_CHECK

    COPY_WF --> COPILOT_CHECK

    COPILOT_CHECK{--copilot?}
    COPILOT_CHECK -->|Yes| COPY_COPILOT[Copy .github/copilot-instructions.md]
    COPILOT_CHECK -->|No| DOCS_CHECK

    COPY_COPILOT --> DOCS_CHECK

    DOCS_CHECK{--docs?}
    DOCS_CHECK -->|Yes| COPY_DOCS[Copy TDD_WORKFLOW.md<br/>Copy TESTING_COMPARISON.md<br/>Copy VUE_TESTING_ALIGNMENT.md]
    DOCS_CHECK -->|No| UPDATE_PKG

    COPY_DOCS --> UPDATE_PKG

    UPDATE_PKG[Update package.json<br/>Add npm scripts] --> SUMMARY[Display summary]

    SUMMARY --> DEPS[Display dependency install command]
    DEPS --> SUCCESS[Success: TDD initialized]

    style START fill:#e1f5ff
    style SUCCESS fill:#ccffcc
    style ERROR1 fill:#ffcccc
    style WARN fill:#ffffcc
```

### What Gets Installed

```mermaid
graph LR
    subgraph "Core Files (Always)"
        SETUP[src/test/setup.ts]
        HELPERS[src/test/helpers/]
        VITEST[vitest.config.ts]
    end

    subgraph "Scripts (--scripts)"
        CREATE_SCRIPT[scripts/create-tdd-component.js]
        FEATURE_SCRIPT[scripts/tdd-feature.js]
        ISSUE_SCRIPT[scripts/generate-tests-from-issue.js]
    end

    subgraph "Workflows (--workflows)"
        AUTO_TDD[.github/workflows/auto-tdd-setup.yml]
        TDD_WF[.github/workflows/tdd.yml]
        TEMPLATE[.github/ISSUE_TEMPLATE/feature_request.md]
    end

    subgraph "Copilot (--copilot)"
        COPILOT_INST[.github/copilot-instructions.md]
    end

    subgraph "Docs (--docs)"
        TDD_DOC[TDD_WORKFLOW.md]
        COMPARE[TESTING_COMPARISON.md]
        ALIGN[VUE_TESTING_ALIGNMENT.md]
    end

    subgraph "Package Updates"
        SCRIPTS_JSON[npm scripts in package.json]
    end

    style SETUP fill:#ccffcc
    style VITEST fill:#ccffcc
    style CREATE_SCRIPT fill:#ffffcc
    style AUTO_TDD fill:#ffcccc
    style COPILOT_INST fill:#ccccff
    style TDD_DOC fill:#ffcccc
```

### Example Usage

```bash
# Full installation (recommended for new projects)
npx vue-tdd init

# With GitHub Copilot support
npx vue-tdd init --copilot

# Minimal setup (core files only)
npx vue-tdd init --no-workflows --no-docs --no-scripts

# Core files + scripts only
npx vue-tdd init --no-workflows --no-docs

# Overwrite existing files
npx vue-tdd init --force
```

### Output Example

```
🤖 Initializing Vue TDD Workflow...

📦 Installing TDD infrastructure...

✅ Copied: src/test/setup.ts
✅ Copied: src/test/helpers/index.ts
✅ Copied: src/test/helpers/testing-library.ts
✅ Copied: src/test/helpers/vue-testing.ts
✅ Copied: src/test/helpers/composables-testing.ts
✅ Copied: vitest.config.ts
✅ Copied: scripts/tdd-feature.js
✅ Copied: scripts/create-tdd-component.js
✅ Copied: .github/workflows/auto-tdd-setup.yml
✅ Copied: TDD_WORKFLOW.md

📊 Summary: 10 files copied, 0 skipped

✅ Added script: test
✅ Added script: tdd

✅ TDD workflow initialized successfully!

Next steps:
  1. Run npm install to install dependencies
  2. Create your first component: npx vue-tdd create MyComponent
  3. Read TDD_WORKFLOW.md for detailed guide
```

---

## Command: vue-tdd create

### Purpose

Quickly create a new component with a test file.

### Syntax

```bash
npx vue-tdd create <name> [description] [options]
```

### Arguments

- `name` (required) - Component name in PascalCase (e.g., `UserCard`)
- `description` (optional) - Component description

### Options

```
--ai-generate      Use AI to generate test implementations (requires API key)
--copilot-ready    Generate Copilot-optimized scaffolds with rich context
```

### Flow Diagram

```mermaid
graph TD
    START[npx vue-tdd create MyButton] --> PARSE[Parse arguments & options]

    PARSE --> VALIDATE{Valid name?}
    VALIDATE -->|No| ERROR1[Error: Invalid component name<br/>Must be PascalCase]
    VALIDATE -->|Yes| CHECK_SCRIPT{Script exists?}

    CHECK_SCRIPT -->|No| ERROR2[Error: Run vue-tdd init first]
    CHECK_SCRIPT -->|Yes| BUILD_CMD[Build script command]

    BUILD_CMD --> ADD_FLAGS{Options?}

    ADD_FLAGS -->|--ai-generate| ADD_AI[Add --ai-generate flag]
    ADD_FLAGS -->|--copilot-ready| ADD_COPILOT[Add --copilot-ready flag]
    ADD_FLAGS -->|none| EXEC

    ADD_AI --> EXEC[Execute create-tdd-component.js]
    ADD_COPILOT --> EXEC

    EXEC --> SCRIPT_START[Script starts]

    SCRIPT_START --> BUILD_REQS[Build requirements:<br/>- Component name<br/>- Description<br/>- Default user story]

    BUILD_REQS --> GEN_TEST[Generate test file]

    GEN_TEST --> MODE{Generation mode?}

    MODE -->|AI| AI_GEN[AI generation]
    MODE -->|Copilot| COPILOT_GEN[Copilot scaffold]
    MODE -->|Default| SCAFFOLD_GEN[Enhanced scaffold]

    AI_GEN --> WRITE
    COPILOT_GEN --> WRITE
    SCAFFOLD_GEN --> WRITE

    WRITE --> WRITE_VUE[Write MyButton.vue]
    WRITE --> WRITE_TEST[Write MyButton.test.ts]

    WRITE_VUE --> SUCCESS[Success message]
    WRITE_TEST --> SUCCESS

    SUCCESS --> NEXT[Display next steps]

    style START fill:#e1f5ff
    style SUCCESS fill:#ccffcc
    style ERROR1 fill:#ffcccc
    style ERROR2 fill:#ffcccc
    style MODE fill:#ffffcc
```

### File Generation Detail

```mermaid
sequenceDiagram
    participant U as User
    participant CLI as CLI
    participant S as Script
    participant TG as Test Generator
    participant FS as File System

    U->>CLI: npx vue-tdd create Button "A button component"

    CLI->>S: create-tdd-component.js Button "description"

    S->>S: Validate component name (PascalCase)

    S->>TG: generateTestContent(Button, requirements, options)

    alt AI Generation
        TG->>TG: Call AI API
        TG->>TG: Get test implementations
    else Copilot Ready
        TG->>TG: Build rich scaffolds
    else Default
        TG->>TG: Build basic scaffolds
    end

    TG-->>S: Complete test file content

    S->>FS: Create src/components/ if needed
    S->>FS: Write Button.vue (minimal scaffold)
    S->>FS: Write Button.test.ts (generated tests)

    S-->>CLI: Success
    CLI-->>U: Display success & next steps
```

### Example Usage

```bash
# Basic component creation
npx vue-tdd create UserCard "Displays user profile information"

# With AI generation
npx vue-tdd create LoginForm "User login form" --ai-generate

# With Copilot-optimized scaffolds
npx vue-tdd create SearchBar "Search input component" --copilot-ready

# Minimal (name only)
npx vue-tdd create Button
```

### Generated Files

For `npx vue-tdd create UserCard`:

**src/components/UserCard.vue:**
```vue
<template>
  <div class="user-card">
    <!-- Implement component following TDD -->
  </div>
</template>

<script setup lang="ts">
// Component implementation goes here
</script>

<style scoped>
.user-card {
  /* Add styles */
}
</style>
```

**src/components/UserCard.test.ts:**
```typescript
/**
 * UserCard Component Tests
 * Auto-generated from TDD Feature CLI
 *
 * User Story: Component: UserCard
 *
 * This test file follows TDD approach - all tests should fail initially (Red phase)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/helpers/testing-library'
import { mount } from '@vue/test-utils'
import UserCard from './UserCard.vue'

describe('UserCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Accessibility', () => {
    // Generated accessibility tests...
  });
});
```

---

## Command: vue-tdd feature

### Purpose

Interactive wizard for creating a complete feature with detailed requirements, user story, and comprehensive test scenarios.

### Syntax

```bash
npx vue-tdd feature [options]
```

### Options

```
--no-issue         Skip GitHub issue creation
--ai-generate      Use AI to generate test implementations
--copilot-ready    Generate Copilot-optimized scaffolds
```

### Flow Diagram

```mermaid
graph TD
    START[npx vue-tdd feature] --> LAUNCH[Launch interactive wizard]

    LAUNCH --> Q1[Prompt: Component name?]
    Q1 --> A1[User: UserProfile]

    A1 --> Q2[Prompt: User story?]
    Q2 --> A2[User: As a user, I want...]

    A2 --> Q3[Prompt: Acceptance criteria?]
    Q3 --> A3[User: List criteria]

    A3 --> Q4[Prompt: Props?]
    Q4 --> A4[User: userId: string, ...]

    A4 --> Q5[Prompt: Events?]
    Q5 --> A5[User: profileUpdated, ...]

    A5 --> Q6[Prompt: Happy path scenarios?]
    Q6 --> A6[User: List scenarios]

    A6 --> Q7[Prompt: Edge cases?]
    Q7 --> A7[User: List edge cases]

    A7 --> Q8[Prompt: Error cases?]
    Q8 --> A8[User: List error cases]

    A8 --> ISSUE_CHECK{--issue flag?}

    ISSUE_CHECK -->|--issue| Q9[Prompt: Create GitHub issue?]
    ISSUE_CHECK -->|--no-issue| BUILD_REQS

    Q9 --> A9{User confirms?}
    A9 -->|Yes| CREATE_ISSUE[Create GitHub issue]
    A9 -->|No| BUILD_REQS

    CREATE_ISSUE --> ISSUE_API[Call GitHub API]
    ISSUE_API --> ISSUE_SUCCESS[Issue #123 created]
    ISSUE_SUCCESS --> BUILD_REQS

    BUILD_REQS[Build requirements object] --> GEN_TEST[Generate test file]

    GEN_TEST --> MODE{Generation mode?}

    MODE -->|--ai-generate| AI_PATH[AI generation]
    MODE -->|--copilot-ready| COPILOT_PATH[Copilot scaffolds]
    MODE -->|default| SCAFFOLD_PATH[Enhanced scaffolds]

    AI_PATH --> WRITE
    COPILOT_PATH --> WRITE
    SCAFFOLD_PATH --> WRITE

    WRITE[Write files] --> COMP[UserProfile.vue]
    WRITE --> TEST[UserProfile.test.ts]

    COMP --> SUCCESS[Success summary]
    TEST --> SUCCESS

    SUCCESS --> NEXT[Display next steps]

    style START fill:#e1f5ff
    style SUCCESS fill:#ccffcc
    style CREATE_ISSUE fill:#ffffcc
```

### Interactive Prompts Detail

```mermaid
sequenceDiagram
    participant U as User
    participant W as Wizard
    participant GH as GitHub API
    participant TG as Test Generator
    participant FS as File System

    W->>U: What is the component name?
    U-->>W: UserProfileCard

    W->>U: What is the user story?
    U-->>W: As a user, I want to view profile cards...

    W->>U: List acceptance criteria (one per line, empty to finish)
    U-->>W: Display user name
    U-->>W: Display user email
    U-->>W: Display user avatar
    U-->>W: [empty]

    W->>U: What are the component props?
    U-->>W: user: { name: string, email: string, avatar: string }

    W->>U: What events does the component emit?
    U-->>W: profileClick

    W->>U: List happy path scenarios
    U-->>W: User clicks on profile card
    U-->>W: User hovers over profile card
    U-->>W: [empty]

    W->>U: List edge cases
    U-->>W: User with no avatar
    U-->>W: User with very long name
    U-->>W: [empty]

    W->>U: List error cases
    U-->>W: Failed to load user data
    U-->>W: [empty]

    W->>U: Create GitHub issue?
    U-->>W: Yes

    W->>GH: Create issue with all details
    GH-->>W: Issue #123 created

    W->>TG: Generate tests with all requirements

    TG-->>W: Test file content

    W->>FS: Write UserProfileCard.vue
    W->>FS: Write UserProfileCard.test.ts

    W-->>U: Success! Issue #123, files created
```

### Example Usage

```bash
# Interactive wizard (default)
npx vue-tdd feature

# Skip GitHub issue creation
npx vue-tdd feature --no-issue

# With AI generation
npx vue-tdd feature --ai-generate

# With Copilot scaffolds
npx vue-tdd feature --copilot-ready

# AI generation without issue
npx vue-tdd feature --no-issue --ai-generate
```

### Example Session

```
🚀 Feature Creation Wizard

? Component name: UserProfileCard
? User story: As a user, I want to view user profile cards so I can see user information at a glance

? Acceptance criteria (press Enter to add more, empty line to finish):
  1: Display user name
  2: Display user email
  3: Display user avatar
  4: [Enter]

? Component props (e.g., "value: string, onChange: Function"):
  user: { name: string, email: string, avatar: string }

? Component events (e.g., "change, submit"):
  profileClick

? Happy path scenarios (press Enter to add more, empty line to finish):
  1: User views profile card with all information
  2: User clicks on profile card
  3: [Enter]

? Edge cases:
  1: User with no avatar displays default
  2: User with very long name is truncated
  3: [Enter]

? Error cases:
  1: Failed to load user data shows error state
  2: [Enter]

? Create GitHub issue for this feature? (Y/n): Y

✨ Creating feature...
✅ GitHub issue #42 created: UserProfileCard
✅ Component created: src/components/UserProfileCard.vue
✅ Tests created: src/components/UserProfileCard.test.ts

Next steps:
  1. Run npm run tdd to start test watch mode
  2. Implement the component to make tests pass
  3. View issue: https://github.com/user/repo/issues/42
```

---

## GitHub Actions Integration

### Workflow: Auto TDD Setup

Automatically creates tests when a GitHub issue with `feature-request` label is created.

```mermaid
graph TD
    START[Issue created/labeled] --> CHECK{Has feature-request label?}

    CHECK -->|No| IGNORE[Do nothing]
    CHECK -->|Yes| TRIGGER[Trigger workflow]

    TRIGGER --> CHECKOUT[Checkout repository]
    CHECKOUT --> PARSE[Parse issue for:<br/>- Component name<br/>- User story<br/>- Acceptance criteria<br/>- Test scenarios]

    PARSE --> EXTRACT{Valid data?}
    EXTRACT -->|No| ERROR[Comment: Invalid issue format]
    EXTRACT -->|Yes| BRANCH[Create feature branch]

    BRANCH --> GEN_SCRIPT[Run generate-tests-from-issue.js]

    GEN_SCRIPT --> TG[Generate tests]
    TG --> WRITE[Write component files]

    WRITE --> COMMIT[Commit & push to branch]
    COMMIT --> COMMENT[Comment on issue:<br/>- Branch created<br/>- Files generated<br/>- Instructions]

    COMMENT --> SUCCESS[Workflow complete]

    style START fill:#e1f5ff
    style SUCCESS fill:#ccffcc
    style ERROR fill:#ffcccc
```

### Issue → Tests Flow

```mermaid
sequenceDiagram
    participant D as Developer
    participant GH as GitHub
    participant WF as Workflow
    participant SCRIPT as Script
    participant TG as Test Generator
    participant REPO as Repository

    D->>GH: Create issue with template
    D->>GH: Add feature-request label

    GH->>WF: Trigger auto-tdd-setup.yml

    WF->>REPO: Checkout code
    WF->>SCRIPT: Run generate-tests-from-issue.js

    SCRIPT->>GH: Fetch issue content
    GH-->>SCRIPT: Issue markdown

    SCRIPT->>SCRIPT: Parse markdown:<br/>- Extract component name<br/>- Extract user story<br/>- Extract acceptance criteria<br/>- Extract test scenarios

    SCRIPT->>TG: generateTestContent(name, requirements)

    TG-->>SCRIPT: Test file content

    SCRIPT->>REPO: Create feature/42-UserCard branch
    SCRIPT->>REPO: Write UserCard.vue
    SCRIPT->>REPO: Write UserCard.test.ts
    SCRIPT->>REPO: Commit & push

    SCRIPT-->>WF: Success

    WF->>GH: Comment on issue:<br/>"Branch created: feature/42-UserCard<br/>Files: UserCard.vue, UserCard.test.ts<br/>Checkout and run: npm run tdd"

    GH-->>D: Notification

    D->>REPO: git fetch && git checkout feature/42-UserCard
    D->>D: npm run tdd (start TDD)
```

---

## Common Workflows

### Workflow 1: New Project Setup

```mermaid
graph LR
    A[Create Vue project] --> B[cd project]
    B --> C[npx vue-tdd init]
    C --> D[npm install]
    D --> E[Ready for TDD!]

    style A fill:#e1f5ff
    style E fill:#ccffcc
```

**Commands:**
```bash
npm create vue@latest my-project
cd my-project
npx vue-tdd init --copilot
npm install
npm install -D @testing-library/jest-dom @testing-library/user-event @testing-library/vue @types/node @vitejs/plugin-vue @vue/test-utils @vitest/ui @vitest/coverage-v8 happy-dom vitest
```

### Workflow 2: Quick Component Creation

```mermaid
graph LR
    A[npx vue-tdd create] --> B[Implement component]
    B --> C[npm run tdd]
    C --> D{Tests pass?}
    D -->|No| B
    D -->|Yes| E[Done!]

    style A fill:#e1f5ff
    style E fill:#ccffcc
```

**Commands:**
```bash
npx vue-tdd create Button "A reusable button component"
npm run tdd
# Implement Button.vue until tests pass
```

### Workflow 3: Feature with GitHub Issue

```mermaid
graph TB
    A[Create GitHub issue] --> B[Add feature-request label]
    B --> C[GitHub Action creates branch]
    C --> D[Pull branch]
    D --> E[npm run tdd]
    E --> F[Implement feature]
    F --> G{Tests pass?}
    G -->|No| F
    G -->|Yes| H[Create PR]
    H --> I[Merge]

    style A fill:#e1f5ff
    style I fill:#ccffcc
```

**Commands:**
```bash
# After GitHub Action runs:
git fetch origin
git checkout feature/42-UserCard
npm run tdd
# Implement until tests pass
git push
gh pr create
```

### Workflow 4: Full Feature with CLI

```mermaid
graph TB
    A[npx vue-tdd feature] --> B[Answer prompts]
    B --> C[Files generated]
    C --> D[npm run tdd]
    D --> E[RED: Tests fail]
    E --> F[Implement component]
    F --> G[GREEN: Tests pass]
    G --> H[REFACTOR: Clean up]
    H --> I{All tests pass?}
    I -->|No| F
    I -->|Yes| J[git add .]
    J --> K[git commit]
    K --> L[Create PR]

    style A fill:#e1f5ff
    style E fill:#ffcccc
    style G fill:#ccffcc
    style L fill:#ccccff
```

**Commands:**
```bash
npx vue-tdd feature --ai-generate
# Answer all prompts
npm run tdd
# RED phase: See failing tests
# GREEN phase: Implement until tests pass
# REFACTOR phase: Clean up code while tests stay green
git add .
git commit -m "feat: add UserProfile component"
gh pr create
```

---

## Summary

The `vue-tdd` CLI provides three levels of component creation:

1. **init** - One-time project setup
2. **create** - Quick component creation for simple needs
3. **feature** - Full-featured wizard for complex components

Each command supports multiple generation modes (AI, Copilot, Default) and integrates seamlessly with GitHub workflows for team collaboration.

Choose the right command based on your needs:
- Use `init` once at project start
- Use `create` for quick, simple components
- Use `feature` for complex features with detailed requirements
- Use GitHub issues for team-wide, automated TDD workflows
