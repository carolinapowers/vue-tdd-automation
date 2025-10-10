/**
 * Create a new component with TDD tests
 */

import { execSync } from 'child_process';
import path from 'path';

export async function createComponent(name: string, description: string = ''): Promise<void> {
  const cwd = process.cwd();

  // Check if scripts exist
  const scriptPath = path.join(cwd, 'scripts', 'create-tdd-component.js');

  try {
    const desc = description || `Component: ${name}`;
    execSync(`node "${scriptPath}" "${name}" "${desc}"`, {
      cwd,
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Failed to create component. Make sure you've run 'vue-tdd init' first.`);
  }
}
