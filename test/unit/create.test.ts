import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import { createComponent } from '../../lib/create';

// Mock child_process module
vi.mock('child_process');

describe('createComponent', () => {
  const mockCwd = '/mock/project';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful creation', () => {
    it('should execute create script with component name', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.stringContaining('create-tdd-component.js'),
        expect.objectContaining({
          cwd: mockCwd,
          stdio: 'inherit'
        })
      );
    });

    it('should pass component name to script', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('UserProfile');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('UserProfile');
    });

    it('should use provided description', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton', 'A reusable button component');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('A reusable button component');
    });

    it('should use default description when none provided', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('Component: MyButton');
    });

    it('should use empty string as default description', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton', '');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('Component: MyButton');
    });
  });

  describe('error handling', () => {
    it('should throw error if script execution fails', async () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Script not found');
      });

      await expect(createComponent('MyButton')).rejects.toThrow(
        "Failed to create component. Make sure you've run 'vue-tdd init' first."
      );
    });

    it('should throw error if scripts directory does not exist', async () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      await expect(createComponent('MyButton')).rejects.toThrow(
        "Failed to create component. Make sure you've run 'vue-tdd init' first."
      );
    });

    it('should handle script path with spaces correctly', async () => {
      const mockCwdWithSpaces = '/mock/project with spaces';
      vi.spyOn(process, 'cwd').mockReturnValue(mockCwdWithSpaces);
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      const call = execSyncSpy.mock.calls[0]?.[0];
      // Check that the path is properly quoted
      expect(call).toMatch(/node ".*create-tdd-component\.js"/);
    });
  });

  describe('path handling', () => {
    it('should construct correct script path', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain(path.join('scripts', 'create-tdd-component.js'));
    });

    it('should execute script in current working directory', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ cwd: mockCwd })
      );
    });

    it('should use inherit stdio for real-time output', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton');

      expect(execSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ stdio: 'inherit' })
      );
    });
  });

  describe('component name validation', () => {
    it('should handle PascalCase component names', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyAwesomeButton');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('MyAwesomeButton');
    });

    it('should handle kebab-case component names', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('my-awesome-button');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('my-awesome-button');
    });

    it('should handle single word component names', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('Button');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('Button');
    });
  });

  describe('description handling', () => {
    it('should handle descriptions with special characters', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton', 'A button with "quotes" & special <chars>');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('A button with "quotes" & special <chars>');
    });

    it('should handle multiline descriptions', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton', 'Line 1\nLine 2\nLine 3');

      const call = execSyncSpy.mock.calls[0]?.[0];
      expect(call).toContain('Line 1\nLine 2\nLine 3');
    });

    it('should handle empty string description', async () => {
      const execSyncSpy = vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      await createComponent('MyButton', '');

      expect(execSyncSpy).toHaveBeenCalled();
    });
  });
});
