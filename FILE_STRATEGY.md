# File Installation Strategy

This document explains which files are installed by `vue-tdd init` and why.

## File Categories

### 1. Core Files (Always Installed)

These files are essential for TDD workflow and are always copied:

```
src/test/
├── setup.ts                      # Vitest global setup
└── helpers/
    ├── index.ts                  # Barrel file for all helpers
    ├── testing-library.ts        # Testing Library utilities
    ├── vue-testing.ts            # Vue Test Utils helpers
    └── composables-testing.ts    # Composable testing utilities
```

**Why always installed:**
- Required for test helpers to work
- Safe to install (in src/test directory, won't conflict)
- Can be customized after installation

### 2. Vitest Config (Special Handling)

```
vitest.config.ts
```

**Installation behavior:**
- **If doesn't exist:** Copied automatically
- **If exists:**
  - Shows warning message
  - Provides path to template for manual merge
  - Skips installation (unless --force used)

**Why special handling:**
- Most likely to conflict with existing setup
- May have project-specific customizations
- User should manually merge TDD settings

**To merge manually:**
1. See template at `node_modules/@vue-tdd/automation/templates/vitest.config.ts`
2. Copy relevant sections (test helpers, coverage thresholds, etc.)
3. Integrate into your existing config

### 3. Component Creation Scripts (Optional)

```
scripts/
├── tdd-feature.js             # Interactive feature wizard
└── create-tdd-component.js    # Component generator
```

**Installation:** Default ON, use `--no-scripts` to skip

**Why optional:**
- Not everyone uses component generators
- Some teams have their own scaffolding tools
- Adds scripts/ directory to project root

**Usage:**
```bash
npm run tdd:feature          # Interactive wizard
npm run create:component     # Component creator
npx vue-tdd create MyButton  # CLI command
```

### 4. GitHub Workflows (Optional)

```
.github/
├── workflows/
│   ├── auto-tdd-setup.yml      # Auto-setup from issues
│   └── tdd.yml                  # Test runner workflow
└── ISSUE_TEMPLATE/
    └── feature_request.md       # Feature request template
```

**Installation:** Default ON, use `--no-workflows` to skip

**Why optional:**
- Not all projects use GitHub
- Some teams have existing CI/CD
- May prefer other automation tools

**What they do:**
- `auto-tdd-setup.yml`: Creates branch + tests from issues
- `tdd.yml`: Runs tests on PR/push
- `feature_request.md`: Structured feature requests

### 5. Documentation (Optional)

```
TDD_WORKFLOW.md              # Complete TDD guide
TESTING_COMPARISON.md        # Testing library comparison
VUE_TESTING_ALIGNMENT.md     # Vue.js standards
```

**Installation:** Default ON, use `--no-docs` to skip

**Why optional:**
- Some teams have their own docs
- May clutter project root
- Content available in package

## Installation Options

### Minimal Installation (Core only)

```bash
npx vue-tdd init --no-scripts --no-workflows --no-docs
```

Installs only:
- `src/test/` helpers
- `vitest.config.ts` (if doesn't exist)

### Recommended Installation (Default)

```bash
npx vue-tdd init
```

Installs:
- Core test files
- Component creation scripts
- GitHub workflows
- Documentation

### Custom Installation

```bash
# Tests + Scripts, no workflows or docs
npx vue-tdd init --no-workflows --no-docs

# Tests + Workflows, no scripts or docs
npx vue-tdd init --no-scripts --no-docs

# Tests + Docs only
npx vue-tdd init --no-scripts --no-workflows
```

## Package.json Scripts

These scripts are always added (if they don't exist):

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

**Note:** `create:component` and `tdd:feature` are only useful if scripts are installed.

## Handling Existing Files

### Default Behavior (No --force)

1. **File exists:** Skip with message `⏭️  Skipped (exists): filename`
2. **File doesn't exist:** Copy with message `✅ Copied: filename`

### With --force Flag

```bash
npx vue-tdd init --force
```

- Overwrites ALL files, even if they exist
- **Use with caution** - will lose local modifications

### Best Practice for Updates

If you've customized files and want to update:

1. **Don't use --force** - You'll lose customizations
2. **Instead:**
   ```bash
   # Temporarily rename your custom file
   mv vitest.config.ts vitest.config.custom.ts

   # Run init to get new version
   npx vue-tdd init

   # Manually merge changes
   code vitest.config.ts vitest.config.custom.ts
   ```

## What Gets Committed to Git

All installed files should be committed to your repository:

```bash
git add src/test/
git add scripts/
git add .github/
git add vitest.config.ts
git add *.md
git commit -m "Add TDD infrastructure"
```

These files become part of your project and can be customized as needed.

## Dependencies

After installation, install required npm packages:

```bash
npm install -D @testing-library/jest-dom \
               @testing-library/user-event \
               @testing-library/vue \
               @types/node \
               @vitejs/plugin-vue \
               @vue/test-utils \
               @vitest/ui \
               happy-dom \
               vitest
```

These are peer dependencies - not installed automatically to avoid version conflicts.

## Summary

| File/Directory | Category | Default | Skip Option | Safe to Customize |
|---|---|---|---|---|
| `src/test/` | Core | ✅ Always | ❌ None | ✅ Yes |
| `vitest.config.ts` | Config | ⚠️ If not exists | Use existing | ✅ Yes |
| `scripts/` | Optional | ✅ Yes | `--no-scripts` | ✅ Yes |
| `.github/` | Optional | ✅ Yes | `--no-workflows` | ✅ Yes |
| `*.md` docs | Optional | ✅ Yes | `--no-docs` | ✅ Yes |

**Recommendation:** Start with default installation, then customize files as needed for your project.
