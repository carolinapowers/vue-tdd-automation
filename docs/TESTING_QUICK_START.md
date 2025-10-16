# Testing Quick Start Guide

Quick reference for testing the `@vue-tdd/automation` package locally.

## Unit Tests

```bash
# Run all tests
npm test

# Watch mode (recommended during development)
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

## Local Package Testing (Quick)

### Using npm link

```bash
# 1. Build and link
npm run build
npm link

# 2. In your Vue test project
cd /path/to/your/vue-project
npm link @vue-tdd/automation

# 3. Test it
npx vue-tdd init
npx vue-tdd create MyButton

# 4. Cleanup
npm unlink @vue-tdd/automation
```

### Using npm pack

```bash
# 1. Build and pack
npm run build
npm pack

# 2. Install in test project
cd /path/to/your/vue-project
npm install -D /path/to/vue-tdd-automation/vue-tdd-automation-0.1.0.tgz

# 3. Test it
npx vue-tdd init

# 4. Cleanup
rm *.tgz
```

### Using the Test Script (Easiest)

```bash
# Automatically creates test project and runs tests
./create-test-project.sh
```

This script will:
- Build and pack the package
- Create a new Vue project
- Install the local package
- Run `vue-tdd init`
- Verify all files are created
- Test component creation
- Show you where the test project is

## Testing Checklist

Quick checklist before publishing:

```bash
# 1. Tests pass
npm test

# 2. Coverage meets threshold
npm run test:coverage  # Should be >80%

# 3. Build succeeds
npm run build

# 4. TypeScript compiles
ls dist/  # Should see .js and .d.ts files

# 5. Package contents correct
npm pack --dry-run  # Check listed files

# 6. Local testing
./create-test-project.sh  # Full integration test
```

## Common Test Commands

```bash
# Run specific test file
npx vitest test/unit/init.test.ts

# Run tests matching pattern
npx vitest -t "should copy"

# Debug a test
npx vitest --inspect-brk test/unit/init.test.ts

# Update snapshots (if using)
npx vitest -u

# Clear cache
rm -rf node_modules/.vitest && npm test
```

## Quick Troubleshooting

**Tests failing?**
```bash
npm test -- --reporter=verbose
```

**Coverage too low?**
```bash
npm run test:coverage
open coverage/index.html
```

**Link not working?**
```bash
npm run build && npm link
cd /path/to/test-project && npm link @vue-tdd/automation
```

**Changes not reflected?**
```bash
npm run build  # Rebuild after changes
```

## File Locations

- **Tests**: `test/unit/*.test.ts` and `test/integration/*.test.ts`
- **Config**: `vitest.config.ts`
- **Coverage**: `coverage/` (generated)
- **Built files**: `dist/` (generated)
- **Documentation**: `TEST_SETUP.md` (comprehensive guide)

## More Information

For detailed testing documentation, see [TEST_SETUP.md](./TEST_SETUP.md)
