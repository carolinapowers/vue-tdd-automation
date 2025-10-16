# Development Scripts

This directory contains scripts for testing and developing the vue-tdd-automation package.

## Scripts

### `create-test-project.sh`

Creates a complete test project from scratch to verify the package works end-to-end.

**Usage:**
```bash
./scripts/dev/create-test-project.sh
```

**What it does:**
1. Builds the package
2. Creates a tarball
3. Creates a new Vue project
4. Installs the local tarball
5. Tests `npx vue-tdd init`
6. Tests `npx vue-tdd create TestButton`
7. Runs tests
8. Provides cleanup instructions

**Output:**
- Creates a test project in `../vue-tdd-test-<timestamp>/test-app`
- Verifies all files are created correctly
- Tests pass (with expected failures in scaffolded tests)

---

### `install-from-branch.sh`

Installs the package from a GitHub branch into an existing Vue project for testing.

**Usage:**
```bash
# Direct script usage (target directory required)
./scripts/dev/install-from-branch.sh <target-dir> [branch-name]

# Using npm script (from vue-tdd-automation directory)
npm run dev:install -- <target-dir> [branch-name]
```

**Examples:**
```bash
# Direct script - Install from main to test app (branch defaults to main)
./scripts/dev/install-from-branch.sh ~/Repos/vue-tdd-test-app

# Direct script - Install from specific branch to test app
./scripts/dev/install-from-branch.sh ~/Repos/vue-tdd-test-app refactor/directories-reorganization

# npm script - Install to test app from main branch
npm run dev:install -- ~/Repos/vue-tdd-test-1760636798/test-app

# npm script - Install to test app from specific branch
npm run dev:install -- ~/Repos/vue-tdd-test-1760636798/test-app feature/streamline-install-script
```

**What it does:**
1. Uninstalls existing `@carolinappowers/vue-tdd-automation` package (if present)
2. Installs package from specified GitHub branch
3. Verifies the package built correctly (checks for `dist/` directory)
4. Shows installed version and branch
5. Optionally runs `npx vue-tdd init --force` to update templates

**Requirements:**
- Must be run from a directory containing `package.json`
- Requires internet connection to fetch from GitHub
- Requires git and npm to be installed

**Example Workflows:**

**Using npm script (recommended)**
```bash
# From vue-tdd-automation directory
npm run dev:install -- ~/Repos/vue-tdd-test-1760636798/test-app refactor/directories-reorganization

# Answer 'y' to update templates when prompted
# y

# Test the CLI in the test app
cd ~/Repos/vue-tdd-test-1760636798/test-app
npx vue-tdd create MyComponent
npm test
```

**Using direct script**
```bash
# From any directory
~/vue-tdd-automation/scripts/dev/install-from-branch.sh ~/my-vue-project refactor/directories-reorganization

# Answer 'y' to update templates
# y

# Test the CLI
cd ~/my-vue-project
npx vue-tdd create MyComponent
npm test
```

**Tip:** You can create an alias for easier access:
```bash
# Add to your ~/.zshrc or ~/.bashrc
alias vue-tdd-install='~/Repos/vue-tdd-automation/scripts/dev/install-from-branch.sh'

# Then use it from any Vue project:
cd ~/my-vue-project
vue-tdd-install refactor/directories-reorganization
```

## Copying the Script to Test Projects

If you want to include this script directly in your test projects, copy it:

```bash
# From your test project
mkdir -p scripts
cp /path/to/vue-tdd-automation/scripts/dev/install-from-branch.sh scripts/
chmod +x scripts/install-from-branch.sh

# Then use it
./scripts/install-from-branch.sh refactor/directories-reorganization
```

Add to `.gitignore`:
```
# Local testing script
scripts/install-from-branch.sh
```

## Testing GitHub Actions Workflows

To test the full GitHub Actions workflow (issue → branch → PR):

1. **Install from branch in your test repo:**
   ```bash
   cd ~/Repos/vue-tdd-test
   ~/vue-tdd-automation/scripts/dev/install-from-branch.sh refactor/directories-reorganization
   ```

2. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "chore: update vue-tdd-automation to test refactor branch"
   git push
   ```

3. **Create a feature request issue** on GitHub with:
   - Title: `[FEATURE] ComponentName - Description`
   - Label: `feature-request` (critical!)
   - Body: Use the template in `.github/ISSUE_TEMPLATE/feature_request.md`

4. **Watch the workflow run:**
   - Go to Actions tab on GitHub
   - The `Auto TDD Setup` workflow should trigger
   - It will create a branch, generate files, and open a PR

## Troubleshooting

### Script shows "package.json not found"
- Make sure you're running the script from your project root directory
- The directory must contain a `package.json` file

### Installation fails with "Repository not found"
- Check your internet connection
- Verify the branch name is correct
- Make sure the repository is accessible (public or you have access)

### dist/ directory not found after installation
- The package may have failed to build during installation
- Check if there were any build errors in the npm install output
- The `prepare` script in package.json should run `npm run build`

### Templates not updating
- Make sure you answer 'y' when prompted to run init --force
- Or manually run: `npx vue-tdd init --force`
- Check that workflow files in `.github/workflows/` were updated

## See Also

- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - Package architecture
- [TESTING_QUICK_START.md](../../docs/TESTING_QUICK_START.md) - Quick testing guide
- [REFACTOR_SESSION_NOTES.md](../../REFACTOR_SESSION_NOTES.md) - Recent refactoring notes
