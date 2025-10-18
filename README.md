# @carolinappowers/vue-tdd-automation

> Automated Test-Driven Development workflow for Vue.js applications

Automate your Vue.js TDD workflow with GitHub issue-driven development, automatic test generation, and comprehensive testing utilities.

## ✨ Features

- 🤖 **GitHub Issue Integration** - Automatically create branches and tests from GitHub issues
- 📝 **Interactive CLI** - Guided component and test creation
- 🧪 **Vitest + Testing Library** - Best-in-class testing setup
- ♿ **Accessibility First** - Built-in a11y testing utilities
- 📊 **Coverage Enforcement** - Automatic 80% coverage thresholds
- 🔄 **GitHub Actions** - Automated TDD setup workflow
- 🤖 **GitHub Copilot Support** - Pre-configured instructions for AI-assisted test writing
- 📚 **Comprehensive Docs** - TDD guides and best practices included

## 🚀 Quick Start

### Installation

```bash
npm install -D @carolinappowers/vue-tdd-automation
```

### Two Ways to Use

#### 1️⃣ **CLI-First Approach** (Recommended - No Setup Required!)

Start creating components immediately without any initialization:

```bash
# Create a component with tests - works instantly!
npx vue-tdd create MyButton "A reusable button"

# Or use the interactive feature wizard
npx vue-tdd feature
```

✨ **That's it!** The CLI commands work out-of-the-box with no configuration needed.

#### 2️⃣ **GitHub Actions Integration** (Optional)

If you want automated TDD setup from GitHub issues, initialize the full workflow:

```bash
npx vue-tdd init --scripts
```

This adds:
- GitHub Actions workflow for issue → PR automation
- Component creation scripts for CI/CD
- Issue templates

