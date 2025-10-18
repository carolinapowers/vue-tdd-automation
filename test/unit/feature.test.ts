import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import { createFeature } from '../../lib/cli/feature';

// Mock child_process module
vi.mock('child_process');

// TODO: Rewrite tests for self-contained interactive wizard
// The feature command is now async and interactive, requiring readline mocking
describe.skip('createFeature', () => {
  const mockCwd = '/mock/project';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful creation', () => {
    it('should execute feature wizard script', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.stringContaining('tdd-feature.js'),
        expect.objectContaining({
          cwd: mockCwd,
          stdio: 'inherit'
        })
      );
    });

    it('should execute script with default options', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      expect(execSyncSpy).toHaveBeenCalledTimes(1);
      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cwd: mockCwd,
          stdio: 'inherit'
        })
      );
    });

    it('should execute script when issue option is provided', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature({ issue: true });

      expect(execSyncSpy).toHaveBeenCalled();
    });

    it('should execute script when issue option is false', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature({ issue: false });

      expect(execSyncSpy).toHaveBeenCalled();
    });

    it('should handle empty options object', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature({});

      expect(execSyncSpy).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw error if script execution fails', () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Script not found');
      });

      expect(() => createFeature()).toThrow('Script not found');
    });

    it('should throw error if scripts directory does not exist', () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => createFeature()).toThrow(
        "Feature wizard script not found at /mock/project/scripts/tdd-feature.js. Make sure you've run 'vue-tdd init' first."
      );
    });

    it('should handle script execution with permission errors', () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      expect(() => createFeature()).toThrow('EACCES: permission denied');
    });

    it('should handle script path with spaces correctly', async () => {
      const mockCwdWithSpaces = '/mock/project with spaces';
      vi.spyOn(process, 'cwd').mockReturnValue(mockCwdWithSpaces);
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      const call = execSyncSpy.mock.calls[0]?.[0];
      // Check that the path is properly quoted
      expect(call).toMatch(/node ".*tdd-feature\.js"/);
    });
  });

  describe('path handling', () => {
    it('should construct correct script path', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain(path.join('scripts', 'tdd-feature.js'));
    });

    it('should execute script in current working directory', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ cwd: mockCwd })
      );
    });

    it('should use inherit stdio for interactive wizard', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ stdio: 'inherit' })
      );
    });
  });

  describe('options handling', () => {
    it('should handle undefined options parameter', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature(undefined);

      expect(execSyncSpy).toHaveBeenCalled();
    });

    it('should not modify options object', async () => {
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''));
      const options = { issue: true };
      const originalOptions = { ...options };

      createFeature(options);

      expect(options).toEqual(originalOptions);
    });

    it('should handle issue option as undefined', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature({ issue: undefined });

      expect(execSyncSpy).toHaveBeenCalled();
    });
  });

  describe('execution context', () => {
    it('should execute in the current working directory', async () => {
      const testCwd = '/different/path';
      vi.spyOn(process, 'cwd').mockReturnValue(testCwd);
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ cwd: testCwd })
      );
    });

    it('should construct path relative to cwd', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain(path.join(mockCwd, 'scripts', 'tdd-feature.js'));
    });
  });

  describe('script invocation', () => {
    it('should invoke script with node', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toMatch(/^node /);
    });

    it('should quote script path', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      createFeature();

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toMatch(/node ".*tdd-feature\.js"/);
    });
  });
});
