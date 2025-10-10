# Test-Driven Development (TDD) Workflow

This repository follows Vue.js official testing recommendations for Test-Driven Development with Vue 3, TypeScript, and Vitest.

## 📚 Vue.js Testing Philosophy

Following [Vue.js testing guide](https://vuejs.org/guide/scaling-up/testing) with Testing Library enhancements:

### Core Principles
- **Test behavior, not implementation** - Focus on inputs (props, user interactions) and outputs (rendered DOM, emitted events)
- **Use semantic queries first** - Testing Library's approach: getByRole, getByLabelText, getByText
- **Use data-test attributes as escape hatch** - When semantic queries aren't practical
- **Prioritize accessibility** - Tests should reinforce accessible patterns
- **Use Vitest** - Recommended by Vue team for Vite-based applications

### Testing Approach: Best of Both Worlds

We use both **Vue Test Utils** (Vue's official library) and **Testing Library** for complementary benefits:

#### Vue Test Utils
- Direct access to Vue component internals when needed
- Better support for Vue-specific features (Suspense, Teleport)
- Official Vue team support

#### Testing Library
- User-centric testing philosophy
- Built-in accessibility assertions
- Familiar API for developers coming from React
- Better simulates real user interactions

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests in Watch Mode (TDD)
```bash
npm run tdd
```

### Run Tests Once
```bash
npm run test
```

### View Test Coverage
```bash
npm run test:coverage
```

### Run Test UI
```bash
npm run test:ui
```

## 📋 TDD Workflow Process

### 1. Create a GitHub Issue
Use the template in `.github/ISSUE_TEMPLATE/feature_request.md` to create structured requirements.

### 2. Create a Feature Branch
```bash
git checkout -b feature/#issue-number-component-name
```

### 3. Write Tests First (RED Phase)
Create your test file before implementation:
```bash
touch src/components/ComponentName.test.ts
```

Use GitHub Copilot with comments to generate tests from requirements:
```typescript
/**
 * GitHub Issue #XX: Component Name
 * 
 * User Story: As a [user], I want [feature] so that [benefit]
 * 
 * Acceptance Criteria:
 * - Given [context], when [action], then [result]
 * 
 * Generate comprehensive tests for these requirements
 */
```

### 4. Run Tests (Verify RED)
```bash
npm run tdd
```
All tests should fail initially - this is expected!

### 5. Implement Component (GREEN Phase)
Create the minimal implementation to pass tests:
```bash
touch src/components/ComponentName.vue
```

Use Copilot to help generate implementation that satisfies tests.

### 6. Refactor (REFACTOR Phase)
Once tests pass, refactor for:
- Better code organization
- Performance improvements
- Cleaner patterns

Tests should remain green during refactoring.

### 7. Commit Following TDD Convention
```bash
# Commit tests first
git add src/components/ComponentName.test.ts
git commit -m "test: add tests for ComponentName #issue-number"

# Then commit implementation
git add src/components/ComponentName.vue
git commit -m "feat: implement ComponentName to pass tests #issue-number"
```

### 8. Push and Create PR
```bash
git push origin feature/#issue-number-component-name
```

GitHub Actions will automatically:
- Run all tests
- Check coverage thresholds (80%)
- Comment PR with coverage report
- Verify tests were written before implementation

## 🧪 Example TDD Implementation

See the `TeeTimeFilter` component for a complete TDD example:

1. **Test File**: `src/components/TeeTimeFilter.test.ts`
   - 30+ test cases covering all requirements
   - Tests for functionality, accessibility, edge cases
   - Performance tests (debouncing)

2. **Implementation**: `src/components/TeeTimeFilter.vue`
   - Built to satisfy all test requirements
   - Includes accessibility features
   - Follows Vue 3 best practices

3. **Demo Page**: `src/views/TeeTimeFilterDemo.vue`
   - Shows the component in action
   - Demonstrates all features

## 🎯 Testing Best Practices

### Use Data Test IDs
```vue
<button data-testid="btn-submit">Submit</button>
```

### Test User Behavior, Not Implementation
```typescript
// ❌ Bad: Testing implementation details
expect(wrapper.vm.internalState).toBe(true)

// ✅ Good: Testing user-visible behavior
expect(wrapper.find('[data-testid="message"]').text()).toBe('Success!')
```

### Mock External Dependencies
```typescript
vi.mock('@/api/service', () => ({
  fetchData: vi.fn().mockResolvedValue(mockData)
}))
```

### Test Accessibility
```typescript
expect(wrapper.find('input').attributes('aria-label')).toBe('Search input')
```

## 📊 Coverage Requirements

Minimum thresholds configured in `vitest.config.ts`:
- Lines: 80%
- Statements: 80%
- Functions: 80%
- Branches: 80%

## 🤖 GitHub Copilot Tips

### For Test Generation
1. Include the GitHub issue description as a comment
2. Be specific about test scenarios
3. Use patterns like "Generate tests for [specific behavior]"

### For Implementation
1. Reference the test file: "Must satisfy tests in ComponentName.test.ts"
2. Ask for specific patterns: "Use Vue 3 Composition API with TypeScript"
3. Request accessibility: "Include ARIA labels for all interactive elements"

## 🔄 Continuous Integration

GitHub Actions workflow (`.github/workflows/tdd.yml`) ensures:
- Tests run on every PR
- Coverage thresholds are met
- Test files exist for feature branches
- Coverage report is posted as PR comment

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)
- [TDD Best Practices](https://kentcdodds.com/blog/write-tests)

## 🏃 Running the Demo

To see the TDD implementation in action:

```bash
# Start the dev server
npm run dev

# Navigate to the demo page (add route in your router)
# Or import TeeTimeFilterDemo component in your App.vue
```

## 💡 Pro Tips

1. **Write one test at a time** - Don't write all tests upfront
2. **Keep tests simple** - Each test should verify one behavior
3. **Use descriptive test names** - Should read like documentation
4. **Refactor regularly** - Keep both tests and code clean
5. **Mock time-based operations** - Use `vi.useFakeTimers()` for consistent tests
6. **Test edge cases** - Empty states, errors, boundary conditions
7. **Maintain test independence** - Each test should run in isolation

## 📁 Test Organization

Following Vue's recommendations, tests live alongside their source files:

```
src/
├── components/
│   ├── TeeTimeFilter.vue
│   ├── TeeTimeFilter.test.ts    # Component test
│   ├── UserProfile.vue
│   └── UserProfile.test.ts
├── composables/
│   ├── useCounter.ts
│   └── useCounter.test.ts       # Composable test
└── views/
    ├── HomeView.vue
    └── HomeView.test.ts         # View test
```

This approach:
- **Keeps tests close to source** - Easy to find and maintain
- **Encourages testing** - Visible reminder when components lack tests
- **Simplifies imports** - No complex relative paths
- **Supports refactoring** - Move component and test together

---

Remember: **Red → Green → Refactor** 🔴🟢🔄

The goal is not just to write tests, but to let tests drive better design decisions!
