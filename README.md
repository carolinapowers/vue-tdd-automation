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
- 🧠 **AI-Powered Test Generation** - Generate actual test implementations with OpenAI or GitHub Models (optional)
- 🤖 **Copilot-Optimized Scaffolds** - Rich context scaffolds designed for GitHub Copilot completion (no API keys needed!)
- 💡 **GitHub Copilot Instructions** - Pre-configured instructions for AI-assisted test writing
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

**Tip:** Add `--copilot` flag to include GitHub Copilot instructions for AI-assisted test writing

### Create Your First Component (TDD Style)

```bash
# Interactive feature creation
npx vue-tdd feature

# Or create a component directly
npx vue-tdd create MyComponent "Component description"
```

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
- `--no-scripts` - Skip component creation scripts
- `--copilot` - Add GitHub Copilot instructions file
- `--force` - Overwrite existing files

Examples:
```bash
# Full installation (default)
npx vue-tdd init

# With GitHub Copilot support
npx vue-tdd init --copilot

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

## 🧠 AI-Powered Test Generation

Generate actual test implementations using AI instead of scaffolds with TODOs.

### Overview

By default, `@vue-tdd/automation` generates test scaffolds with Arrange/Act/Assert structure and TODO comments (perfect for TDD). With the `--ai-generate` flag, you can generate actual test implementations using AI.

### Quick Start

```bash
# Set your API key (choose one)
export OPENAI_API_KEY="sk-..."  # OpenAI API
export GITHUB_TOKEN="ghp_..."    # GitHub Models API (free tier available)

# Generate AI-powered tests
npx vue-tdd create MyButton "A button component" --ai-generate
npx vue-tdd feature --ai-generate
```

### How It Works

1. **AI Generation** - Tries to generate actual test code using OpenAI or GitHub Models API
2. **Enhanced Scaffolds** - Falls back to structured scaffolds with Arrange/Act/Assert if AI fails or no API key
3. **Hybrid Approach** - Best of both worlds: AI intelligence with reliable fallback

### API Key Setup

#### OpenAI API

```bash
# Get API key from https://platform.openai.com/api-keys
export OPENAI_API_KEY="sk-your-key-here"

# Or add to your shell profile (.bashrc, .zshrc, etc.)
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.zshrc
```

#### GitHub Models API (Free Tier)

```bash
# Use your GitHub personal access token
export GITHUB_TOKEN="ghp_your-token-here"

# Or use existing token if you have one
# GitHub CLI users already have this set!
```

### Features

- ✅ **Actual Test Implementations** - No more TODOs, get working test code
- ✅ **Intelligent** - Understands user stories, acceptance criteria, and component context
- ✅ **Testing Library First** - Generates accessible, user-centric tests
- ✅ **Arrange/Act/Assert** - Follows best practices with clear structure
- ✅ **Automatic Fallback** - Enhanced scaffolds if AI unavailable
- ✅ **No Lock-in** - Works with or without AI, your choice

### Examples

#### Without AI (Default)
```typescript
it('should display welcome message', async () => {
  // Happy Path: User sees welcome message on load

  // Arrange
  const { user } = render(WelcomeCard);

  // Act
  // TODO: Implement user interactions based on scenario

  // Assert
  // TODO: Add assertions to verify: User sees welcome message on load

  expect(true).toBe(false); // This should fail (TDD - Red phase)
});
```

#### With AI (`--ai-generate`)
```typescript
it('should display welcome message', async () => {
  // Happy Path: User sees welcome message on load

  // Arrange
  const { user } = render(WelcomeCard, {
    props: {
      userName: 'John'
    }
  });

  // Act
  // Component renders immediately with welcome message

  // Assert
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Welcome, John!');
  expect(screen.getByText(/we're glad you're here/i)).toBeInTheDocument();
});
```

### Configuration

AI generation is **opt-in** via the `--ai-generate` flag:

```bash
# Interactive wizard with AI
npx vue-tdd feature --ai-generate

# Create component with AI
npx vue-tdd create MyComponent "Description" --ai-generate

