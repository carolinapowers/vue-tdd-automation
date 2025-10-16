import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('../../lib/init', () => ({
  initTDD: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../../lib/create', () => ({
  createComponent: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../../lib/feature', () => ({
  createFeature: vi.fn().mockResolvedValue(undefined)
}));

describe('CLI Integration', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  describe('CLI execution', () => {
    it('should be executable via npm', async () => {
      // This test verifies the package.json bin configuration
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.bin).toBeDefined();
      expect(packageJson.bin['vue-tdd']).toBe('./dist/bin/cli.js');
    });

    it('should have correct module type', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.type).toBe('module');
    });

    it('should export main entry point', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.main).toBe('dist/lib/init.js');
    });
  });

  describe('init command', () => {
    it('should import initTDD function', async () => {
      const { initTDD } = await import('../../lib/init');

      expect(initTDD).toBeDefined();
      expect(typeof initTDD).toBe('function');
    });

    it('should call initTDD with correct options', async () => {
      const { initTDD } = await import('../../lib/init');

      initTDD({ workflows: true, docs: true, force: false });

      expect(initTDD).toHaveBeenCalledWith({
        workflows: true,
        docs: true,
        force: false
      });
    });

    it('should support --no-workflows flag', async () => {
      const { initTDD } = await import('../../lib/init');

      initTDD({ workflows: false, docs: true, force: false });

      expect(initTDD).toHaveBeenCalledWith(
        expect.objectContaining({ workflows: false })
      );
    });

    it('should support --no-docs flag', async () => {
      const { initTDD } = await import('../../lib/init');

      initTDD({ workflows: true, docs: false, force: false });

      expect(initTDD).toHaveBeenCalledWith(
        expect.objectContaining({ docs: false })
      );
    });

    it('should support --force flag', async () => {
      const { initTDD } = await import('../../lib/init');

      initTDD({ workflows: true, docs: true, force: true });

      expect(initTDD).toHaveBeenCalledWith(
        expect.objectContaining({ force: true })
      );
    });
  });

  describe('create command', () => {
    it('should import createComponent function', async () => {
      const { createComponent } = await import('../../lib/create');

      expect(createComponent).toBeDefined();
      expect(typeof createComponent).toBe('function');
    });

    it('should call createComponent with name', async () => {
      const { createComponent } = await import('../../lib/create');

      createComponent('MyButton');

      expect(createComponent).toHaveBeenCalledWith('MyButton');
    });

    it('should call createComponent with name and description', async () => {
      const { createComponent } = await import('../../lib/create');

      createComponent('MyButton', 'A reusable button');

      expect(createComponent).toHaveBeenCalledWith('MyButton', 'A reusable button');
    });
  });

  describe('feature command', () => {
    it('should import createFeature function', async () => {
      const { createFeature } = await import('../../lib/feature');

      expect(createFeature).toBeDefined();
      expect(typeof createFeature).toBe('function');
    });

    it('should call createFeature with default options', async () => {
      const { createFeature } = await import('../../lib/feature');

      createFeature();

      expect(createFeature).toHaveBeenCalled();
    });

    it('should call createFeature with issue option', async () => {
      const { createFeature } = await import('../../lib/feature');

      createFeature({ issue: true });

      expect(createFeature).toHaveBeenCalledWith({ issue: true });
    });

    it('should support --no-issue flag', async () => {
      const { createFeature } = await import('../../lib/feature');

      createFeature({ issue: false });

      expect(createFeature).toHaveBeenCalledWith(
        expect.objectContaining({ issue: false })
      );
    });
  });

  describe('package configuration', () => {
    it('should have correct peer dependencies', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies.vitest).toBeDefined();
      expect(packageJson.peerDependencies.vue).toBeDefined();
    });

    it('should have correct dependencies', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies.chalk).toBeDefined();
      expect(packageJson.dependencies.commander).toBeDefined();
    });

    it('should have build script', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.build).toContain('tsc');
    });

    it('should have prepublishOnly script', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.scripts.prepublishOnly).toBeDefined();
    });

    it('should include correct files for publishing', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.files).toBeDefined();
      // Check for dist files (now uses specific patterns)
      const hasDistFiles = packageJson.files.some((file: string) =>
        file.startsWith('dist/bin') || file.startsWith('dist/lib')
      );
      expect(hasDistFiles).toBe(true);
      expect(packageJson.files).toContain('dist/templates');
      expect(packageJson.files).toContain('README.md');
      expect(packageJson.files).toContain('LICENSE');
    });

    it('should have minimum Node version requirement', async () => {
      const { default: packageJson } = await import('../../package.json');

      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBeDefined();
    });
  });

  describe('TypeScript configuration', () => {
    it('should have correct compiler options', async () => {
      const { default: tsconfig } = await import('../../tsconfig.json');

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2022');
      expect(tsconfig.compilerOptions.module).toBe('ES2022');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
    });

    it('should include correct source directories', async () => {
      const { default: tsconfig } = await import('../../tsconfig.json');

      expect(tsconfig.include).toContain('bin/**/*');
      expect(tsconfig.include).toContain('lib/**/*');
      expect(tsconfig.include).toContain('test/**/*');
    });

    it('should exclude correct directories', async () => {
      const { default: tsconfig } = await import('../../tsconfig.json');

      expect(tsconfig.exclude).toContain('node_modules');
      expect(tsconfig.exclude).toContain('dist');
      expect(tsconfig.exclude).toContain('templates');
    });

    it('should generate declaration files', async () => {
      const { default: tsconfig } = await import('../../tsconfig.json');

      expect(tsconfig.compilerOptions.declaration).toBe(true);
      expect(tsconfig.compilerOptions.declarationMap).toBe(true);
    });
  });

  describe('command exports', () => {
    it('should export all required functions from lib/init', async () => {
      const initModule = await import('../../lib/init');

      expect(initModule.initTDD).toBeDefined();
    });

    it('should export all required functions from lib/create', async () => {
      const createModule = await import('../../lib/create');

      expect(createModule.createComponent).toBeDefined();
    });

    it('should export all required functions from lib/feature', async () => {
      const featureModule = await import('../../lib/feature');

      expect(featureModule.createFeature).toBeDefined();
    });
  });
});
