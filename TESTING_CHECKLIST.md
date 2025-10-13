# Vue TDD Automation - Testing Checklist

This document outlines the complete testing workflow for verifying new versions of the `@vue-tdd/automation` package.

## Prerequisites

- Node.js >= 18.0.0
- npm
- Git
- GitHub CLI (`gh`) installed and authenticated
- A test Vue 3 project (e.g., `gnow`)

## Test Environment Setup

### 1. Build and Package

```bash
cd /Users/carolinapowers/Repos/vue-tdd-automation
npm run build
npm pack
```

**Expected Output:**
- `vue-tdd-automation-X.X.X.tgz` file created
- Build completes with no TypeScript errors
- Post-build script copies templates successfully

### 2. Install in Test Project

```bash
cd /path/to/test-project
npm uninstall @vue-tdd/automation
npm install -D /Users/carolinapowers/Repos/vue-tdd-automation/vue-tdd-automation-X.X.X.tgz
```

**Verification:**
- Package appears in `package.json` devDependencies
- No installation errors

## Core Functionality Tests

### Test 1: Initialize TDD Infrastructure

```bash
npx vue-tdd init --force
```

**Expected Results:**
- ✅ 14 files copied to project:
  - `src/test/setup.ts`
  - `src/test/helpers/*.ts` (4 files)
  - `vitest.config.ts`
  - `scripts/tdd-feature.js`
  - `scripts/create-tdd-component.js`
  - `.github/workflows/auto-tdd-setup.yml`
  - `.github/workflows/tdd.yml`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `TDD_WORKFLOW.md`
  - `TESTING_COMPARISON.md`
  - `VUE_TESTING_ALIGNMENT.md`

**Verification Checklist:**
- [ ] All files created in correct locations
- [ ] No permission errors
- [ ] Scripts are executable
- [ ] Package.json updated with test scripts

### Test 2: Create Component with CLI

```bash
npx vue-tdd create TestComponent "Test component creation"
```

**Expected Results:**
- ✅ Creates `src/components/TestComponent.vue`
- ✅ Creates `src/components/TestComponent.test.ts`
- ✅ Component has commented-out imports (no unused variables)
- ✅ Test file has commented-out `vi` import

**Verification Checklist:**
- [ ] Component file exists with minimal scaffold
- [ ] Test file exists with TDD structure
- [ ] Component has `data-testid="testcomponent-container"`
- [ ] All Vue imports are commented out
- [ ] Props and emits are commented out
- [ ] Test imports only essential dependencies

**Code Quality Check:**

```bash
npm run build
```

- [ ] Zero TypeScript errors
- [ ] No unused variable warnings
- [ ] Build completes successfully

**Test Execution Check:**

```bash
npm test -- TestComponent --run
```

- [ ] 1 test passes (renders component)
- [ ] 6 tests fail (expected TDD RED phase)
- [ ] No runtime errors

### Test 3: Feature Wizard (Interactive)

```bash
npx vue-tdd feature
```

**Expected Results:**
- ✅ Interactive wizard launches without errors
- ✅ Prompts for component details
- ✅ No module import errors

**Verification Checklist:**
- [ ] Wizard displays prompts correctly
- [ ] No `ERR_MODULE_NOT_FOUND` errors
- [ ] test-generator module imports successfully from package
- [ ] Can exit wizard cleanly (Ctrl+C)

**Note:** Full interactive test requires manual input or automation script.

### Test 4: GitHub Actions Automation

#### 4.1 Create Test Issue

```bash
gh issue create \
  --title "[FEATURE] TestCard - Display test information" \
  --label "feature-request" \
  --body "## User Story
As a developer, I want to test the automation so that I can verify it works

## Acceptance Criteria
- [ ] Card displays test data
- [ ] Component renders correctly

## Component Details
**Component Name**: TestCard
**Props**: testId: string
**Events**: @click
**State Management**: local state

## Test Scenarios
### Happy Path
- [ ] Renders with valid data

### Edge Cases
- [ ] Handles missing data

### Error Cases
- [ ] Shows error state

## UI/UX Requirements
- Desktop view: Standard card layout
- Mobile view: Responsive
- Accessibility: WCAG 2.1 AA compliance"
```

#### 4.2 Monitor Workflow

```bash
gh run list --limit 3
gh run view <run-id>
```