**See the [Hybrid Architecture](#-hybrid-architecture) section below for details.**

### Initialize Test Infrastructure (Optional but Recommended)

```bash
npx vue-tdd init
```

This adds:
- Vitest configuration with 80% coverage thresholds
- Test helpers and utilities
- GitHub Actions workflows
- Issue templates
- Comprehensive TDD documentation

**Tip:** Add `--copilot` flag to include GitHub Copilot instructions for AI-assisted test writing

## 📖 Usage

> 💡 **For complete CLI documentation, see [CLI.md](./CLI.md)**

### CLI Commands

#### `vue-tdd init`
Initialize TDD workflow in your Vue project.

```bash
npx vue-tdd init
```

Options:
- `--no-workflows` - Skip GitHub Actions workflows
- `--no-docs` - Skip documentation files
- `--scripts` - Copy component creation scripts (compiled JS, for GitHub Actions)
- `--scripts-ts` - Copy component creation scripts (TypeScript source, for customization)
- `--copilot` - Add GitHub Copilot instructions file
- `--force` - Overwrite existing files

Examples:
```bash
# Standard installation (workflows + docs, no scripts)
npx vue-tdd init

# With GitHub Actions automation (includes scripts)
npx vue-tdd init --scripts

# With TypeScript scripts for customization
npx vue-tdd init --scripts-ts

# With GitHub Copilot support
npx vue-tdd init --copilot

# Minimal (core test files only)
npx vue-tdd init --no-workflows --no-docs

# Everything including scripts
npx vue-tdd init --scripts --copilot
```

**Note:** The `--scripts` flag is only needed if you want GitHub Actions to automatically create components from issues. The CLI commands (`create` and `feature`) work without any scripts!

#### `vue-tdd feature`
Interactive feature creation wizard.

```bash
npx vue-tdd feature
```

Guides you through:
- Component details (name, props, events)
- User story
- Acceptance criteria
- Test scenarios
- Optional GitHub issue creation

#### `vue-tdd create <name>`
Create a component with tests.

```bash
npx vue-tdd create MyButton "A reusable button component"
```

Creates:
- `MyButton.vue` (minimal scaffold)
- `MyButton.test.ts` (failing tests)

## 🏗️ Hybrid Architecture

This package uses a **hybrid architecture** that gives you the best of both worlds:

### 🎯 Self-Contained CLI (Default)

The `create` and `feature` commands work **immediately** without requiring any initialization or copied scripts:

```bash
npx vue-tdd create MyButton "A button"  # Works instantly!
```

**How it works:**
- Commands import logic directly from the package
- No scripts copied to your repository
- Zero configuration required
- Perfect for quick development

### 🤖 GitHub Actions Integration (Optional)

For automated TDD workflows from GitHub issues, enable script copying:

```bash
npx vue-tdd init --scripts  # Copies scripts for GitHub Actions
```

**When to use:**
- You want issue → branch → PR automation
- You need scripts in CI/CD workflows
- You want to customize the generation logic

### 📝 Script Customization (Advanced)

Want to customize how components are generated? Copy the TypeScript source:

```bash
npx vue-tdd init --scripts-ts  # Copies TypeScript source files
```

Then edit `scripts/*.ts` in your project to customize:
- Test templates
- Component scaffolds
- Requirement parsing logic

### 🎨 Flexibility Matrix

| Use Case | Command | Scripts Copied? | Customizable? |
|----------|---------|----------------|---------------|
| Quick development | `npx vue-tdd create` | ❌ No | ❌ No |
| GitHub Actions | `npx vue-tdd init --scripts` | ✅ Yes (JS) | ⚠️ Limited |
| Full customization | `npx vue-tdd init --scripts-ts` | ✅ Yes (TS) | ✅ Yes |

## 🔄 GitHub Workflow

### 1. Create an Issue

Use the feature request template:

```markdown
## User Story
As a [user type], I want [feature] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Test Scenarios
### Happy Path
- [ ] Scenario 1

### Edge Cases
- [ ] Edge case 1
```

### 2. Add `feature-request` Label

The GitHub Action will automatically:
1. Create a feature branch
2. Generate component scaffold
3. Generate tests from issue requirements
4. Comment on issue with instructions

### 3. Develop with TDD

```bash
git fetch origin
git checkout feature/{issue-number}-{ComponentName}
npm run tdd
```

### 4. RED → GREEN → REFACTOR

1. **RED**: All tests fail (generated from issue)
2. **GREEN**: Implement component to pass tests
3. **REFACTOR**: Clean up while keeping tests green

### 5. Create PR When Ready

```bash
gh pr create
```

## 📁 What Gets Installed

### Files & Directories

```
your-project/
├── .github/
│   ├── copilot-instructions.md  ← Guides GitHub Copilot
│   ├── workflows/
│   │   └── auto-tdd-setup.yml
│   └── ISSUE_TEMPLATE/
│       └── feature_request.md
├── scripts/
│   ├── tdd-feature.js
│   └── create-tdd-component.js
├── src/
│   └── test/
│       ├── setup.ts
│       └── helpers/
│           ├── index.ts
│           ├── testing-library.ts
│           ├── vue-testing.ts
│           └── composables-testing.ts
├── vitest.config.ts
├── TDD_WORKFLOW.md
└── TESTING_COMPARISON.md
```

### NPM Scripts

The `init` command automatically adds these scripts to your `package.json`:

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

**Usage:**
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate coverage report
- `npm run tdd` - TDD mode with verbose output (recommended for development)
- `npm run create:component` - Create a component with tests using CLI
- `npm run tdd:feature` - Interactive feature creation wizard

## 🧪 Testing Utilities

### Vue Test Utils Helpers

```typescript
import { renderComponent, findByTestId } from '@/test/helpers/vue-testing'

const wrapper = renderComponent(MyComponent, {
  props: { value: 'test' }
})

const element = findByTestId(wrapper, 'my-button')
```

### Testing Library Helpers

```typescript
import { render } from '@/test/helpers/testing-library'

const { user } = render(MyComponent, {
  props: { value: 'test' }
})

await user.click(screen.getByRole('button'))
```

### Composable Testing

```typescript
import { withSetup, testReactiveComposable } from '@/test/helpers/composables-testing'

const [result, app] = withSetup(() => useMyComposable())
expect(result.count.value).toBe(0)
```

### Accessibility Testing

```typescript
import { a11y } from '@/test/helpers/testing-library'

expect(a11y.isAccessible(element)).toBe(true)
expect(a11y.getAccessibleName(element)).toBe('Submit Form')
```

## 🤖 GitHub Copilot Integration

This package includes pre-configured GitHub Copilot instructions to help you write better tests faster.

### What's Included

When you run `vue-tdd init --copilot`, a `.github/copilot-instructions.md` file is installed with:

- ✅ Vue + Vitest testing best practices
- ✅ Testing Library query preferences (accessibility-first)
- ✅ TDD workflow guidelines (Red → Green → Refactor)
- ✅ Accessibility testing patterns
- ✅ Common test patterns and examples
- ✅ What to test (and what NOT to test)

### How It Works

Once installed, GitHub Copilot automatically uses these instructions when you:
- Write new test files
- Add test cases
- Update existing tests

**Example:** When you type `it('should`, Copilot will suggest tests that follow Testing Library best practices, use accessible queries, and include proper async handling.

### Benefits

- **Faster Development** - Get intelligent test suggestions based on your requirements
- **Better Quality** - Tests follow best practices automatically
- **Consistency** - All tests follow the same patterns across your team
- **Learning Tool** - Great for teams learning TDD or Testing Library

### Requirements

- GitHub Copilot subscription (individual or business)
- VS Code with GitHub Copilot extension (or other Copilot-enabled IDE)

### Customization

Edit `.github/copilot-instructions.md` in your project to:
- Add project-specific testing patterns
- Include custom component examples
- Adjust guidelines for your team's needs

**Note:** Changes only affect your project, not the package defaults.

## 🎨 Customization

### Vitest Configuration

The installed `vitest.config.ts` can be customized:

```typescript
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,  // Adjust as needed
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
```

### GitHub Workflow

Edit `.github/workflows/auto-tdd-setup.yml` to customize:
- Branch naming
- Commit messages
- Comment format
- Trigger conditions

## 📚 Documentation & Resources

### Quick Reference

- **[CLI.md](./docs/CLI.md)** - Complete CLI command reference
  - All commands with examples
  - NPM scripts documentation
  - Workflows and troubleshooting

### User Guides

- **[TDD_WORKFLOW.md](./templates/docs/TDD_WORKFLOW.md)** - Complete TDD workflow guide
  - RED → GREEN → REFACTOR process
  - GitHub Copilot integration
  - Best practices and examples

- **[TESTING_COMPARISON.md](./templates/docs/TESTING_COMPARISON.md)** - Vue Test Utils vs Testing Library
  - When to use each approach
  - Code examples
  - Migration guide

- **[VUE_TESTING_ALIGNMENT.md](./templates/docs/VUE_TESTING_ALIGNMENT.md)** - Vue.js testing standards compliance
  - Official Vue.js testing recommendations
  - Framework alignment details

### Developer Resources

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture documentation
  - TypeScript → JavaScript build process
  - Directory structure explained
  - How scripts are compiled and distributed
  - Mermaid flow diagrams
  - Adding new scripts guide

- **[TESTING_QUICK_START.md](./docs/TESTING_QUICK_START.md)** - Quick testing reference
  - Running tests
  - Local package testing
  - Common commands

- **[TEST_SETUP.md](./docs/TEST_SETUP.md)** - Comprehensive testing guide
  - Detailed setup instructions
  - Testing strategies
  - Advanced configurations

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guide
  - Development workflow
  - Code standards
  - Pull request process

### Installation Guides

After running `vue-tdd init`, your project will include:

- **TDD_WORKFLOW.md** - TDD workflow guide (copied to your project)
- **TESTING_COMPARISON.md** - Testing approaches (copied to your project)
- **VUE_TESTING_ALIGNMENT.md** - Vue standards (copied to your project)

## 🧪 Testing & Development

This package has comprehensive test coverage (96.45%) using Vitest.

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Pre-commit Hooks

This project uses Husky and lint-staged to ensure code quality before commits:

- **ESLint** - Automatically fixes linting issues on staged files
- **Vitest** - Runs tests related to changed files

The hooks run automatically on `git commit`. To bypass if needed:

```bash
git commit --no-verify
```

**Note:** Only bypass hooks when absolutely necessary (e.g., work-in-progress commits).

### Local Testing
Before publishing, test the package with a real Vue project:

```bash
# Quick automated test
./create-test-project.sh

# Or manually with npm link
npm run build && npm link
cd /path/to/your/vue-project
npm link @carolinappowers/vue-tdd-automation
npx vue-tdd init
```

See [TESTING_QUICK_START.md](./TESTING_QUICK_START.md) for quick reference or [TEST_SETUP.md](./TEST_SETUP.md) for comprehensive testing guide.

## 🤝 Contributing

Contributions welcome! Please read our contributing guide.

## 📄 License

MIT © Carolina Powers

## 🔗 Links

- [GitHub Repository](https://github.com/carolinapowers/vue-tdd-automation)
- [npm Package](https://www.npmjs.com/package/@carolinappowers/vue-tdd-automation)
- [Issue Tracker](https://github.com/carolinapowers/vue-tdd-automation/issues)

## 🙏 Credits

Built with:
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
