# Test Setup Documentation

This project uses Vitest for testing the CLI tool and library functions.

## Test Structure

```
test/
├── unit/                    # Unit tests for library functions
│   ├── init.test.ts        # Tests for lib/cli/init.ts
│   ├── create.test.ts      # Tests for lib/cli/create.ts
│   └── feature.test.ts     # Tests for lib/cli/feature.ts
├── integration/            # Integration tests
│   └── cli.test.ts         # CLI integration tests
└── fixtures/               # Test fixtures (currently empty)
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

Current coverage: **96.45%**

Coverage thresholds (configured in `vitest.config.ts`):
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

Coverage by file:
- `lib/cli/create.ts`: 100%
- `lib/cli/feature.ts`: 100%
- `lib/cli/init.ts`: 95.53%
- `bin/cli.ts`: Excluded from coverage (CLI entry point - glue code)

## Test Details

### Unit Tests

#### `lib/init.test.ts` (16 tests)
Tests for the `initTDD` function that initializes the TDD workflow:
- Package.json validation
- File copying operations
- Directory creation
- Package.json updates
- Error handling
- Console output

#### `lib/create.test.ts` (17 tests)
Tests for the `createComponent` function:
- Component creation with name and description
- Script execution
- Error handling
- Path handling with spaces
- Component name validation

#### `lib/feature.test.ts` (19 tests)
Tests for the `createFeature` function:
- Feature wizard execution
- Options handling
- Error handling
- Path handling

### Integration Tests

#### `test/integration/cli.test.ts` (28 tests)
Integration tests for the CLI:
- Package configuration verification
- TypeScript configuration
- Command exports
- Module structure

## Mocking Strategy

All tests use Vitest's mocking capabilities:

### File System Mocking
```typescript
vi.mock('fs');

// Mock implementation
vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
  const path = filePath.toString();
  if (path.includes('package.json') || path.includes('templates')) {
    return true;
  }
  return false;
});
```

### Child Process Mocking
```typescript
vi.mock('child_process');

// Mock implementation
vi.mocked(execSync).mockImplementation(() => Buffer.from(''));
```

## Configuration

### vitest.config.ts
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist',
        'templates',
        'node_modules',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/test/**',
        'bin/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

## Adding New Tests

### Unit Test Template

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { yourFunction } from '../../lib/your-module';

vi.mock('dependencies-to-mock');

describe('yourFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    const input = 'test';

    // Act
    const result = await yourFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Integration Test Template

```typescript
import { describe, it, expect } from 'vitest';

