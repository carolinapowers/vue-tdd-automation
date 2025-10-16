# Contributing to @carolinappowers/vue-tdd-automation

Thank you for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/carolinapowers/vue-tdd-automation.git
cd vue-tdd-automation
npm install
```

## Project Structure

```
vue-tdd-automation/
├── bin/
│   └── cli.ts                    # CLI entry point
├── lib/
│   ├── cli/                      # Self-contained CLI commands
│   │   ├── init.ts              # npx vue-tdd init
│   │   ├── create.ts            # npx vue-tdd create
│   │   └── feature.ts           # npx vue-tdd feature
│   ├── github-actions/          # Scripts for GitHub Actions workflows
│   │   ├── create-tdd-component.ts
│   │   ├── generate-tests-from-issue.ts
│   │   └── tdd-feature.ts
│   └── shared/                  # Shared between CLI and GitHub Actions
│       ├── test-generator/
│       │   ├── index.ts
│       │   ├── types.ts
│       │   └── validator.ts
│       └── json-utils.ts
├── scripts/
│   └── dev/                     # Development tools (not distributed)
│       └── create-test-project.sh
├── templates/                    # Files to copy into projects
│   ├── test/                    # Test helpers and setup
│   ├── github/                  # GitHub Actions workflows
│   └── docs/                    # Documentation
├── dist/                        # Built JavaScript (generated)
└── package.json

```

## Development

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Testing Locally

There are several ways to test your changes:

**Option 1: Install from branch (recommended for testing specific branches)**

```bash
# Install to a test app from your current branch
npm run dev:install -- ~/path/to/test-app

# Install from a specific branch
npm run dev:install -- ~/path/to/test-app feature/my-branch
```

**Option 2: Using npm link (good for iterative development)**

```bash
# In vue-tdd-automation directory
npm run build
npm link

# In a test Vue project
npm link @carolinappowers/vue-tdd-automation
npx vue-tdd init
```

**Option 3: Create a fresh test project**

```bash
npm run dev:create-test-project
```

See [scripts/dev/README.md](./scripts/dev/README.md) for more details on development scripts.

### Making Changes

1. Make changes to TypeScript files in `bin/`, `lib/cli/`, `lib/github-actions/`, or `lib/shared/`
2. Run `npm run build` to compile
3. Test with `npm link` in a test project
4. Commit your changes

## Publishing

Only maintainers can publish. The publish process:

```bash
npm version patch  # or minor, or major
npm publish
```

The `prepublishOnly` script automatically builds before publishing.

## Adding Templates

To add new template files:

1. Add the file to the appropriate `templates/` subdirectory
2. Update `lib/cli/init.ts` to include it in the `filesToCopy` array
3. Test with `npx vue-tdd init --force` in a test project

## TypeScript

This project uses TypeScript for type safety. Key files:

- `tsconfig.json` - TypeScript configuration
- All source in `bin/`, `lib/cli/`, `lib/github-actions/`, and `lib/shared/` is `.ts`
- Type definitions are generated in `dist/`

## Code Style

- Use ES modules (`import/export`)
- Use TypeScript types for all functions
- Follow existing code formatting
- Use `chalk` for colored output
- Use `commander` for CLI structure

## Questions?

Open an issue on GitHub!