# Use environment variable for scripts
AI_GENERATE=true npm run tdd:feature
```

### Supported AI Providers

- **OpenAI** (gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
- **GitHub Models** (free tier available for GitHub users)

### When to Use AI Generation

**Use AI generation when:**
- You want to move faster with ready-to-refine tests
- You're learning Testing Library patterns
- You have clear, well-defined requirements
- You want to reduce repetitive test writing

**Use scaffolds when:**
- You're doing strict TDD (Red → Green → Refactor)
- You want full control over test implementation
- You're learning testing concepts
- No API key available

### Cost & Rate Limits

- **GitHub Models**: Free tier available for all GitHub users
- **OpenAI**: ~$0.15 per 1M tokens (GPT-4o-mini), approximately $0.001-0.005 per test
- **Caching**: No caching between runs, each test generated fresh

## 🤖 Copilot-Optimized Scaffolds

Perfect for teams with existing GitHub Copilot subscriptions! Generate test scaffolds specifically designed to maximize Copilot's ability to suggest accurate test implementations.

### Overview

If your company provides GitHub Copilot, you don't need separate AI API keys. The `--copilot-ready` flag generates scaffolds with rich contextual comments that help Copilot suggest better completions.

### Quick Start

```bash
# Generate Copilot-optimized test scaffolds
npx vue-tdd create MyButton "A button component" --copilot-ready
npx vue-tdd feature --copilot-ready
```

### How It Works

Copilot-optimized scaffolds include:
- **Rich Context** - User story, acceptance criteria, and component details in comments
- **Step-by-Step Guidance** - Detailed COPILOT INSTRUCTIONS for what to implement
- **Example Patterns** - Common testing patterns and best practices inline
- **Type Hints** - Component props and events clearly documented
- **Documentation Links** - References to Testing Library docs and WCAG standards

### Example Output

```typescript
it('should display user name', async () => {
  // Acceptance Criteria: Card displays user name
  // User Story: As a user, I want to see a profile card so that I can view user information
  // Component props: userName: string, email?: string
  //
  // COPILOT INSTRUCTIONS:
  // 1. Render the ProfileCard component with appropriate props
  // 2. Simulate user interactions that match the scenario: "Card displays user name"
  // 3. Assert that the expected outcome is achieved
  //
  // Testing Library Best Practices:
  // - Use getByRole() for semantic queries (preferred)
  // - Use getByLabelText() for form inputs
  // - Use getByText() for text content
  //
  // TDD Pattern: This test should FAIL initially (Red phase)

  // STEP 1: Arrange - Set up the test environment
  const { user } = render(ProfileCard, {
    props: {
      // TODO: Add props based on: userName: string, email?: string
      // Example: userName: 'John Doe', email: 'john@example.com'
    }
  });

  // STEP 2: Act - Simulate user interactions
  // Common patterns:
  //   - Click: await user.click(screen.getByRole('button', { name: /text/i }))
  //   - Type: await user.type(screen.getByLabelText('Label'), 'value')

  // STEP 3: Assert - Verify the expected outcome
  // Common assertions:
  //   - Element visible: expect(screen.getByText('text')).toBeInTheDocument()
  //   - Element has text: expect(screen.getByRole('heading')).toHaveTextContent('User Name')

  // TDD Red Phase: This should fail until component is implemented
  expect(true).toBe(false); // Remove this line after implementing the test
});
```

### Benefits

- **No API Keys Required** - Use your existing Copilot subscription
- **Better Completions** - Rich context helps Copilot understand what you need
- **Learning Tool** - Detailed comments teach Testing Library best practices
- **Accessibility Focus** - Built-in WCAG guidance and semantic HTML examples
- **Works in GitHub Actions** - Unlike AI generation, these scaffolds work in CI/CD

### Comparison with Other Modes

| Mode | Best For | Requires |
|------|----------|----------|
| **Default** | Strict TDD, full control | Nothing |
| **`--ai-generate`** | Fast development, ready tests | API key |
| **`--copilot-ready`** | Teams with Copilot, guided completion | GitHub Copilot |

### Usage in GitHub Actions

Copilot-optimized scaffolds work perfectly in automated workflows:

```yaml
# In your GitHub Actions workflow
- name: Generate tests with Copilot scaffolds
  run: |
    npx vue-tdd feature --copilot-ready
```

Team members can then complete the scaffolds using Copilot in their IDE.

### Requirements

- GitHub Copilot subscription (individual, business, or enterprise)
- VS Code with GitHub Copilot extension (or other Copilot-enabled IDE)

### Tips for Best Results

1. **Keep Context** - Don't delete the comment blocks - they help Copilot
2. **Tab Through** - Use Tab to accept Copilot suggestions step by step
3. **Review Generated Code** - Always verify Copilot's suggestions match your requirements
4. **Combine with `--copilot` Init** - Use both `vue-tdd init --copilot` and `--copilot-ready` for maximum benefit

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

- **[CLI.md](./CLI.md)** - Complete CLI command reference
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

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture documentation
  - TypeScript → JavaScript build process
  - Directory structure explained
  - How scripts are compiled and distributed
  - Mermaid flow diagrams
  - Adding new scripts guide

- **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Quick testing reference
  - Running tests
  - Local package testing
  - Common commands

- **[TEST_SETUP.md](./TEST_SETUP.md)** - Comprehensive testing guide
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