describe('Module Integration', () => {
  it('should export required functions', async () => {
    const module = await import('../../lib/your-module');

    expect(module.yourFunction).toBeDefined();
    expect(typeof module.yourFunction).toBe('function');
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on others
2. **Mocking**: Mock external dependencies (fs, child_process, etc.)
3. **Cleanup**: Use `beforeEach` and `afterEach` for setup/teardown
4. **Descriptive names**: Test names should clearly describe what they test
5. **Arrange-Act-Assert**: Follow the AAA pattern in tests
6. **Coverage**: Aim for >80% coverage on library code
7. **Fast**: Tests should run quickly (current suite: ~300ms)

## Continuous Integration

Tests run automatically on:
- Pre-commit (recommended)
- Pull requests
- Before publishing (via `prepublishOnly` script)

## Troubleshooting

### Tests failing locally
```bash
# Clear cache and re-run
rm -rf node_modules/.vitest
npm test
```

### Coverage not meeting threshold
```bash
# View detailed coverage report
npm run test:coverage
open coverage/index.html
```

### Mocks not working
Ensure mocks are defined before imports:
```typescript
// ✅ Correct
vi.mock('module');
import { function } from 'module';

// ❌ Wrong
import { function } from 'module';
vi.mock('module');
```

## Local Testing with a Vue Project

Before publishing to npm, test the package locally with a real Vue project to ensure everything works end-to-end.

### Method 1: Using npm link (Recommended for Development)

**Step 1: Build and link the package**
```bash
# In vue-tdd-automation directory
npm run build
npm link
```

**Step 2: Create or use a Vue test project**
```bash
# Create a new Vue project (or use an existing one)
npm create vue@latest my-test-project
cd my-test-project
npm install
```

**Step 3: Link the package to your test project**
```bash
# In your test Vue project directory
npm link @vue-tdd/automation
```

**Step 4: Test the CLI commands**
```bash
# Initialize TDD in the test project
npx vue-tdd init

# Create a test component
npx vue-tdd create TestButton "A test button component"

# Try the feature wizard
npx vue-tdd feature
```

**Step 5: Verify the setup**
```bash
# Check that files were created
ls -la scripts/
ls -la src/test/helpers/
ls -la .github/workflows/

# Run the generated tests
npm test
```

**Step 6: Make changes and rebuild**
```bash
# In vue-tdd-automation directory
# After making changes to the code
npm run build

# The linked package will automatically use the new build
# Test again in your Vue project
cd ../my-test-project
npx vue-tdd init --force
```

**Step 7: Cleanup when done**
```bash
# In your test Vue project
npm unlink @vue-tdd/automation
npm install

# In vue-tdd-automation directory
npm unlink
```

### Method 2: Using npm pack (Recommended for Pre-Release Testing)

This method simulates the actual npm install experience.

**Step 1: Build and pack the package**
```bash
# In vue-tdd-automation directory
npm run build
npm pack
```

This creates a tarball file like `vue-tdd-automation-0.1.0.tgz`

**Step 2: Install in a Vue test project**
```bash
# Create a new Vue project
npm create vue@latest my-test-project
cd my-test-project
npm install

# Install the local package
npm install -D /path/to/vue-tdd-automation/vue-tdd-automation-0.1.0.tgz
```

**Step 3: Test the CLI**
```bash
npx vue-tdd init
npx vue-tdd create TestButton
npm test
```

**Step 4: Test updates**
```bash
# In vue-tdd-automation directory
# Make changes, rebuild, and repack
npm run build
npm pack

# In test project, reinstall
npm uninstall @vue-tdd/automation
npm install -D /path/to/vue-tdd-automation/vue-tdd-automation-0.1.0.tgz
```

**Step 5: Cleanup**
```bash
# In vue-tdd-automation directory
rm *.tgz

# In test project
npm uninstall @vue-tdd/automation
```

### Method 3: Using a Test Script

Create a test script to automate the testing process:

**create-test-project.sh**
```bash
#!/bin/bash

# Build the package
echo "📦 Building package..."
npm run build

# Pack the package
echo "📦 Packing package..."
TARBALL=$(npm pack)

# Create test directory
echo "🏗️  Creating test project..."
TEST_DIR="../vue-tdd-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Create Vue project
npm create vue@latest test-app -- --typescript --vitest
cd test-app
npm install

# Install the local package
echo "📦 Installing local package..."
npm install -D "../../vue-tdd-automation/$TARBALL"

# Test initialization
echo "🧪 Testing vue-tdd init..."
npx vue-tdd init

# Check files were created
echo "✅ Verifying files..."
if [ -f "vitest.config.ts" ]; then
  echo "  ✓ vitest.config.ts created"
fi

if [ -d "scripts" ]; then
  echo "  ✓ scripts directory created"
fi

if [ -d "src/test/helpers" ]; then
  echo "  ✓ test helpers created"
fi

echo "🎉 Test project ready at: $TEST_DIR/test-app"
echo "To test manually, run:"
echo "  cd $TEST_DIR/test-app"
echo "  npx vue-tdd create MyButton"
echo "  npm test"
```

Make it executable and run:
```bash
chmod +x create-test-project.sh
./create-test-project.sh
```

### Common Testing Scenarios

**Test 1: Fresh installation**
```bash
npx vue-tdd init
# Should create all files without errors
```

**Test 2: Existing files (no force)**
```bash
npx vue-tdd init
npx vue-tdd init  # Run again
# Should skip existing files
```

**Test 3: Force overwrite**
```bash
npx vue-tdd init --force
# Should overwrite existing files
```

**Test 4: Create component**
```bash
npx vue-tdd create UserProfile "Displays user information"
# Should create UserProfile.vue and UserProfile.test.ts
npm test  # Should run tests
```

**Test 5: GitHub workflows**
```bash
npx vue-tdd init --workflows
ls .github/workflows/
# Should see auto-tdd-setup.yml and tdd.yml
```

**Test 6: No workflows**
```bash
npx vue-tdd init --no-workflows
ls .github/workflows/
# Should not exist or be empty
```

### Verification Checklist

After testing locally, verify:

- [ ] `npx vue-tdd init` completes without errors
- [ ] All required files are created in correct locations
- [ ] `vitest.config.ts` is valid and parseable
- [ ] Test helpers are importable
- [ ] Scripts are executable
- [ ] `npx vue-tdd create` generates valid component and test files
- [ ] Generated tests run successfully
- [ ] Package.json scripts are added correctly
- [ ] TypeScript compilation works
- [ ] No peer dependency warnings
- [ ] CLI commands show proper help text
- [ ] Error messages are clear and helpful

### Troubleshooting Local Testing

**Issue: "Cannot find module '@vue-tdd/automation'"**
```bash
# Solution: Rebuild and relink
cd vue-tdd-automation
npm run build
npm link

cd ../test-project
npm link @vue-tdd/automation
```

**Issue: Changes not reflected after rebuild**
```bash
# Solution: Clear Node's module cache
rm -rf node_modules/.cache
npm run build
```

**Issue: Permission errors on CLI**
```bash
# Solution: Check bin file has proper shebang
head -n1 dist/bin/cli.js
# Should see: #!/usr/bin/env node
```

**Issue: Template files not found**
```bash
# Solution: Verify templates are included in package
npm pack --dry-run
# Should list templates directory
```

### Pre-Publishing Checklist

Before publishing to npm:

1. Run all unit tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Build successfully: `npm run build`
4. Test with `npm link` in a Vue 3 project
5. Test with `npm pack` installation
6. Verify all CLI commands work
7. Check TypeScript types are generated
8. Verify package.json `files` field includes all needed files
9. Test on clean project (no existing TDD setup)
10. Test upgrade scenario (with existing files)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Coverage Documentation](https://vitest.dev/guide/coverage.html)
- [npm link Documentation](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [npm pack Documentation](https://docs.npmjs.com/cli/v9/commands/npm-pack)
