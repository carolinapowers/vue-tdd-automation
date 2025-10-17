/**
 * Interactive feature creation wizard
 * Self-contained implementation - imports logic directly
 */

import readline from 'readline';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateTestContent } from '../shared/test-generator/index.js';
import { createComponent } from './create.js';
import type { TestRequirements } from '../shared/test-generator/types.js';

export interface FeatureOptions {
  issue?: boolean;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

export async function createFeature(options: FeatureOptions = {}): Promise<void> {
  console.log(chalk.cyan.bold('🤖 TDD Feature Generator\n'));
  console.log('This tool will create a GitHub issue and automatically set up TDD for your feature.\n');

  // Collect feature information
  const componentName = await prompt(chalk.yellow('Component name (PascalCase): '));
  const description = await prompt(chalk.yellow('Brief description: '));
  const userType = await prompt(chalk.yellow('User type (e.g., user, admin, guest): '));
  const feature = await prompt(chalk.yellow('What feature do they want? '));
  const benefit = await prompt(chalk.yellow('What benefit does it provide? '));

  console.log(chalk.cyan('\n📝 Acceptance Criteria'));
  console.log('Enter acceptance criteria (empty line to finish):');

  const acceptanceCriteria: string[] = [];
  let criterion: string;
  while ((criterion = await prompt('  - ')) !== '') {
    acceptanceCriteria.push(criterion);
  }

  console.log(chalk.cyan('\n🧩 Component Details'));
  const props = await prompt(chalk.yellow('Props (comma-separated, e.g., "value: string, disabled: boolean"): '));
  const events = await prompt(chalk.yellow('Events (comma-separated, e.g., "change, submit, cancel"): '));
  const stateManagement = await prompt(chalk.yellow('State management (local/composable/pinia): '));

  console.log(chalk.cyan('\n✅ Test Scenarios'));
  console.log('Happy path scenarios (empty line to finish):');
  const happyPath: string[] = [];
  let scenario: string;
  while ((scenario = await prompt('  - ')) !== '') {
    happyPath.push(scenario);
  }

  console.log('Edge cases (empty line to finish):');
  const edgeCases: string[] = [];
  while ((scenario = await prompt('  - ')) !== '') {
    edgeCases.push(scenario);
  }

  console.log('Error cases (empty line to finish):');
  const errorCases: string[] = [];
  while ((scenario = await prompt('  - ')) !== '') {
    errorCases.push(scenario);
  }

  console.log(chalk.cyan('\n📱 UI/UX Requirements'));
  const desktopView = await prompt(chalk.yellow('Desktop view requirements: '));
  const mobileView = await prompt(chalk.yellow('Mobile view requirements: '));
  const accessibility = await prompt(chalk.yellow('Accessibility requirements: '));

  // Create issue body
  const issueBody = `
## User Story
As a ${userType}, I want ${feature} so that ${benefit}

## Acceptance Criteria
${acceptanceCriteria.map(c => `- [ ] ${c}`).join('\n')}

## Component Details
**Component Name**: ${componentName}
**Props**: ${props || 'None'}
**Events**: ${events ? events.split(',').map(e => `@${e.trim()}`).join(', ') : 'None'}
**State Management**: ${stateManagement || 'local state'}

## Test Scenarios
### Happy Path
${happyPath.map(s => `- [ ] ${s}`).join('\n')}

### Edge Cases
${edgeCases.map(s => `- [ ] ${s}`).join('\n')}

### Error Cases
${errorCases.map(s => `- [ ] ${s}`).join('\n')}

## API/Data Requirements
\`\`\`json
{
  // To be defined
}
\`\`\`

## UI/UX Requirements
- Desktop view: ${desktopView || 'Standard responsive layout'}
- Mobile view: ${mobileView || 'Mobile-optimized layout'}
- Accessibility: ${accessibility || 'WCAG 2.1 AA compliance'}

## Dependencies
- [ ] Backend API endpoint required?
- [ ] Design mockup available?
- [ ] External library needed?
`.trim();

  const issueTitle = `[FEATURE] ${componentName} - ${description}`;

  // Try to create GitHub issue if requested
  if (options.issue !== false) {
    console.log(chalk.green('\n✨ Creating GitHub issue...'));

    const hasGitHubCLI = (() => {
      try {
        execSync('gh --version', { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    })();

    if (hasGitHubCLI) {
      try {
        const result = execSync(
          `gh issue create --title "${issueTitle}" --body "${issueBody.replace(/"/g, '\\"')}" --label "feature-request,tdd,enhancement"`,
          { encoding: 'utf-8' }
        );
        console.log(chalk.green('✅ Issue created successfully!'));
        console.log(result);

        console.log(chalk.cyan('\n🤖 The GitHub Action will now:'));
        console.log('  1. Create a feature branch');
        console.log('  2. Generate component scaffold');
        console.log('  3. Create test file with all requirements');
        console.log('  4. Open a Pull Request');
        console.log('\nCheck your GitHub repository for updates!');
      } catch (error) {
        console.error(chalk.red('Error creating issue:'), (error as Error).message);
      }
    } else {
      // Save to file and provide instructions
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `issue-${componentName}-${timestamp}.md`;
      const filepath = path.join(process.cwd(), filename);

      fs.writeFileSync(filepath, `---
title: ${issueTitle}
labels: feature-request, tdd, enhancement
---

${issueBody}`);

      console.log(chalk.yellow('⚠️  GitHub CLI not found'));
      console.log(`Issue content saved to: ${chalk.bold(filename)}\n`);
      console.log('To create the issue manually:');
      console.log('1. Go to your GitHub repository');
      console.log('2. Click "Issues" → "New Issue"');
      console.log('3. Choose "Feature Request (TDD)" template');
      console.log('4. Copy the content from the saved file');
      console.log('5. Make sure to add the "feature-request" label');
      console.log('\nOr install GitHub CLI: https://cli.github.com/');
    }
  }

  // Option to generate local setup immediately
  const generateLocal = await prompt(chalk.yellow('\nGenerate local TDD setup now? (y/n): '));

  if (generateLocal.toLowerCase() === 'y') {
    console.log(chalk.cyan('\n🚀 Generating local TDD setup...'));

    // Create branch
    const branchName = `feature/${componentName.toLowerCase()}`;
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    } catch {
      console.log(`Branch ${branchName} may already exist, continuing...`);
    }

    // Generate component and tests using self-contained create function
    createComponent(componentName, { description: issueTitle });

    // Generate detailed tests based on requirements
    const testFile = path.join(process.cwd(), 'src', 'components', `${componentName}.test.ts`);
    const requirements: TestRequirements = {
      userStory: `As a ${userType}, I want ${feature} so that ${benefit}`,
      acceptanceCriteria,
      happyPath,
      edgeCases,
      errorCases,
      props,
      events
    };

    const testContent = generateTestContent(componentName, requirements);
    fs.writeFileSync(testFile, testContent);

    console.log(chalk.green('\n✅ TDD setup complete!'));
    console.log('\nNext steps:');
    console.log(`  1. Run tests: ${chalk.bold('npm run tdd')}`);
    console.log(`  2. Implement ${componentName} to make tests pass`);
    console.log(`  3. Commit when all tests are green`);
  }

  rl.close();
}
