/**
 * Type-safe JSON parsing utilities
 * Provides validated JSON parsing with TypeScript type guards
 */

/**
 * Safely parse JSON with optional runtime validation
 * @param content - JSON string to parse
 * @param validator - Optional type guard function for runtime validation
 * @returns Parsed and validated object
 * @throws Error if JSON is invalid or validation fails
 */
export function parseJson<T extends object>(
  content: string,
  validator?: (obj: unknown) => obj is T
): T {
  const parsed: unknown = JSON.parse(content);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`JSON parse result is not an object: got ${typeof parsed}`);
  }

  if (validator && !validator(parsed)) {
    throw new Error('JSON validation failed: parsed content does not match expected schema');
  }

  return parsed as T;
}

/**
 * Type guard for PackageJson with version field
 * Used when reading package.json files that must have a version
 */
export function isPackageJsonWithVersion(obj: unknown): obj is { version: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'version' in obj &&
    typeof (obj as { version: unknown }).version === 'string'
  );
}

/**
 * Type guard for PackageJson with optional dependencies/scripts
 * Used when reading package.json files for dependency management
 */
export function isPackageJson(obj: unknown): obj is {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
} {
  if (typeof obj !== 'object' || obj === null) return false;

  const pkg = obj as Record<string, unknown>;

  // If properties exist, validate they're objects
  if (pkg.dependencies !== undefined &&
      (typeof pkg.dependencies !== 'object' || pkg.dependencies === null)) {
    return false;
  }
  if (pkg.devDependencies !== undefined &&
      (typeof pkg.devDependencies !== 'object' || pkg.devDependencies === null)) {
    return false;
  }
  if (pkg.scripts !== undefined &&
      (typeof pkg.scripts !== 'object' || pkg.scripts === null)) {
    return false;
  }

  return true;
}
