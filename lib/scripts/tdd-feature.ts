#!/usr/bin/env node

/**
 * TDD Feature CLI
 * Automates the creation of GitHub issues and triggers TDD setup
 * Usage: npm run tdd:feature
 */

import readline from 'readline';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateTestContent } from '../test-generator/index.js';
import type { TestRequirements } from '../test-generator/types.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main(): Promise<void> {
  console.log(`${colors.bright}${colors.cyan}🤖 TDD Feature Generator${colors.reset}\n`);
  console.log('This tool will create a GitHub issue and automatically set up TDD for your feature.\n');

  // Collect feature information
  const componentNameInput = await prompt(`${colors.yellow}Component name (PascalCase):${colors.reset} `);

  // Validate component name to prevent path traversal
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentNameInput)) {
    console.error(`${colors.red}❌ Invalid component name. Must be PascalCase (e.g., MyComponent)${colors.reset}`);
    rl.close();
    process.exit(1);
  }

  const componentName = componentNameInput;
  const description = await prompt(`${colors.yellow}Brief description:${colors.reset} `);
  const userType = await prompt(`${colors.yellow}User type (e.g., user, admin, guest):${colors.reset} `);
  const feature = await prompt(`${colors.yellow}What feature do they want?${colors.reset} `);
  const benefit = await prompt(`${colors.yellow}What benefit does it provide?${colors.reset} `);

  console.log(`\n${colors.cyan}📝 Acceptance Criteria${colors.reset}`);
  console.log('Enter acceptance criteria (empty line to finish):');

  const acceptanceCriteria: string[] = [];
  let criterion: string;
  while ((criterion = await prompt(`  - `)) !== '') {
    acceptanceCriteria.push(criterion);
  }

  console.log(`\n${colors.cyan}🧩 Component Details${colors.reset}`);
  const props = await prompt(`${colors.yellow}Props (comma-separated, e.g., "value: string, disabled: boolean"):${colors.reset} `);
  const events = await prompt(`${colors.yellow}Events (comma-separated, e.g., "change, submit, cancel"):${colors.reset} `);
  const stateManagement = await prompt(`${colors.yellow}State management (local/composable/pinia):${colors.reset} `);

  console.log(`\n${colors.cyan}✅ Test Scenarios${colors.reset}`);
  console.log('Happy path scenarios (empty line to finish):');
  const happyPath: string[] = [];
  let scenario: string;
  while ((scenario = await prompt(`  - `)) !== '') {
    happyPath.push(scenario);
  }

  console.log('Edge cases (empty line to finish):');
  const edgeCases: string[] = [];
  while ((scenario = await prompt(`  - `)) !== '') {
    edgeCases.push(scenario);
  }

  console.log('Error cases (empty line to finish):');
  const errorCases: string[] = [];
  while ((scenario = await prompt(`  - `)) !== '') {
    errorCases.push(scenario);
  }

  console.log(`\n${colors.cyan}📱 UI/UX Requirements${colors.reset}`);
  const desktopView = await prompt(`${colors.yellow}Desktop view requirements:${colors.reset} `);
  const mobileView = await prompt(`${colors.yellow}Mobile view requirements:${colors.reset} `);
  const accessibility = await prompt(`${colors.yellow}Accessibility requirements:${colors.reset} `);

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

  console.log(`\n${colors.green}✨ Creating GitHub issue...${colors.reset}`);

  const issueTitle = `[FEATURE] ${componentName} - ${description}`;

  // Option 1: Create issue using GitHub CLI (if installed)
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
      console.log(`${colors.green}✅ Issue created successfully!${colors.reset}`);
      console.log(result);

      console.log(`\n${colors.cyan}🤖 The GitHub Action will now:${colors.reset}`);
      console.log('  1. Create a feature branch');
      console.log('  2. Generate component scaffold');
      console.log('  3. Create test file with all requirements');
      console.log('  4. Open a Pull Request');
      console.log('\nCheck your GitHub repository for updates!');
    } catch (error) {
      console.error(`${colors.red}Error creating issue:${colors.reset}`, (error as Error).message);
    }
  } else {
    // Option 2: Save to file and provide instructions
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `issue-${componentName}-${timestamp}.md`;
    const filepath = path.join(process.cwd(), filename);

    fs.writeFileSync(filepath, `---
title: ${issueTitle}
labels: feature-request, tdd, enhancement
---

${issueBody}`);

    console.log(`${colors.yellow}⚠️  GitHub CLI not found${colors.reset}`);
    console.log(`Issue content saved to: ${colors.bright}${filename}${colors.reset}\n`);
    console.log('To create the issue manually:');
    console.log('1. Go to your GitHub repository');
    console.log('2. Click "Issues" → "New Issue"');
    console.log('3. Choose "Feature Request (TDD)" template');
    console.log('4. Copy the content from the saved file');
    console.log('5. Make sure to add the "feature-request" label');
    console.log('\nOr install GitHub CLI: https://cli.github.com/');
  }

  // Option 3: Generate local setup immediately
  const generateLocal = await prompt(`\n${colors.yellow}Generate local TDD setup now? (y/n):${colors.reset} `);

  if (generateLocal.toLowerCase() === 'y') {
    console.log(`\n${colors.cyan}🚀 Generating local TDD setup...${colors.reset}`);

    // Create branch
    const branchName = `feature/${componentName.toLowerCase()}`;
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    } catch {
      console.log(`Branch ${branchName} may already exist, continuing...`);
    }

    // Generate component and tests
    execSync(`node scripts/create-tdd-component.js ${componentName} "${issueTitle}"`, { stdio: 'inherit' });

    // Generate detailed tests based on requirements
    const testFile = path.join('src', 'components', `${componentName}.test.ts`);
    const requirements: TestRequirements = {
      userStory: `As a ${userType}, I want ${feature} so that ${benefit}`,
      acceptanceCriteria,
      happyPath,
      edgeCases,
      errorCases,
      props,
      events
    };

    // Check for generation flags
    const aiGenerate = process.env.FEATURE_AI_GENERATE === 'true';
    const copilotReady = process.env.FEATURE_COPILOT_READY === 'true';

    const testContent = await generateTestContent(componentName, requirements, { aiGenerate, copilotReady });

    fs.writeFileSync(testFile, testContent);

    console.log(`\n${colors.green}✅ TDD setup complete!${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Run tests: ${colors.bright}npm run tdd${colors.reset}`);
    console.log(`  2. Implement ${componentName} to make tests pass`);
    console.log(`  3. Commit when all tests are green`);
  }

  rl.close();
}

main().catch(console.error);
