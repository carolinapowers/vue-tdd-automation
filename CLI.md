# Vue-TDD CLI Documentation

Complete reference for all `vue-tdd` command-line interface commands.

## Table of Contents

- [Installation](#installation)
- [Commands Overview](#commands-overview)
- [Command Reference](#command-reference)
  - [vue-tdd init](#vue-tdd-init)
  - [vue-tdd create](#vue-tdd-create)
  - [vue-tdd feature](#vue-tdd-feature)
- [NPM Scripts](#npm-scripts)
- [Workflows](#workflows)
- [Examples](#examples)

## Installation

```bash
npm install -D @vue-tdd/automation
```

## Commands Overview

| Command | Purpose | Interactive | Output |
|---------|---------|-------------|--------|
| `init` | Initialize TDD workflow | No | Setup files, config, docs |
| `create` | Create component with tests | No | Component + test file |
| `feature` | Feature creation wizard | Yes | Optional: branch, tests, GitHub issue |

## Command Reference

### vue-tdd init

Initialize TDD workflow in your Vue project. This is typically the first command you run after installation.

#### Syntax

```bash
npx vue-tdd init [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--no-workflows` | Skip GitHub Actions workflows | false |
| `--no-docs` | Skip documentation files | false |
| `--no-scripts` | Skip component creation scripts | false |
| `--force` | Overwrite existing files | false |

#### What Gets Installed

**Files & Directories:**
```
your-project/
├── .github/
│   ├── workflows/
│   │   ├── auto-tdd-setup.yml    # Automated TDD workflow
│   │   └── tdd.yml                # CI/CD test workflow
│   └── ISSUE_TEMPLATE/
│       └── feature_request.md     # Feature request template
├── scripts/
│   ├── tdd-feature.js             # Feature creation script
│   └── create-tdd-component.js    # Component creation script
├── src/
│   └── test/
│       ├── setup.ts               # Test setup & configuration
│       └── helpers/
│           ├── index.ts           # Main helpers export
│           ├── testing-library.ts # Testing Library utilities
│           ├── vue-testing.ts     # Vue Test Utils helpers
│           └── composables-testing.ts # Composable testing utilities
├── vitest.config.ts               # Vitest configuration
├── TDD_WORKFLOW.md                # TDD workflow guide
├── TESTING_COMPARISON.md          # Testing approaches comparison
└── VUE_TESTING_ALIGNMENT.md       # Vue.js standards compliance
```

**NPM Scripts Added to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "tdd": "vitest --watch --reporter=verbose",
    "create:component": "node scripts/create-tdd-component.js",
    "tdd:feature": "node scripts/tdd-feature.js"
  }
}
```

**Dependencies Required:**

The command will prompt you to install these dependencies:

```bash
npm install -D @testing-library/jest-dom \
              @testing-library/user-event \
              @testing-library/vue \
              @types/node \
              @vitejs/plugin-vue \
              @vue/test-utils \
              @vitest/ui \
              @vitest/coverage-v8 \
              happy-dom \
              vitest
```

#### Examples

**Full Installation (Default)**
```bash
npx vue-tdd init
```

**Minimal Setup (Core Test Files Only)**
```bash
npx vue-tdd init --no-workflows --no-docs --no-scripts
```

**Skip GitHub Workflows**
```bash
npx vue-tdd init --no-workflows
```

**Skip Documentation**
```bash
npx vue-tdd init --no-docs
```

**Force Overwrite Existing Files**
```bash
npx vue-tdd init --force
```

#### When to Use

- ✅ First time setting up TDD in your Vue project
- ✅ Migrating an existing project to TDD workflow
- ✅ Adding standardized testing infrastructure
- ✅ Setting up GitHub Actions for automated testing

---

### vue-tdd create

Create a new Vue component with TDD test scaffolding. This generates a minimal component and a comprehensive test file following TDD principles.

#### Syntax

```bash
npx vue-tdd create <name> [description]
```

#### Arguments

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| `name` | Yes | Component name (PascalCase) | `UserProfile` |
| `description` | No | Component description | `"User profile display component"` |

#### What Gets Created

**1. Component File** - `src/components/{ComponentName}.vue`
```vue
<script setup lang="ts">
// Minimal component scaffold
defineProps<{
  // TODO: Define props
}>()
</script>

<template>
  <div data-testid="{componentname}-container">
    <!-- TODO: Implement component -->
  </div>
</template>
```

**2. Test File** - `src/components/{ComponentName}.test.ts`

Generates a comprehensive test file with:
- Component initialization tests
- Props validation tests
- User interaction tests
- Event emission tests
- Accessibility tests
- Edge case tests

All tests include TODO comments and intentionally fail (TDD Red phase).

#### Examples

**Basic Component Creation**
```bash
npx vue-tdd create UserCard
```

**Component with Description**
```bash
npx vue-tdd create UserCard "Displays user information in a card layout"
```

**Complex Component Names**
```bash
npx vue-tdd create ShoppingCartItem
npx vue-tdd create APIKeyManager
npx vue-tdd create HTTPClient
```

#### Output

```
🎨 Creating UserCard component...

✅ Created test file: /path/to/src/components/UserCard.test.ts
✅ Created component file: /path/to/src/components/UserCard.vue

📋 Next steps:
1. Update the test file with actual requirements
2. Run tests in watch mode: npm run tdd
3. Verify all tests fail (RED phase)
4. Implement the component to make tests pass (GREEN phase)
5. Refactor while keeping tests green (REFACTOR phase)

🚀 Happy TDD coding!
```

#### When to Use

- ✅ Creating a new component from scratch
- ✅ Quick TDD setup for a simple component
- ✅ When you already know the component requirements
- ✅ Automated component creation in scripts

---

### vue-tdd feature

Interactive wizard for comprehensive feature creation. Guides you through defining requirements, creating tests, and optionally generating GitHub issues.

#### Syntax

```bash
npx vue-tdd feature [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--no-issue` | Skip GitHub issue creation | false |

#### Interactive Prompts

The wizard guides you through:

**1. Component Details**
- Component name (PascalCase)
- Brief description
- Props (comma-separated with types)
- Events (comma-separated)
- State management approach (local/composable/pinia)

**2. User Story**
- User type (e.g., admin, user, guest)
- Desired feature
- Benefit/value

**3. Acceptance Criteria**
- List of criteria that must be met
- Empty line to finish

**4. Test Scenarios**

**Happy Path:**
- Normal usage scenarios
- Expected behaviors

**Edge Cases:**
- Boundary conditions
- Unusual but valid inputs

**Error Cases:**
- Invalid inputs
- Error handling scenarios

**5. UI/UX Requirements**
- Desktop view requirements
- Mobile view requirements
- Accessibility requirements

**6. GitHub Issue Creation (Optional)**
- Creates formatted GitHub issue with all requirements
- Uses GitHub CLI (`gh`) if installed
- Falls back to saving issue content to a file

**7. Local Setup (Optional)**
- Creates feature branch
- Generates component scaffold
- Creates comprehensive test file
- All ready for TDD development

#### Examples

**Full Interactive Wizard**
```bash
npx vue-tdd feature
```

**Skip GitHub Issue Creation**
```bash
npx vue-tdd feature --no-issue
```

#### Sample Session

```bash
$ npx vue-tdd feature

🤖 TDD Feature Generator

This tool will create a GitHub issue and automatically set up TDD for your feature.

Component name (PascalCase): UserProfileCard
Brief description: Displays user profile information
User type (e.g., user, admin, guest): user
What feature do they want? view their profile information
What benefit does it provide? easy access to account details

📝 Acceptance Criteria
Enter acceptance criteria (empty line to finish):
  - Profile picture is displayed
  - Username and email are visible
  - Bio text is shown if available
  -

🧩 Component Details
Props: name: string, email: string, bio?: string, avatarUrl?: string
Events: edit, delete
State management: local

✅ Test Scenarios
Happy path scenarios (empty line to finish):
  - All fields populated correctly
  - Avatar displays properly
  -

Edge cases (empty line to finish):
  - Missing avatar URL uses default
  - Long bio text is truncated
  -

Error cases (empty line to finish):
  - Invalid email format handled gracefully
  -

📱 UI/UX Requirements
Desktop view requirements: Card layout with left-aligned avatar
Mobile view requirements: Stacked layout, full-width
Accessibility requirements: ARIA labels, keyboard navigation

✨ Creating GitHub issue...
✅ Issue created successfully!
https://github.com/user/repo/issues/42

Generate local TDD setup now? (y/n): y

🚀 Generating local TDD setup...
✅ TDD setup complete!

Next steps:
  1. Run tests: npm run tdd
  2. Implement UserProfileCard to make tests pass
  3. Commit when all tests are green
```

#### Output

**GitHub Issue** (if created)
- Formatted with all requirements
- Labeled as `feature-request`, `tdd`, `enhancement`
- Includes user story, acceptance criteria, test scenarios
- Component details and API requirements

**Local Files** (if generated)
- Feature branch: `feature/{componentname-lowercase}`
- Component file: `src/components/{ComponentName}.vue`
- Test file: `src/components/{ComponentName}.test.ts`
  - Tests generated from all acceptance criteria
  - Tests for all happy path scenarios
  - Tests for all edge cases
  - Tests for all error cases
  - Accessibility tests

**Issue File** (if GitHub CLI not available)
- Saved as `issue-{ComponentName}-{timestamp}.md`
- Contains all issue content ready to copy/paste

#### When to Use

- ✅ Planning a new feature comprehensively
- ✅ Need to document requirements clearly
- ✅ Working with GitHub issues for tracking
- ✅ Want automated test generation from requirements
- ✅ Team collaboration and requirement sharing

---

## NPM Scripts

After running `vue-tdd init`, these scripts are available:

### Testing Scripts

#### `npm test`
Run all tests once (CI mode).

```bash
npm test
```

**When to use:**
- CI/CD pipelines
- Pre-commit verification
- Quick validation

#### `npm run test:watch`
Run tests in watch mode (re-runs on file changes).

```bash
npm run test:watch
```

**When to use:**
- Active development
- Monitoring test status
- Quick feedback loop

#### `npm run test:ui`
Open Vitest UI for interactive testing.

```bash
npm run test:ui
```

**Features:**
- Visual test runner
- Test file explorer
- Code coverage view
- Console output
- Module graph

**When to use:**
- Debugging failing tests
- Exploring test coverage
- Visual test management

#### `npm run test:coverage`
Generate and display coverage report.

```bash
npm run test:coverage
```

**Output:**
- Terminal summary
- HTML report in `coverage/` directory
- Coverage thresholds validation

**When to use:**
- Before committing
- Checking test coverage
- Identifying untested code

#### `npm run tdd`
TDD mode with verbose output (recommended for development).

```bash
npm run tdd
```

**Features:**
- Watch mode enabled
- Verbose reporter
- Detailed test output
- Real-time feedback

**When to use:**
- Active TDD development (RED → GREEN → REFACTOR)
- Writing new tests
- Implementing features

### Component Creation Scripts

#### `npm run create:component`
Alias for `vue-tdd create` using the local script.

```bash
npm run create:component
# Then follow prompts
```

#### `npm run tdd:feature`
Alias for `vue-tdd feature` using the local script.

```bash
npm run tdd:feature
# Then follow prompts
```

---

## Workflows

### TDD Workflow (Manual)

1. **Create Component with Tests**
   ```bash
   npx vue-tdd create MyComponent
   ```

2. **Start TDD Mode**
   ```bash
   npm run tdd
   ```

3. **RED Phase** - Verify tests fail
4. **GREEN Phase** - Implement component
5. **REFACTOR Phase** - Clean up code
6. **Commit**
   ```bash
   git add src/components/MyComponent.*
   git commit -m "feat: implement MyComponent with TDD"
   ```

### GitHub Issue Workflow (Automated)

1. **Create Feature**
   ```bash
   npx vue-tdd feature
   ```

2. **GitHub Action Triggers** (on issue labeled `feature-request`)
   - Creates feature branch
   - Generates component scaffold
   - Creates test file from requirements
   - Comments on issue with instructions

3. **Checkout Branch**
   ```bash
   git fetch origin
   git checkout feature/{issue-number}-{ComponentName}
   ```

4. **Develop with TDD**
   ```bash
   npm run tdd
   ```

5. **Create PR**
   ```bash
   gh pr create
   ```

### Quick Component Workflow

For simple components without GitHub issues:

```bash
# Create component
npx vue-tdd create QuickButton "A quick button"

# Start TDD
npm run tdd

# Implement & commit
git add src/components/QuickButton.*
git commit -m "feat: add QuickButton component"
```

---

## Examples

### Example 1: Initialize New Project

```bash
# Install package
npm install -D @vue-tdd/automation

# Initialize with full setup
npx vue-tdd init

# Install dependencies
npm install -D @testing-library/jest-dom @testing-library/user-event \
               @testing-library/vue @types/node @vitejs/plugin-vue \
               @vue/test-utils @vitest/ui @vitest/coverage-v8 \
               happy-dom vitest

# Create first component
npx vue-tdd create HelloWorld "Welcome component"

# Start developing
npm run tdd
```

### Example 2: Create Component with Full Requirements

```bash
# Use interactive wizard
npx vue-tdd feature

# Follow prompts to define:
# - Component: SearchBar
# - Props: placeholder, initialValue
# - Events: search, clear
# - Test scenarios for all cases

# If generating local setup, tests are ready:
npm run tdd

# Implement SearchBar.vue to pass tests
```

### Example 3: Minimal Setup for Existing Project

```bash
# Install without workflows/docs
npx vue-tdd init --no-workflows --no-docs

# This installs only:
# - Test helpers
# - Vitest config
# - NPM scripts

# Create component manually
npx vue-tdd create UserAvatar
```

### Example 4: CI/CD Integration

```bash
# In .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test              # Run tests once
      - run: npm run test:coverage # Check coverage
```

---

## Tips & Best Practices

### Naming Conventions

**Component Names:**
- Use PascalCase: `UserProfile`, `ShoppingCart`
- Be descriptive: `ProductCard` not `Card`
- Avoid abbreviations: `NavigationBar` not `NavBar`

**Test Descriptions:**
- Start with "should": `should display user name`
- Be specific: `should disable button when loading`
- Test behavior, not implementation

### Command Selection Guide

**Use `init` when:**
- Setting up a new project
- First time using vue-tdd
- Need complete testing infrastructure

**Use `create` when:**
- Quick component creation
- Already know requirements
- Simple components
- Scripting/automation

**Use `feature` when:**
- Complex features
- Need requirement documentation
- Team collaboration
- GitHub issue tracking

### TDD Best Practices

1. **One test at a time** - Don't write all tests upfront
2. **Minimal implementation** - Just enough code to pass
3. **Refactor fearlessly** - Tests protect you
4. **Commit often** - Small, focused commits
5. **Keep tests simple** - One assertion per test
6. **Mock external dependencies** - Isolate components
7. **Test user behavior** - Not implementation details

---

## Troubleshooting

### Command Not Found

```bash
# If npx vue-tdd not found:
npm install -D @vue-tdd/automation

# Or use explicit path:
npx @vue-tdd/automation init
```

### Tests Not Running

```bash
# Ensure dependencies installed:
npm install

# Check vitest is installed:
npm list vitest

# Run with verbose output:
npm run tdd
```

### GitHub CLI Not Available

When using `vue-tdd feature`, if GitHub CLI isn't installed:

1. Issue content saved to file
2. Manually create issue on GitHub
3. Copy/paste from saved file

Install GitHub CLI for automation:
```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Login
gh auth login
```

### Coverage Thresholds Failing

```bash
# View detailed coverage report:
npm run test:coverage

# Open HTML report:
open coverage/index.html

# Adjust thresholds in vitest.config.ts if needed
```

---

## Related Documentation

- [README.md](./README.md) - Package overview and quick start
- [TDD_WORKFLOW.md](./templates/docs/TDD_WORKFLOW.md) - Detailed TDD workflow guide
- [TESTING_COMPARISON.md](./templates/docs/TESTING_COMPARISON.md) - Testing approaches
- [TESTING_QUICK_START.md](./TESTING_QUICK_START.md) - Testing reference

---

## Support

- **Issues**: [GitHub Issues](https://github.com/carolinapowers/vue-tdd-automation/issues)
- **Documentation**: [GitHub Repository](https://github.com/carolinapowers/vue-tdd-automation)
- **npm**: [@vue-tdd/automation](https://www.npmjs.com/package/@vue-tdd/automation)
