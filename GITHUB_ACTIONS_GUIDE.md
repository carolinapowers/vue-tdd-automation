# GitHub Actions Setup Guide for NPM Package

## Why GitHub Actions for NPM Packages?

GitHub Actions provide essential automation for maintaining a high-quality npm package:

1. **Continuous Integration (CI)** - Test on every commit/PR
2. **Multi-environment Testing** - Test across Node versions and OS
3. **Automated Publishing** - Secure, consistent releases
4. **Security Scanning** - Detect vulnerabilities early
5. **Dependency Management** - Auto-update dependencies
6. **Code Quality** - Enforce standards before merge

## ✅ Workflows Created

### 1. `ci.yml` - Continuous Integration
**Triggers:** Push to main, Pull Requests

**What it does:**
- Tests on Node 18, 20, 22
- Tests on Ubuntu, Windows, macOS
- Runs coverage reporting
- Performs TypeScript build
- Security audit
- Verifies package can be built

**Why it's important:** Catches bugs before they reach users, ensures package works across environments.

### 2. `publish.yml` - NPM Publishing
**Triggers:** GitHub Releases, Manual workflow dispatch

**What it does:**
- Runs tests before publishing
- Builds the package
- Publishes to npm with provenance
- Supports latest/beta/alpha tags
- Creates release summary

**Why it's important:** Automates publishing with proper security (provenance), prevents publishing broken code.

### 3. `codeql.yml` - Security Analysis
**Triggers:** Push, PR, Weekly schedule

**What it does:**
- Scans code for security vulnerabilities
- Checks for common coding errors
- Creates security alerts

**Why it's important:** Proactive security monitoring, protects users from vulnerabilities.

### 4. `release.yml` - Semantic Release (Optional)
**Triggers:** Push to main, Manual

**What it does:**
- Automatically versions package based on commits
- Generates changelogs
- Creates GitHub releases
- Publishes to npm

**Why it's important:** Automated versioning following semantic versioning, professional changelog management.

### 5. `dependabot.yml` - Dependency Updates
**What it does:**
- Auto-creates PRs for dependency updates
- Weekly checks for new versions
- Updates both npm and GitHub Actions

**Why it's important:** Keeps dependencies secure and up-to-date with minimal effort.

## 🔧 Setup Instructions

### 1. Enable GitHub Actions
GitHub Actions are enabled by default, but verify:
1. Go to repository **Settings** → **Actions** → **General**
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save if changed

### 2. Add NPM Token Secret
**Required for automated publishing**

1. **Create npm access token:**
   ```bash
   # Login to npm
   npm login

   # Create automation token (recommended) or classic token
   # Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   # Click "Generate New Token" → "Automation" (or "Classic")
   # Copy the token (starts with npm_...)
   ```

2. **Add to GitHub repository:**
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

### 3. Configure Semantic Release (Optional)
If using the automated release workflow:

```bash
# Install semantic-release dependencies
npm install -D semantic-release @semantic-release/changelog @semantic-release/git
```

Update package.json:
```json
{
  "scripts": {
    "semantic-release": "semantic-release"
  }
}
```

### 4. Commit Message Convention
For semantic release to work, use conventional commits:

```bash
# Features (minor version bump)
git commit -m "feat: add new template option"

# Bug fixes (patch version bump)
git commit -m "fix: resolve TypeScript error in composables"

# Breaking changes (major version bump)
git commit -m "feat!: remove deprecated CLI option"

# Other changes (no version bump)
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
```

## 📋 Workflow Comparison

### Package Workflows (.github/workflows/) - For Package Development
| Workflow | Purpose | When it Runs |
|----------|---------|--------------|
| `ci.yml` | Test package code | Every PR, push to main |
| `publish.yml` | Publish to npm | Manual, or on release |
| `codeql.yml` | Security scanning | Weekly, on PR |
| `release.yml` | Auto versioning | Push to main |

### User Workflows (templates/github/workflows/) - For Package Users
| Workflow | Purpose | Provided to Users |
|----------|---------|-------------------|
| `tdd.yml` | TDD workflow for apps | ✅ Copied on init |
| `auto-tdd-setup.yml` | Auto test generation | ✅ Copied on init |

**Key Difference:**
- Package workflows test **your package code**
- User workflows test **apps using your package**

## 🚀 Usage

### Manual Publishing
1. Go to **Actions** tab in GitHub
2. Select "Publish to npm" workflow
3. Click "Run workflow"
4. Choose tag: `latest`, `beta`, or `alpha`
5. Click "Run workflow"

### Automated Publishing (Recommended)
1. Make changes, commit with conventional format
2. Push to main
3. Semantic release automatically:
   - Determines version bump
   - Updates package.json
   - Creates git tag
   - Generates changelog
   - Publishes to npm
   - Creates GitHub release

### Creating a Release Manually
1. Tag your version:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```
2. Go to GitHub **Releases** → **Create new release**
3. Select your tag
4. Generate release notes
5. Publish release
6. Workflow automatically publishes to npm

## 🔒 Security Best Practices

### Protecting Secrets
- ✅ Never commit NPM_TOKEN to code
- ✅ Use GitHub Secrets for sensitive data
- ✅ Use "Automation" tokens, not "Classic"
- ✅ Enable 2FA on npm account
- ✅ Rotate tokens periodically

### Branch Protection
Recommended settings for `main` branch:
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (select CI workflow)
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution before merging

## 📊 Monitoring

### Check Workflow Status
- **Actions tab**: See all workflow runs
- **PR Checks**: See CI results on PRs
- **Security tab**: View CodeQL findings
- **Insights → Dependency graph**: See Dependabot alerts

### Badges for README.md
Add workflow status badges to your README:

```markdown
![CI](https://github.com/carolinapowers/vue-tdd-automation/workflows/CI/badge.svg)
![npm version](https://img.shields.io/npm/v/@vue-tdd/automation.svg)
![npm downloads](https://img.shields.io/npm/dm/@vue-tdd/automation.svg)
[![codecov](https://codecov.io/gh/carolinapowers/vue-tdd-automation/branch/main/graph/badge.svg)](https://codecov.io/gh/carolinapowers/vue-tdd-automation)
```

## 🎯 Next Steps

1. **Enable workflows:**
   ```bash
   git add .github/
   git commit -m "ci: add GitHub Actions workflows"
   git push
   ```

2. **Add NPM_TOKEN secret** (see instructions above)

3. **Test CI workflow:**
   - Create a new branch
   - Make a small change
   - Open a PR
   - Verify CI runs and passes

4. **Test publish workflow:**
   - Use manual workflow dispatch
   - Select `alpha` tag
   - Verify package publishes to npm

5. **Set up branch protection** (recommended)

## ❓ FAQ

**Q: Do I need all these workflows?**
A: Minimum: `ci.yml` and `publish.yml`. Others are optional but recommended.

**Q: Can I publish manually without workflows?**
A: Yes! `npm publish` still works. Workflows just automate and add safety.

**Q: What if my tests fail in CI?**
A: The workflow will fail and prevent merging/publishing. Fix tests first.

**Q: How do I test workflows without publishing?**
A: Use `--dry-run` flag, or test in a fork first.

**Q: Should I use semantic-release?**
A: If you want automated versioning and changelogs, yes. Otherwise, manual versioning is fine.

## 🔗 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing with GitHub Actions](https://docs.npmjs.com/generating-provenance-statements)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [CodeQL](https://codeql.github.com/)

---

**Note:** These workflows are for **package development**. The TDD workflows in `templates/github/workflows/` are what users get when they install your package.
