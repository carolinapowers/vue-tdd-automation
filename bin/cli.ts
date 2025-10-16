#!/usr/bin/env node

/**
 * Vue TDD Automation CLI
 * Main entry point for the command-line interface
 */

import { program } from 'commander';
import chalk from 'chalk';
import { initTDD } from '../lib/cli/init.js';
import { createComponent } from '../lib/cli/create.js';
import { createFeature } from '../lib/cli/feature.js';
import { parseJson, isPackageJsonWithVersion } from '../lib/shared/json-utils.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version (from project root, up 2 levels from dist/bin)
const packageJson = parseJson(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8'),
  isPackageJsonWithVersion
);

interface InitOptions {
  workflows: boolean;
  docs: boolean;
  scripts: boolean;
  copilot: boolean;
  force: boolean;
}

interface FeatureOptions {
  issue: boolean;
}

program
  .name('vue-tdd')
  .description('Automated TDD workflow for Vue.js applications')
  .version(packageJson.version);

// Init command
program
  .command('init')
  .description('Initialize TDD workflow in your Vue project')
  .option('--no-workflows', 'Skip GitHub Actions workflows')
  .option('--no-docs', 'Skip documentation files')
  .option('--no-scripts', 'Skip component creation scripts')
  .option('--copilot', 'Add GitHub Copilot instructions for AI-assisted test writing')
  .option('--force', 'Overwrite existing files')
  .action((options: InitOptions) => {
    console.log(chalk.cyan.bold('\n🤖 Initializing Vue TDD Workflow...\n'));
    try {
      initTDD(options);
      console.log(chalk.green.bold('\n✅ TDD workflow initialized successfully!\n'));
      console.log(chalk.yellow('Next steps:'));
      console.log('  1. Run ' + chalk.cyan('npm install') + ' to install dependencies');
      console.log('  2. Create your first component: ' + chalk.cyan('npx vue-tdd create MyComponent'));
      console.log('  3. Read TDD_WORKFLOW.md for detailed guide\n');
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error:'), (error as Error).message);
      if (process.env.DEBUG) {
        console.error(chalk.gray((error as Error).stack));
      }
      process.exit(1);
    }
  });

// Create command
program
  .command('create <name>')
  .description('Create a new component with TDD tests')
  .argument('[description]', 'Component description')
  .action((name: string, description?: string) => {
    console.log(chalk.cyan.bold(`\n🎨 Creating ${name} component...\n`));
    try {
      createComponent(name, description);
      console.log(chalk.green.bold('\n✅ Component created successfully!\n'));
      console.log(chalk.yellow('Next steps:'));
      console.log('  1. Run ' + chalk.cyan('npm run tdd') + ' to start test watch mode');
      console.log('  2. Implement the component to make tests pass\n');
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error:'), (error as Error).message);
      if (process.env.DEBUG) {
        console.error(chalk.gray((error as Error).stack));
      }
      process.exit(1);
    }
  });

// Feature command
program
  .command('feature')
  .description('Interactive feature creation wizard')
  .option('--no-issue', 'Skip GitHub issue creation')
  .action((options: FeatureOptions) => {
    console.log(chalk.cyan.bold('\n🚀 Feature Creation Wizard\n'));
    try {
      createFeature(options);
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error:'), (error as Error).message);
      if (process.env.DEBUG) {
        console.error(chalk.gray((error as Error).stack));
      }
      process.exit(1);
    }
  });

program.parse();
