#!/usr/bin/env node

/**
 * Post-build script
 * Copies compiled scripts from dist/ to templates/scripts/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..', '..'); // Go up from dist/scripts/ to project root
const distScripts = path.join(projectRoot, 'dist', 'lib', 'scripts');
const distTemplatesScripts = path.join(projectRoot, 'dist', 'templates', 'scripts');
const sourceTemplates = path.join(projectRoot, 'templates');

// Files to copy from compiled lib/scripts to dist/templates/scripts
const filesToCopy = [
  'create-tdd-component.js',
  'generate-tests-from-issue.js',
  'tdd-feature.js'
];

console.log('📦 Post-build: Copying templates and compiled scripts...\n');

try {
  // Step 1: Copy entire templates directory to dist/templates
  console.log('📁 Copying source templates to dist/templates...');
  copyDirectory(sourceTemplates, path.join(projectRoot, 'dist', 'templates'));
  console.log('✅ Templates copied\n');

  // Step 2: Ensure dist/templates/scripts directory exists
  if (!fs.existsSync(distTemplatesScripts)) {
    fs.mkdirSync(distTemplatesScripts, { recursive: true });
  }

  // Step 3: Copy compiled scripts to dist/templates/scripts
  console.log('📜 Copying compiled scripts...');
  for (const file of filesToCopy) {
    const src = path.join(distScripts, file);
    const dest = path.join(distTemplatesScripts, file);

    if (!fs.existsSync(src)) {
      console.warn(`⚠️  Source file not found: ${src}`);
      continue;
    }

    // Add shebang to the compiled file
    let content = fs.readFileSync(src, 'utf-8');
    if (!content.startsWith('#!')) {
      content = '#!/usr/bin/env node\n' + content;
    }

    // For scripts that use test-generator, replace relative imports with package imports
    if (file === 'tdd-feature.js' || file === 'generate-tests-from-issue.js') {
      content = content.replace(
        /from ['"]\.\.\/test-generator\/index\.js['"]/g,
        "from '@carolinappowers/vue-tdd-automation/test-generator/index.js'"
      );
      content = content.replace(
        /from ['"]\.\.\/test-generator\/validator\.js['"]/g,
        "from '@carolinappowers/vue-tdd-automation/test-generator/validator.js'"
      );
      content = content.replace(
        /from ['"]\.\.\/test-generator\/types\.js['"]/g,
        "from '@carolinappowers/vue-tdd-automation/test-generator/types.js'"
      );
    }

    fs.writeFileSync(dest, content);
    fs.chmodSync(dest, '755'); // Make executable
    console.log(`✅ Copied: ${file}`);
  }

  console.log('\n✨ Post-build complete!');
} catch (error) {
  console.error('❌ Post-build error:', (error as Error).message);
  process.exit(1);
}

/**
 * Recursively copy directory
 */
function copyDirectory(src: string, dest: string): void {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
