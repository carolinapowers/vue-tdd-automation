/**
 * Initialize TDD workflow in a Vue project
 * Copies templates and sets up configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { parseJson, isPackageJson } from '../shared/json-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface InitOptions {
  workflows?: boolean;
  docs?: boolean;
  scripts?: boolean | 'ts' | 'js';
  copilot?: boolean;
  force?: boolean;
}

interface FileMapping {
  src: string;
  dest: string;
  required?: boolean;
}

export function initTDD(options: InitOptions = {}): void {
  const {
    workflows = true,
    docs = true,
    scripts = false, // Changed default to false for hybrid approach
    copilot = false,
    force = false
  } = options;

  const cwd = process.cwd();
  // Templates are in dist/templates, up 2 levels from dist/lib/cli
  const templatesDir = path.join(__dirname, '../../templates');
  // Source TypeScript files are in dist/lib/github-actions
  const sourceScriptsDir = path.join(__dirname, '../github-actions');

  // Verify templates directory exists
  if (!fs.existsSync(templatesDir)) {
    throw new Error(`Templates directory not found at ${templatesDir}. Package may be corrupted. Please try reinstalling: npm install -D @vue-tdd/automation`);
  }

  // Check if this is a Vue project
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No package.json found. Are you in a Vue project directory?');
  }

  const packageJson = parseJson(fs.readFileSync(packageJsonPath, 'utf-8'), isPackageJson);
  if (!packageJson.dependencies?.vue && !packageJson.devDependencies?.vue) {
    console.log(chalk.yellow('⚠️  Warning: Vue not found in dependencies. Continuing anyway...'));
  }

  console.log(chalk.blue('📦 Installing TDD infrastructure...\n'));

  // Core test files (always needed)
  const filesToCopy: FileMapping[] = [
    // Test setup and helpers
    { src: 'test/setup.ts', dest: 'src/test/setup.ts', required: true },
    { src: 'test/helpers/index.ts', dest: 'src/test/helpers/index.ts', required: true },
    { src: 'test/helpers/testing-library.ts', dest: 'src/test/helpers/testing-library.ts', required: true },
    { src: 'test/helpers/vue-testing.ts', dest: 'src/test/helpers/vue-testing.ts', required: true },
    { src: 'test/helpers/composables-testing.ts', dest: 'src/test/helpers/composables-testing.ts', required: true },
  ];

  // Vitest config (handle specially if exists)
  const vitestConfigPath = path.join(cwd, 'vitest.config.ts');
  if (fs.existsSync(vitestConfigPath) && !force) {
    console.log(chalk.yellow('⚠️  vitest.config.ts already exists'));
    console.log(chalk.gray('   To merge TDD settings, see: templates/vitest.config.ts'));
    console.log(chalk.gray('   Or use --force to overwrite\n'));
  } else {
    filesToCopy.push({ src: 'vitest.config.ts', dest: 'vitest.config.ts', required: false });
  }

  // Optional scripts - can be 'ts', 'js', true (defaults to 'js'), or false
  const scriptFormat = scripts ? (scripts === true ? 'js' : scripts) : false;
  if (scriptFormat === 'js') {
    // Copy compiled JavaScript files from templates
    filesToCopy.push(
      { src: 'scripts/tdd-feature.js', dest: 'scripts/tdd-feature.js' },
      { src: 'scripts/create-tdd-component.js', dest: 'scripts/create-tdd-component.js' },
      { src: 'scripts/generate-tests-from-issue.js', dest: 'scripts/generate-tests-from-issue.js' }
    );
  }

  // Optional files
  if (workflows) {
    filesToCopy.push(
      { src: 'github/workflows/auto-tdd-setup.yml', dest: '.github/workflows/auto-tdd-setup.yml' },
      { src: 'github/workflows/tdd.yml', dest: '.github/workflows/tdd.yml' },
      { src: 'github/ISSUE_TEMPLATE/feature_request.md', dest: '.github/ISSUE_TEMPLATE/feature_request.md' }
    );
  }

  // Optional Copilot instructions
  if (copilot) {
    filesToCopy.push(
      { src: 'github/copilot-instructions.md', dest: '.github/copilot-instructions.md' }
    );
  }

  if (docs) {
    filesToCopy.push(
      { src: 'docs/TDD_WORKFLOW.md', dest: 'TDD_WORKFLOW.md' },
      { src: 'docs/TESTING_COMPARISON.md', dest: 'TESTING_COMPARISON.md' },
      { src: 'docs/VUE_TESTING_ALIGNMENT.md', dest: 'VUE_TESTING_ALIGNMENT.md' }
    );
  }

  // Copy files
  let copiedCount = 0;
  let skippedCount = 0;

  for (const file of filesToCopy) {
    const srcPath = path.join(templatesDir, file.src);
    const destPath = path.join(cwd, file.dest);

    // Check if source exists
    if (!fs.existsSync(srcPath)) {
      console.log(chalk.yellow(`⚠️  Template not found: ${file.src}`));
      continue;
    }

    // Check if destination exists
    if (fs.existsSync(destPath) && !force) {
      console.log(chalk.gray(`⏭️  Skipped (exists): ${file.dest}`));
      skippedCount++;
      continue;
    }

    // Create directory if needed
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(srcPath, destPath);
    console.log(chalk.green(`✅ Copied: ${file.dest}`));
    copiedCount++;
  }

  // Copy TypeScript scripts if requested (after regular copy so counters are initialized)
  if (scriptFormat === 'ts') {
    const tsScripts = [
      { src: 'tdd-feature.ts', dest: 'scripts/tdd-feature.ts' },
      { src: 'create-tdd-component.ts', dest: 'scripts/create-tdd-component.ts' },
      { src: 'generate-tests-from-issue.ts', dest: 'scripts/generate-tests-from-issue.ts' }
    ];

    for (const script of tsScripts) {
      const srcPath = path.join(sourceScriptsDir, script.src);
      if (fs.existsSync(srcPath)) {
        // Read the TS file and replace package imports with relative paths
        let content = fs.readFileSync(srcPath, 'utf-8');

        // Replace package imports with relative imports
        content = content.replace(
          /from ['"]@carolinappowers\/vue-tdd-automation\/shared\/test-generator['"]/g,
          "from '../node_modules/@carolinappowers/vue-tdd-automation/dist/lib/shared/test-generator/index.js'"
        );
        content = content.replace(
          /from ['"]@carolinappowers\/vue-tdd-automation\/shared\/test-generator\/validator['"]/g,
          "from '../node_modules/@carolinappowers/vue-tdd-automation/dist/lib/shared/test-generator/validator.js'"
        );
        content = content.replace(
          /from ['"]@carolinappowers\/vue-tdd-automation\/shared\/test-generator\/types['"]/g,
          "from '../node_modules/@carolinappowers/vue-tdd-automation/dist/lib/shared/test-generator/types.js'"
        );

        // Write to destination
        const destPath = path.join(cwd, script.dest);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        if (fs.existsSync(destPath) && !force) {
          console.log(chalk.gray(`⏭️  Skipped (exists): ${script.dest}`));
          skippedCount++;
        } else {
          fs.writeFileSync(destPath, content);
          console.log(chalk.green(`✅ Copied (TS): ${script.dest}`));
          copiedCount++;
        }
      }
    }
  }

  console.log(chalk.blue(`\n📊 Summary: ${copiedCount} files copied, ${skippedCount} skipped\n`));

  // Update package.json with test scripts
  updatePackageJson(packageJsonPath);

  // Install dependencies
  console.log(chalk.blue('📦 Required dependencies:\n'));

  console.log(chalk.gray('Testing libraries:'));
  console.log(chalk.white('  @testing-library/jest-dom      ') + chalk.gray('# DOM matchers (works with Vitest!)'));
  console.log(chalk.white('  @testing-library/user-event    ') + chalk.gray('# User interaction simulation'));
  console.log(chalk.white('  @testing-library/vue           ') + chalk.gray('# Vue Testing Library'));
  console.log(chalk.white('  @vue/test-utils                ') + chalk.gray('# Vue Test Utils'));

  console.log(chalk.gray('\nTest runner:'));
  console.log(chalk.white('  vitest                         ') + chalk.gray('# Fast Vite-native test runner'));
  console.log(chalk.white('  @vitest/ui                     ') + chalk.gray('# Interactive test UI'));
  console.log(chalk.white('  @vitest/coverage-v8            ') + chalk.gray('# Code coverage via V8'));
  console.log(chalk.white('  happy-dom                      ') + chalk.gray('# Fast DOM environment (lighter than jsdom)'));

  console.log(chalk.gray('\nVue & TypeScript:'));
  console.log(chalk.white('  @vitejs/plugin-vue             ') + chalk.gray('# Vue 3 plugin for Vite'));
  console.log(chalk.white('  @types/node                    ') + chalk.gray('# Node.js type definitions'));

  console.log(chalk.yellow('\nInstall command:\n'));
  console.log(chalk.cyan('npm install -D @testing-library/jest-dom @testing-library/user-event @testing-library/vue @types/node @vitejs/plugin-vue @vue/test-utils @vitest/ui @vitest/coverage-v8 happy-dom vitest\n'));
}

function updatePackageJson(packageJsonPath: string): void {
  const packageJson = parseJson(fs.readFileSync(packageJsonPath, 'utf-8'), isPackageJson);

  // Add scripts if they don't exist
  const scriptsToAdd: Record<string, string> = {
    'test': 'vitest',
    'test:watch': 'vitest --watch',
    'test:ui': 'vitest --ui',
    'test:coverage': 'vitest --coverage',
    'tdd': 'vitest --watch --reporter=verbose',
    'create:component': 'node scripts/create-tdd-component.js',
    'tdd:feature': 'node scripts/tdd-feature.js'
  };

  // Add required dependencies if they don't exist
  const depsToAdd: Record<string, string> = {
    '@testing-library/jest-dom': '^6.0.0',
    '@testing-library/user-event': '^14.0.0',
    '@testing-library/vue': '^8.0.0',
    '@types/node': '^22.0.0',
    '@vitejs/plugin-vue': '^6.0.0',
    '@vue/test-utils': '^2.4.0',
    '@vitest/ui': '^3.0.0',
    '@vitest/coverage-v8': '^3.0.0',
    'happy-dom': '^15.0.0',
    'vitest': '^3.0.0'
  };

  packageJson.scripts = packageJson.scripts || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  let scriptsAdded = false;
  let depsAdded = false;

  for (const [name, command] of Object.entries(scriptsToAdd)) {
    if (!packageJson.scripts[name]) {
      packageJson.scripts[name] = command;
      console.log(chalk.green(`✅ Added script: ${name}`));
      scriptsAdded = true;
    }
  }

  for (const [name, version] of Object.entries(depsToAdd)) {
    if (!packageJson.devDependencies[name] && !packageJson.dependencies?.[name]) {
      packageJson.devDependencies[name] = version;
      console.log(chalk.green(`✅ Added dependency: ${name}@${version}`));
      depsAdded = true;
    }
  }

  if (scriptsAdded || depsAdded) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    if (depsAdded) {
      console.log(chalk.yellow('\n⚠️  Dependencies added to package.json. Run npm install to install them.\n'));
    }
  } else {
    console.log(chalk.gray('⏭️  All scripts and dependencies already exist'));
  }
}
