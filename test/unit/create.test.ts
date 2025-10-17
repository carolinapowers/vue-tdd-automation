import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createComponent } from '../../lib/cli/create';

// Mock fs module
vi.mock('fs');
vi.mock('chalk', () => ({
  default: {
    green: (str: string) => str,
    blue: (str: string) => str,
    white: (str: string) => str
  }
}));

describe('createComponent', () => {
  const mockCwd = '/mock/project';
  const componentsDir = path.join(mockCwd, 'src', 'components');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock fs functions
    vi.mocked(fs.existsSync).mockReturnValue(false); // No files exist by default
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful creation', () => {
    it('should create test and component files', () => {
      createComponent('MyButton');

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(componentsDir, 'MyButton.test.ts'),
        expect.stringContaining('describe(\'MyButton\'')
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(componentsDir, 'MyButton.vue'),
        expect.stringContaining('<template>')
      );
    });

    it('should use provided description in test file', () => {
      createComponent('MyButton', { description: 'A reusable button component' });

      const testFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.test.ts')
      );
      expect(testFileCall?.[1]).toContain('A reusable button component');
    });

    it('should use default description when none provided', () => {
      createComponent('MyButton');

      const testFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.test.ts')
      );
      expect(testFileCall?.[1]).toContain('Component: MyButton');
    });

    it('should create components directory if it does not exist', () => {
      createComponent('MyButton');

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        componentsDir,
        { recursive: true }
      );
    });

    it('should not create directory if it already exists', () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path === componentsDir;
      });

      createComponent('MyButton');

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw error if test file already exists', () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path.toString().endsWith('.test.ts');
      });

      expect(() => createComponent('MyButton')).toThrow('Test file already exists');
    });

    it('should throw error if component file already exists', () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path.toString().endsWith('.vue');
      });

      expect(() => createComponent('MyButton')).toThrow('Component file already exists');
    });

    it('should throw error for invalid component name', () => {
      expect(() => createComponent('myButton')).toThrow(
        'Component name must start with a capital letter'
      );
    });

    it('should throw error for component name with special characters', () => {
      expect(() => createComponent('My-Button')).toThrow(
        'Component name must start with a capital letter and contain only alphanumeric characters'
      );
    });

    it('should throw error if writeFile fails', () => {
      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      expect(() => createComponent('MyButton')).toThrow('Failed to create files: Permission denied');
    });
  });

  describe('component name validation', () => {
    it('should accept PascalCase component names', () => {
      createComponent('MyAwesomeButton');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should accept single word component names', () => {
      createComponent('Button');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should accept component names with numbers', () => {
      createComponent('Button2');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should reject empty component name', () => {
      expect(() => createComponent('')).toThrow(
        'Component name must start with a capital letter'
      );
    });
  });

  describe('template generation', () => {
    it('should include component name in test template', () => {
      createComponent('MyButton');

      const testFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.test.ts')
      );
      expect(testFileCall?.[1]).toContain('MyButton');
      expect(testFileCall?.[1]).toContain('import MyButton from');
    });

    it('should include data-testid in component template', () => {
      createComponent('MyButton');

      const componentFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.vue')
      );
      expect(componentFileCall?.[1]).toContain('data-testid="mybutton-container"');
    });

    it('should include TODO comments in component template', () => {
      createComponent('MyButton');

      const componentFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.vue')
      );
      expect(componentFileCall?.[1]).toContain('TODO: Implement component');
    });

    it('should include multiple test describe blocks', () => {
      createComponent('MyButton');

      const testFileCall = vi.mocked(fs.writeFileSync).mock.calls.find(
        call => call[0].toString().endsWith('.test.ts')
      );
      const content = testFileCall?.[1] as string;
      expect(content).toContain('Component Initialization');
      expect(content).toContain('Props');
      expect(content).toContain('User Interactions');
      expect(content).toContain('Emitted Events');
      expect(content).toContain('Accessibility');
      expect(content).toContain('Edge Cases');
    });
  });
});