**Expected Results:**
- ✅ Workflow triggers automatically
- ✅ Creates branch `feature/<issue-number>-<ComponentName>`
- ✅ Generates component and test files
- ✅ Commits changes
- ✅ Pushes branch to remote
- ✅ Comments on issue with instructions

**Verification Checklist:**
- [ ] Workflow completes successfully
- [ ] Branch created in repository
- [ ] Component file committed
- [ ] Test file committed with issue requirements
- [ ] Bot comment posted to issue
- [ ] Comment includes branch name and next steps

#### 4.3 Verify Generated Files

```bash
gh issue view <issue-number> --comments
```

- [ ] Bot comment is formatted correctly
- [ ] Branch name matches pattern
- [ ] Instructions are clear

## Integration Tests

### Test 5: CI/CD Pipeline

After making changes, verify CI runs correctly:

```bash
git add .
git commit -m "test: verify CI pipeline"
git push
```

**Check GitHub Actions:**

```bash
gh run watch
```

**Expected Results:**
- ✅ `TDD Workflow` runs successfully
- ✅ Linting passes
- ✅ Type checking passes (`npx vue-tsc --noEmit`)
- ✅ Tests run (if test files exist)
- ✅ Coverage report generated

**Verification Checklist:**
- [ ] All jobs complete successfully
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Tests pass or are detected as non-existent
- [ ] Artifacts uploaded (coverage report)

## Package Quality Checks

### Test 6: Package Structure

```bash
cd /Users/carolinapowers/Repos/vue-tdd-automation
npm pack --dry-run
```

**Verification Checklist:**
- [ ] `dist/bin/` included
- [ ] `dist/lib/` included
- [ ] `dist/templates/` included
- [ ] `dist/lib/test-generator/` included
- [ ] All `.d.ts` type definition files included
- [ ] README.md and LICENSE included
- [ ] Total file count matches expected (~40 files)

### Test 7: Export Verification

Create a test file in test project:

```bash
cat > test-exports.js << 'EOF'
import { generateTestContent } from '@vue-tdd/automation/test-generator';
console.log('✅ test-generator import works');
console.log('✅ generateTestContent:', typeof generateTestContent);
EOF

node test-exports.js
rm test-exports.js
```

**Expected Output:**
```
✅ test-generator import works
✅ generateTestContent: function
```

**Verification Checklist:**
- [ ] No module resolution errors
- [ ] Named exports work correctly
- [ ] Type definitions available

## Template Quality Checks

### Test 8: Component Template Quality

Verify generated component has clean code:

```bash
npx vue-tdd create CleanCheck "Quality check component"
```

**Inspect:** `src/components/CleanCheck.vue`

**Verification Checklist:**
- [ ] No actual `import` statements (all commented)
- [ ] No `defineProps()` call (commented)
- [ ] No `defineEmits()` call (commented)
- [ ] Clear TODO comments for guidance
- [ ] Proper `data-testid` attribute
- [ ] Minimal scaffold structure

**Inspect:** `src/components/CleanCheck.test.ts`

**Verification Checklist:**
- [ ] Essential imports only (`describe`, `it`, `expect`, `beforeEach`)
- [ ] `vi` import commented out with helpful note
- [ ] Proper test structure (6 describe blocks)
- [ ] First test passes (component renders)
- [ ] Other tests fail with `expect(true).toBe(false)`
- [ ] Clear TODO comments in each test

### Test 9: Script Template Quality

**Inspect:** `scripts/create-tdd-component.js`

**Verification Checklist:**
- [ ] Has shebang (`#!/usr/bin/env node`)
- [ ] File is executable
- [ ] Uses updated component template
- [ ] Uses updated test template
- [ ] No syntax errors

**Inspect:** `scripts/tdd-feature.js`

**Verification Checklist:**
- [ ] Has shebang (`#!/usr/bin/env node`)
- [ ] File is executable
- [ ] Imports from `@vue-tdd/automation/test-generator` (not relative path)
- [ ] No module resolution errors when run

## Regression Tests

### Test 10: Backward Compatibility

Run tests on previous version's generated files (if any exist):

```bash
npm test -- --run
```

**Verification Checklist:**
- [ ] Existing tests still run
- [ ] No breaking changes in test helpers
- [ ] Vitest config still compatible

## Documentation Checks

### Test 11: Generated Documentation

