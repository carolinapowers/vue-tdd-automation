# Contributing to @vue-tdd/automation

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
│   └── cli.ts              # CLI entry point
├── lib/
│   ├── init.ts            # Initialize TDD in projects
│   ├── create.ts          # Create components
│   └── feature.ts         # Feature wizard
├── templates/              # Files to copy into projects
│   ├── scripts/           # TDD automation scripts
│   ├── test/              # Test helpers and setup
│   ├── github/            # GitHub Actions workflows
│   └── docs/              # Documentation
├── dist/                  # Built JavaScript (generated)
└── package.json

```

## Development

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Testing Locally

Link the package locally to test it:

```bash
# In vue-tdd-automation directory
npm link

# In a test Vue project
npm link @vue-tdd/automation
npx vue-tdd init
```

### Making Changes

1. Make changes to TypeScript files in `bin/` or `lib/`
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
2. Update `lib/init.ts` to include it in the `filesToCopy` array
3. Test with `npx vue-tdd init --force` in a test project

## TypeScript

This project uses TypeScript for type safety. Key files:

- `tsconfig.json` - TypeScript configuration
- All source in `bin/` and `lib/` is `.ts`
- Type definitions are generated in `dist/`

## Code Style

- Use ES modules (`import/export`)
- Use TypeScript types for all functions
- Follow existing code formatting
- Use `chalk` for colored output
- Use `commander` for CLI structure

## Questions?

Open an issue on GitHub!
