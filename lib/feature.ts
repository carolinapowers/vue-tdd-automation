/**
 * Interactive feature creation wizard
 */

import { execSync } from 'child_process';
import path from 'path';

export interface FeatureOptions {
  issue?: boolean;
}

export function createFeature(_options: FeatureOptions = {}): void {
  const cwd = process.cwd();

  // Check if scripts exist
  const scriptPath = path.join(cwd, 'scripts', 'tdd-feature.js');

  try {
    execSync(`node "${scriptPath}"`, {
      cwd,
      stdio: 'inherit'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error(`Feature wizard script not found at ${scriptPath}. Make sure you've run 'vue-tdd init' first.`);
      }
      throw error;
    }
    throw new Error(`Failed to start feature wizard. Make sure you've run 'vue-tdd init' first.`);
  }
}
