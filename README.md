# @vue-tdd/automation

> Automated Test-Driven Development workflow for Vue.js applications

Automate your Vue.js TDD workflow with GitHub issue-driven development, automatic test generation, and comprehensive testing utilities.

## ✨ Features

- 🤖 **GitHub Issue Integration** - Automatically create branches and tests from GitHub issues
- 📝 **Interactive CLI** - Guided component and test creation
- 🧪 **Vitest + Testing Library** - Best-in-class testing setup
- ♿ **Accessibility First** - Built-in a11y testing utilities
- 📊 **Coverage Enforcement** - Automatic 80% coverage thresholds
- 🔄 **GitHub Actions** - Automated TDD setup workflow
- 📚 **Comprehensive Docs** - TDD guides and best practices included

## 🚀 Quick Start

### Installation

```bash
npm install -D @vue-tdd/automation
```

### Initialize TDD in Your Project

```bash
npx vue-tdd init
```

This will:
- Set up Vitest configuration
- Add test helpers and utilities
- Install GitHub Actions workflow
- Add issue templates
- Create comprehensive documentation

### Create Your First Component (TDD Style)

```bash
# Interactive feature creation
npx vue-tdd feature

# Or create a component directly
npx vue-tdd create MyComponent "Component description"
```

## 📖 Usage

### CLI Commands

#### `vue-tdd init`
Initialize TDD workflow in your Vue project.

```bash
npx vue-tdd init
```

Options:
- `--no-workflows` - Skip GitHub Actions workflows
- `--no-docs` - Skip documentation files
- `--no-scripts` - Skip component creation scripts
- `--force` - Overwrite existing files

Examples:
```bash
# Full installation (default)
npx vue-tdd init

# Minimal (core test files only)
npx vue-tdd init --no-workflows --no-docs --no-scripts

# Skip workflows only
npx vue-tdd init --no-workflows
```

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

```
your-project/
├── .github/
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

## 📚 Documentation

After initialization, you'll have:

- **TDD_WORKFLOW.md** - Complete TDD workflow guide
- **TESTING_COMPARISON.md** - Vue Test Utils vs Testing Library
- **VUE_TESTING_ALIGNMENT.md** - Vue.js testing standards compliance

## 🧪 Testing & Development

This package has comprehensive test coverage (96.45%) using Vitest.

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Local Testing
Before publishing, test the package with a real Vue project:

```bash
# Quick automated test
./create-test-project.sh

# Or manually with npm link
npm run build && npm link
cd /path/to/your/vue-project
npm link @vue-tdd/automation
npx vue-tdd init
```

See [TESTING_QUICK_START.md](./TESTING_QUICK_START.md) for quick reference or [TEST_SETUP.md](./TEST_SETUP.md) for comprehensive testing guide.

## 🤝 Contributing

Contributions welcome! Please read our contributing guide.

## 📄 License

MIT © Carolina Powers

## 🔗 Links

- [GitHub Repository](https://github.com/carolinapowers/vue-tdd-automation)
- [npm Package](https://www.npmjs.com/package/@vue-tdd/automation)
- [Issue Tracker](https://github.com/carolinapowers/vue-tdd-automation/issues)

## 🙏 Credits

Built with:
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
