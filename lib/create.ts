/**
 * Create a new component with TDD tests
 */

import { execSync } from 'child_process';
import path from 'path';

export interface CreateComponentOptions {
  aiGenerate?: boolean;
}

export function createComponent(
  name: string,
  description: string = '',
  options: CreateComponentOptions = {}
): void {
  const cwd = process.cwd();

  // Check if scripts exist
  const scriptPath = path.join(cwd, 'scripts', 'create-tdd-component.js');

  try {
    const desc = description || `Component: ${name}`;
    const aiFlag = options.aiGenerate ? '--ai-generate' : '';
    execSync(`node "${scriptPath}" "${name}" "${desc}" ${aiFlag}`, {
      cwd,
      stdio: 'inherit'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error(`Creation script not found at ${scriptPath}. Make sure you've run 'vue-tdd init' first.`);
      }
      throw error;
    }
    throw new Error(`Failed to create component. Make sure you've run 'vue-tdd init' first.`);
  }
}
