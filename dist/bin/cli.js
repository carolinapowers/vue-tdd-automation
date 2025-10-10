#!/usr/bin/env node
/**
 * Vue TDD Automation CLI
 * Main entry point for the command-line interface
 */
import { program } from 'commander';
import chalk from 'chalk';
import { initTDD } from '../lib/init.js';
import { createComponent } from '../lib/create.js';
import { createFeature } from '../lib/feature.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read package.json for version (from project root, up 2 levels from dist/bin)
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
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
    .option('--force', 'Overwrite existing files')
    .action(async (options) => {
    console.log(chalk.cyan.bold('\n🤖 Initializing Vue TDD Workflow...\n'));
    try {
        await initTDD(options);
        console.log(chalk.green.bold('\n✅ TDD workflow initialized successfully!\n'));
        console.log(chalk.yellow('Next steps:'));
        console.log('  1. Run ' + chalk.cyan('npm install') + ' to install dependencies');
        console.log('  2. Create your first component: ' + chalk.cyan('npx vue-tdd create MyComponent'));
        console.log('  3. Read TDD_WORKFLOW.md for detailed guide\n');
    }
    catch (error) {
        console.error(chalk.red.bold('\n❌ Error:'), error.message);
        if (process.env.DEBUG) {
            console.error(chalk.gray(error.stack));
        }
        process.exit(1);
    }
});
// Create command
program
    .command('create <name>')
    .description('Create a new component with TDD tests')
    .argument('[description]', 'Component description')
    .action(async (name, description) => {
    console.log(chalk.cyan.bold(`\n🎨 Creating ${name} component...\n`));
    try {
        await createComponent(name, description);
        console.log(chalk.green.bold('\n✅ Component created successfully!\n'));
        console.log(chalk.yellow('Next steps:'));
        console.log('  1. Run ' + chalk.cyan('npm run tdd') + ' to start test watch mode');
        console.log('  2. Implement the component to make tests pass\n');
    }
    catch (error) {
        console.error(chalk.red.bold('\n❌ Error:'), error.message);
        if (process.env.DEBUG) {
            console.error(chalk.gray(error.stack));
        }
        process.exit(1);
    }
});
// Feature command
program
    .command('feature')
    .description('Interactive feature creation wizard')
    .option('--no-issue', 'Skip GitHub issue creation')
    .action(async (options) => {
    console.log(chalk.cyan.bold('\n🚀 Feature Creation Wizard\n'));
    try {
        await createFeature(options);
    }
    catch (error) {
        console.error(chalk.red.bold('\n❌ Error:'), error.message);
        if (process.env.DEBUG) {
            console.error(chalk.gray(error.stack));
        }
        process.exit(1);
    }
});
program.parse();