**Verify files exist and are readable:**
- [ ] `TDD_WORKFLOW.md` - Clear workflow instructions
- [ ] `TESTING_COMPARISON.md` - Comparison of testing approaches
- [ ] `VUE_TESTING_ALIGNMENT.md` - Vue.js testing alignment
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md` - Proper template format

**Spot Check Content:**
- [ ] Markdown renders correctly
- [ ] Code examples are valid
- [ ] Links work (if any)
- [ ] No placeholder text

## Performance Checks

### Test 12: Build Performance

```bash
cd /Users/carolinapowers/Repos/vue-tdd-automation
time npm run build
```

**Expected:**
- Build completes in < 10 seconds
- No warnings

### Test 13: Installation Performance

```bash
cd /path/to/test-project
time npm install -D ../vue-tdd-automation/vue-tdd-automation-X.X.X.tgz
```

**Expected:**
- Installation completes in < 30 seconds
- No peer dependency warnings

## Clean-up After Testing

```bash
# Remove test components
rm -f src/components/TestComponent.vue
rm -f src/components/TestComponent.test.ts
rm -f src/components/CleanCheck.vue
rm -f src/components/CleanCheck.test.ts
rm -f src/components/CleanComponent.vue
rm -f src/components/CleanComponent.test.ts

# Close test GitHub issue
gh issue close <issue-number> --comment "Testing complete"

# Delete test branch
git push origin --delete feature/<issue-number>-TestCard
```

## Success Criteria Summary

All tests must pass:
- ✅ Package builds without errors
- ✅ CLI commands work (`init`, `create`, `feature`)
- ✅ Generated code has zero TypeScript warnings
- ✅ Templates use commented-out code (no unused variables)
- ✅ Tests run correctly (1 pass, 6 fail initially)
- ✅ GitHub Actions automation works end-to-end
- ✅ Module exports resolve correctly
- ✅ CI/CD pipeline passes
- ✅ Documentation is complete and accurate

## Common Issues and Solutions

### Issue: Module not found error in `tdd-feature.js`

**Symptom:** `Cannot find module '../test-generator/index.js'`

**Solution:** Verify post-build script replaced relative imports with package imports:
```bash
grep "@vue-tdd/automation/test-generator" dist/templates/scripts/tdd-feature.js
```

### Issue: Unused variable warnings

**Symptom:** TypeScript warns about unused `ref`, `computed`, `props`, `emit`, `vi`

**Solution:** Verify templates use commented-out code:
```bash
grep -A 2 "// Uncomment imports" scripts/create-tdd-component.js
grep "// import { vi }" scripts/create-tdd-component.js
```

### Issue: GitHub Actions workflow doesn't trigger

**Symptom:** No workflow run after creating issue

**Solution:**
1. Verify issue has `feature-request` label
2. Check workflow file exists: `.github/workflows/auto-tdd-setup.yml`
3. Verify workflow permissions are correct

### Issue: Tests don't run

**Symptom:** `npm test` fails or finds no tests

**Solution:**
1. Verify `vitest.config.ts` exists
2. Check test dependencies are installed
3. Ensure test files match pattern `*.test.ts` or `*.spec.ts`

## Version-Specific Notes

### Version 0.1.0
- Initial release
- Fixed template unused variable warnings
- Fixed `tdd-feature.js` module import error
- Added package exports for test-generator

## Automation Script

For automated testing, use this script:

```bash
#!/bin/bash
# test-vue-tdd-package.sh

set -e

echo "🧪 Testing @vue-tdd/automation package..."

# Build and pack
cd ~/Repos/vue-tdd-automation
npm run build
TARBALL=$(npm pack)

# Install in test project
cd ~/Repos/gnow
npm uninstall @vue-tdd/automation
npm install -D ~/Repos/vue-tdd-automation/$TARBALL

# Run tests
npx vue-tdd init --force
npx vue-tdd create TestComponent "Automated test"

# Verify TypeScript
npm run build

# Verify tests
npm test -- TestComponent --run

# Clean up
rm -f src/components/TestComponent.vue src/components/TestComponent.test.ts

echo "✅ All tests passed!"
```

## Related Documentation

- [README.md](./README.md) - Package overview and installation
- [TDD_WORKFLOW.md](./templates/docs/TDD_WORKFLOW.md) - TDD workflow guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines (if exists)

---

**Last Updated:** 2025-10-12
**Tested Version:** 0.1.0
**Maintainer:** Carolina Powers
