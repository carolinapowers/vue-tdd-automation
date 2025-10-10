/**
 * Interactive feature creation wizard
 */
import { execSync } from 'child_process';
import path from 'path';
export async function createFeature(options = {}) {
    const cwd = process.cwd();
    // Check if scripts exist
    const scriptPath = path.join(cwd, 'scripts', 'tdd-feature.js');
    try {
        execSync(`node "${scriptPath}"`, {
            cwd,
            stdio: 'inherit'
        });
    }
    catch (error) {
        throw new Error(`Failed to start feature wizard. Make sure you've run 'vue-tdd init' first.`);
    }
}
