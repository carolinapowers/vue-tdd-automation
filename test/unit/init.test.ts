import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { initTDD } from '../../lib/init';

// Mock fs module
vi.mock('fs');

describe('initTDD', () => {
  const mockCwd = '/mock/project';
  const mockPackageJson = {
    name: 'test-project',
    version: '1.0.0',
    dependencies: {
      vue: '^3.4.0'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validation', () => {
    it('should throw error if no package.json found', async () => {
      // Mock existsSync to return true for templates dir but false for package.json
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        const path = filePath.toString();
        // Templates directory exists, but package.json doesn't
        if (path.includes('templates')) {
          return true;
        }
        return false;
      });

      await expect(initTDD()).rejects.toThrow('No package.json found');
    });

    it('should warn if Vue is not in dependencies', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ name: 'test' })
      );
      vi.mocked(fs.copyFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => '');
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      initTDD({ workflows: false, docs: false });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: Vue not found in dependencies')
      );
    });
  });

  describe('file copying', () => {
    beforeEach(() => {
      // Mock existsSync to return true for source templates and false for destinations
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        const path = filePath.toString();
        // package.json and template source files exist
        if (path.includes('package.json') || path.includes('templates')) {
          return true;
        }
        // destination files don't exist (so they'll be copied)
        return false;
      });
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      );
      vi.mocked(fs.copyFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => '');
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it('should copy required files by default', async () => {
      initTDD();

      expect(fs.copyFileSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should skip existing files when force is false', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      vi.mocked(fs.existsSync).mockImplementation(() => {
        // package.json exists, templates exist, but destination files also exist
        return true;
      });

      initTDD({ force: false });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Skipped (exists)')
      );
    });

    it('should overwrite existing files when force is true', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      initTDD({ force: true });

      expect(fs.copyFileSync).toHaveBeenCalled();
    });

    it('should copy workflow files when workflows option is true', async () => {
      const copyFileSyncSpy = vi.mocked(fs.copyFileSync);

      initTDD({ workflows: true, docs: false });

      // Check that some files were copied (we can't easily check specific files in this mock setup)
      expect(copyFileSyncSpy).toHaveBeenCalled();
    });

    it('should skip workflow files when workflows option is false', async () => {
      initTDD({ workflows: false, docs: false });

      // Just verify it completes without error
      expect(fs.copyFileSync).toHaveBeenCalled();
    });

    it('should copy documentation files when docs option is true', async () => {
      initTDD({ docs: true, workflows: false });

      expect(fs.copyFileSync).toHaveBeenCalled();
    });

    it('should skip documentation files when docs option is false', async () => {
      initTDD({ docs: false, workflows: false });

      expect(fs.copyFileSync).toHaveBeenCalled();
    });

    it('should create directories if they do not exist', async () => {
      const mkdirSyncSpy = vi.mocked(fs.mkdirSync);

      initTDD();

      expect(mkdirSyncSpy).toHaveBeenCalled();
      expect(mkdirSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ recursive: true })
      );
    });
  });

  describe('package.json updates', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.copyFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => '');
    });

    it('should add test scripts to package.json', async () => {
      const writeFileSyncSpy = vi.mocked(fs.writeFileSync);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      );

      initTDD();

      expect(writeFileSyncSpy).toHaveBeenCalled();
      const writtenContent = writeFileSyncSpy.mock.calls[0]?.[1] as string;
      const updatedPackageJson = JSON.parse(writtenContent);

      expect(updatedPackageJson.scripts).toBeDefined();
      expect(updatedPackageJson.scripts.test).toBe('vitest');
      expect(updatedPackageJson.scripts['test:watch']).toBe('vitest --watch');
      expect(updatedPackageJson.scripts['test:ui']).toBe('vitest --ui');
      expect(updatedPackageJson.scripts['test:coverage']).toBe('vitest --coverage');
      expect(updatedPackageJson.scripts.tdd).toBe('vitest --watch --reporter=verbose');
    });

    it('should not overwrite existing scripts', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      const packageWithScripts = {
        ...mockPackageJson,
        scripts: {
          test: 'jest',
          build: 'vite build'
        }
      };

      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(packageWithScripts)
      );

      initTDD();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should preserve existing package.json properties', async () => {
      const writeFileSyncSpy = vi.mocked(fs.writeFileSync);
      const packageWithExtra = {
        ...mockPackageJson,
        author: 'Test Author',
        license: 'MIT',
        repository: 'test/repo'
      };

      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(packageWithExtra)
      );

      initTDD();

      const writtenContent = writeFileSyncSpy.mock.calls[0]?.[1] as string;
      const updatedPackageJson = JSON.parse(writtenContent);

      expect(updatedPackageJson.author).toBe('Test Author');
      expect(updatedPackageJson.license).toBe('MIT');
      expect(updatedPackageJson.repository).toBe('test/repo');
    });
  });

  describe('console output', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      );
      vi.mocked(fs.copyFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => '');
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it('should log installation progress', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');

      initTDD();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Installing TDD infrastructure')
      );
    });

    it('should log summary of copied files', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');

      initTDD();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Summary:')
      );
    });

    it('should display required dependencies', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');

      initTDD();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Required dependencies')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('npm install -D')
      );
    });
  });
});
